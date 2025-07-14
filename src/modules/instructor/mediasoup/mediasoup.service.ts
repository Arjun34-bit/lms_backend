import { Injectable } from '@nestjs/common';
import * as mediasoup from 'mediasoup';
import { Socket } from 'socket.io';
import { ReelService } from '../reel/service/reel.service';
import { Multer } from 'multer';
import { CreateReelDto } from '../reel/dto/reelUpload.dto';

import { InstructorJwtDto } from '@modules/common/dtos/instructor-jwt.dto';

import * as puppeteer from 'puppeteer';
import { exec, ChildProcess, spawn } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';
import * as ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import { Readable } from 'stream';

import getPort from "get-port";


interface Peer {
  socket: Socket;
  announcedProducers: Set<string>;
  transports: {
    producer?: mediasoup.types.WebRtcTransport;
    consumer?: mediasoup.types.WebRtcTransport;
  };
  producers: Map<string, mediasoup.types.Producer>;
  consumers: Map<string, mediasoup.types.Consumer>;
}

interface Room {
  router: mediasoup.types.Router;
  peers: Map<string, Peer>;
}

@Injectable()
export class MediasoupService {
  private worker: mediasoup.types.Worker;
  private rooms: Map<string, Room> = new Map();

  private browserMap: Map<string, puppeteer.Browser> = new Map();
  private ffmpegMap: Map<
    string,
    { ffmpegProcess: ChildProcess; outputFile: string }
  > = new Map();

  constructor(private readonly reelService: ReelService) {
    this.initializeWorker();
  }

  private async initializeWorker() {
    this.worker = await mediasoup.createWorker({
      rtcMinPort: 2000,
      rtcMaxPort: 2020,
    });
    console.log(`Worker process ID ${this.worker.pid}`);

    this.worker.on('died', () => {
      console.error('mediasoup worker has died');
      setTimeout(() => process.exit(), 2000);
    });
  }

  broadcastRoomUserCount(roomId: string) {
    const room = this.rooms.get(roomId);
    if (!room) return;

    const userCount = room.peers.size;

    for (const peer of room.peers.values()) {
      peer.socket.emit('room-user-count', { roomId, userCount });
    }
  }

  joinInstructor(roomId: string, role: string) {
    if (role === 'instructor') {
      console.log(`Instructor joined class: ${roomId}`);
      // socket.emit("joinInstructorResponse", {
      //   message: `You have joined the class ${roomId}`,
      //   roomId,
      // });
    } else {
      console.log(`Student joined class: ${roomId}`);
    }
  }

  async createRoom(roomId: string): Promise<Room> {
    if (this.rooms.has(roomId)) return this.rooms.get(roomId);

    const mediaCodecs: mediasoup.types.RtpCodecCapability[] = [
      {
        kind: 'audio',
        mimeType: 'audio/opus',
        clockRate: 48000,
        channels: 2,
        preferredPayloadType: 96,
        rtcpFeedback: [{ type: 'nack' }, { type: 'nack', parameter: 'pli' }],
      },
      {
        kind: 'video',
        mimeType: 'video/VP8',
        clockRate: 90000,
        preferredPayloadType: 97,
        parameters: { 'x-google-start-bitrate': 1000 },
        rtcpFeedback: [
          { type: 'nack' },
          { type: 'ccm', parameter: 'fir' },
          { type: 'goog-remb' },
        ],
      },
    ];

    const router = await this.worker.createRouter({ mediaCodecs });
    const room: Room = { router, peers: new Map() };
    this.rooms.set(roomId, room);
    console.log('Router added in Rooms', this.rooms.values());
    return room;
  }

  addPeer(roomId: string, peerId: string, socket: Socket) {
    const room = this.rooms.get(roomId);
    if (!room) throw new Error('Room not found');
    console.log('PeerId id user', peerId);

    room.peers.set(peerId, {
      socket,
      transports: {},
      producers: new Map(),
      consumers: new Map(),
      announcedProducers: new Set(),
    });

    this.broadcastRoomUserCount(roomId);

    for (const [existingPeerId, existingPeer] of room.peers.entries()) {
      if (existingPeerId === peerId) continue;

      for (const [key, producer] of existingPeer.producers.entries()) {
        const [kind, label] = key.split(':');

        const alreadyAnnounced = room.peers
          .get(peerId)
          ?.announcedProducers?.has(producer.id);

        if (alreadyAnnounced) continue;

        socket.emit('new-producer', {
          roomId,
          producerId: producer.id,
          peerId: existingPeerId,
          kind,
          label,
        });

        room.peers.get(peerId)?.announcedProducers?.add(producer.id);

        console.log(
          `[addPeer] Notified peer ${peerId} of producer ${producer.id} from ${existingPeerId}`,
        );
      }
    }
  }

  removePeer(roomId: string, peerId: string) {
    const room = this.rooms.get(roomId);
    if (!room) return;
    room.peers.delete(peerId);
  }

  handleDisconnect(peerId: string) {
    let producerIds: string[] = [];
    for (const [roomId, room] of this.rooms.entries()) {
      const peer = room.peers.get(peerId);
      if (!peer) continue;

      console.log(`Cleaning up resources for peer ${peerId} in room ${roomId}`);

      producerIds = Array.from(peer.producers.keys());

      // Close all producers
      for (const [producerKey, producer] of peer.producers.entries()) {
        try {
          producer.close();
          console.log(`Closed producer ${producerKey} for peer ${peerId}`);
        } catch (err) {
          console.warn(`Failed to close producer ${producerKey}:`, err);
        }
      }

      // Close all consumers
      for (const [consumerId, consumer] of peer.consumers.entries()) {
        try {
          consumer.close();
          console.log(`Closed consumer ${consumerId} for peer ${peerId}`);
        } catch (err) {
          console.warn(`Failed to close consumer ${consumerId}:`, err);
        }
      }

      // Close transports
      const { producer, consumer } = peer.transports;
      if (producer) {
        try {
          producer.close();
          console.log(`Closed producer transport for peer ${peerId}`);
        } catch (err) {
          console.warn(`Failed to close producer transport:`, err);
        }
      }
      if (consumer) {
        try {
          consumer.close();
          console.log(`Closed consumer transport for peer ${peerId}`);
        } catch (err) {
          console.warn(`Failed to close consumer transport:`, err);
        }
      }

      // Remove peer from room
      room.peers.delete(peerId);
      console.log(`Peer ${peerId} removed from room ${roomId}`);

      // If room is empty, delete it
      if (room.peers.size === 0) {
        try {
          room.router.close();
          this.rooms.delete(roomId);
          console.log(`Room ${roomId} closed and deleted`);
        } catch (err) {
          console.warn(`Failed to close router for room ${roomId}:`, err);
        }
      }

      break;
    }
    return producerIds;
  }

  getRouterRtpCapabilities(roomId: string) {
    const room = this.rooms.get(roomId);
    console.log('room', room);
    if (!room) throw new Error(`Router not found for roomId: ${roomId}`);
    return room.router.rtpCapabilities;
  }

  async getRoom(roomId: string, role: string, socket: Socket): Promise<Room> {
    const room = this.rooms.get(roomId);
    if (role === 'student') {
      if (!room) {
        throw new Error('Room Not Found');
      }
    } else {
      return room;
    }
  }

  async createWebRtcTransport(roomId: string, peerId: string, sender: boolean) {
    const room = this.rooms.get(roomId);
    if (!room) throw new Error('Room not found');

    const transport = await room.router.createWebRtcTransport({
      listenIps: [{ ip: '127.0.0.1' }],
      enableUdp: true,
      enableTcp: true,
      preferUdp: true,
    });

    console.log(
      `Transport created for room : ${roomId} and  peer ${peerId}: ${transport.id}`,
    );

    console.log('Peers in createWebRTC', room.peers.values());

    const peer = room.peers.get(peerId);
    if (!peer) throw new Error('Peer not found');

    if (sender) {
      peer.transports.producer = transport;
    } else {
      peer.transports.consumer = transport;
    }

    return transport;
  }

  async connectTransport(
    roomId: string,
    peerId: string,
    sender: boolean,
    dtlsParameters: mediasoup.types.DtlsParameters,
  ) {
    const peer = this.rooms.get(roomId)?.peers.get(peerId);
    const transport = sender
      ? peer?.transports.producer
      : peer?.transports.consumer;
    if (!transport) throw new Error('Transports not found');
    console.log('Transport Variables', transport);
    if (transport.dtlsState === 'connected') {
      console.warn(
        `Transport already connected for ${peerId} in room ${roomId}`,
      );
      return;
    }
    try {
      await transport.connect({ dtlsParameters });
    } catch (err) {
      console.error(`Error connecting transport: ${err.message}`);
      throw err;
    }

    console.log(
      `${sender ? 'Producer' : 'Consumer'} transport connected for ${peerId} in room ${roomId}`,
    );
  }

  async produce(
    roomId: string,
    peerId: string,
    kind: mediasoup.types.MediaKind,
    rtpParameters: mediasoup.types.RtpParameters,
    label: string = '',
    socket: Socket,
  ) {
    const room = this.rooms.get(roomId);
    const peer = this.rooms.get(roomId)?.peers.get(peerId);
    const transport = peer?.transports.producer;
    if (!transport) throw new Error('Producer transport not found');

    const producer = await transport.produce({ kind, rtpParameters });
    peer.producers.set(`${kind}:${label}`, producer);

    console.log('Producers Id', producer?.id);

    for (const [otherPeerId, otherPeer] of room.peers.entries()) {
      if (otherPeerId === peerId) continue;

      if (otherPeer.announcedProducers.has(producer.id)) continue;

      otherPeer.socket.emit('new-producer', {
        roomId,
        producerId: producer.id,
        peerId: peerId,
        kind,
        label,
      });

      otherPeer.announcedProducers.add(producer.id);

      console.log(
        `[produce] Emitted new-producer to ${otherPeerId} for producer ${producer.id}`,
      );
    }

    producer.on('transportclose', () => {
      console.log(`Producer transport closed for ${kind} (${label})`);
      producer.close();
      peer.producers.delete(`${kind}:${label}`);
    });

    return producer.id;
  }

  async consume(
    roomId: string,
    peerId: string,
    rtpCapabilities: mediasoup.types.RtpCapabilities,
    producerId: string,
  ) {
    const room = this.rooms.get(roomId);
    const peer = room?.peers.get(peerId);
    const transport = peer?.transports.consumer;
    if (!room || !peer || !transport) throw new Error('Missing resources');

    const producer = [...room.peers.values()]
      .flatMap((p) => [...p.producers.values()])
      .find((p) => p.id === producerId);
    if (!producer || !room.router.canConsume({ producerId, rtpCapabilities })) {
      throw new Error('Cannot consume');
    }

    const consumer = await transport.consume({
      producerId,
      rtpCapabilities,
      paused: true,
    });
    peer.consumers.set(producer.id, consumer);

    consumer.on('transportclose', () => {
      consumer.close();
      peer.consumers.delete(producer.id);
    });
    consumer.on('producerclose', () => {
      consumer.close();
      peer.consumers.delete(producer.id);
    });

    return {
      producerId: producer.id,
      id: consumer.id,
      kind: producer.kind,
      rtpParameters: consumer.rtpParameters,
    };
  }

  async resumeConsumer(roomId: string, peerId: string, producerId: string) {
    const room = this.rooms.get(roomId);
    if (!room) {
      console.log(`Room not found: ${roomId}`);
      return;
    }

    const peer = room.peers.get(peerId);
    if (!peer) {
      console.log(`Peer not found: ${peerId}`);
      return;
    }

    const consumer = peer.consumers.get(producerId);
    if (!consumer) {
      console.log(`Consumer not found for producerId: ${producerId}`);
      return;
    }

    try {
      console.log(`Resuming consumer for room: ${roomId}, peer: ${peerId}`);
      await consumer.resume();
      console.log('Consumer resumed successfully.');
    } catch (err) {
      console.error('Error resuming consumers:', err);
      throw new Error('Error resuming consumer');
    }
  }

  async startRecording(roomId: string, peerId: string) {
    const ffmpegInputs = [];
    const videoLabels = [];
    const audioLabels = [];

    let inputIndex = 0;

    const room = this.rooms.get(roomId);
    if (!room) throw new Error('Room not found');

    const peer = room.peers.get(peerId);
    if (!peer) throw new Error('Peer not found in the room');

    for (const [key, producer] of peer.producers.entries()) {
      const port = await getPort();      
      const rtcPort = await getPort(); 

      const plainTransport = await room.router.createPlainTransport({
        listenIp: { ip: '127.0.0.1' },
        rtcpMux: false,
        comedia: true,
      });

      await plainTransport.connect({
        ip: '127.0.0.1',
        port,
        rtcpPort: rtcPort,
      });

      const consumer = await plainTransport.consume({
        producerId: producer.id,
        rtpCapabilities: room.router.rtpCapabilities,
        paused: true,
      });

      await consumer.resume();

      if (producer.paused) {
        await producer.resume();
      }

      ffmpegInputs.push('-i', `udp://127.0.0.1:${port}`);

      if (producer.kind === 'video') {
        videoLabels.push(`[${inputIndex}:v]`);
      } else {
        audioLabels.push(`[${inputIndex}:a]`);
      }

      inputIndex++;
    }

    console.log('videoLables', videoLabels);
    console.log('audioLabels', audioLabels);

    const outputDir = path.join(process.cwd(), 'recordings');

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputFile = path.join(outputDir, `meeting-${Date.now()}.mp4`);
    // const outputFile = `meeting-${Date.now()}.mp4`
    const ffmpeg = this.spawnFFmpeg(
      ffmpegInputs,
      videoLabels,
      audioLabels,
      outputFile,
    );
    this.ffmpegMap.set(roomId, { ffmpegProcess: ffmpeg, outputFile });
  }

  private spawnFFmpeg(
    inputs: string[],
    videoLabels: string[],
    audioLabels: string[],
    outputFile: string,
  ) {
    if (!videoLabels.length && !audioLabels.length) {
      throw new Error('Missing audio or video streams');
    }
    console.log('inputs', inputs);
    const filters = [];

    if (videoLabels.length > 1) {
      const gridCols = Math.ceil(Math.sqrt(videoLabels.length));
      const layout = videoLabels
        .map(
          (_, i) => `${(i % gridCols) * 640}_${Math.floor(i / gridCols) * 480}`,
        )
        .join('|');
      filters.push(
        `${videoLabels.join('')}xstack=inputs=${videoLabels.length}:layout=${layout}[vout]`,
      );
    } else if (videoLabels.length === 1) {
      filters.push(`${videoLabels[0]}copy[vout]`);
    }

    if (audioLabels.length > 1) {
      filters.push(
        `${audioLabels.join('')}amix=inputs=${audioLabels.length}[aout]`,
      );
    } else if (audioLabels.length === 1) {
      filters.push(`${audioLabels[0]}anull[aout]`);
    }

    const args = [
      ...inputs,
      '-filter_complex',
      filters.join(';'),
      ...(videoLabels.length ? ['-map', '[vout]'] : []),
      ...(audioLabels.length ? ['-map', '[aout]'] : []),
      '-c:v',
      '-t','10',
      'libx264',
      ...(audioLabels.length ? ['-c:a', 'aac'] : []),
      '-preset',
      'veryfast',
      '-tune',
      'zerolatency',
      '-y',
      outputFile,
    ];

    console.log('Spawning FFmpeg with args:', args.join(' '));

    console.log('Using FFmpeg path:', ffmpegInstaller.path);

    const ffmpeg = spawn(ffmpegInstaller.path, args);

    ffmpeg.stderr.on('data', (data) => {
      console.log(`FFmpeg: ${data}`);
    });

    ffmpeg.on('close', (code, signal) => {
      if (code !== null) {
        console.log(`FFmpeg exited with code ${code}`);
      } else if (signal !== null) {
        console.log(`FFmpeg was killed by signal ${signal}`);
      } else {
        console.log('FFmpeg exited with unknown reason (no code or signal)');
      }
    });

    ffmpeg.on('error', (err) => {
      console.error('FFmpeg process error:', err);
    });

    return ffmpeg;
  }

  async stopRecording(roomId: string, user: InstructorJwtDto) {
    const recording = this.ffmpegMap.get(roomId);
    // console.log('recording', recording);
    if (!recording) throw new Error('No active recording for this room');

    const { ffmpegProcess, outputFile } = recording;

    console.log('outputFile', outputFile);
    // console.log('process', process);


    return new Promise((resolve, reject) => {
      ffmpegProcess.once('close', async (code, signal) => {
        console.log(`FFmpeg exited with code ${code}, signal ${signal}`);
        try {
          if (!fs.existsSync(outputFile)) {
            throw new Error(`Recording file not found at ${outputFile}`);
          }
          const buffer = fs.readFileSync(outputFile);

          console.log('buffer', buffer);

          const fakeFile: Multer.File = {
            fieldname: 'file',
            originalname: `recording-${roomId}.mp4`,
            encoding: '7bit',
            mimetype: 'video/mp4',
            size: buffer.length,
            buffer,
            destination: '',
            filename: '',
            path: '',
            stream: Readable.from(buffer),
          };

          const dto: CreateReelDto = {
            title: `Class Recording - ${new Date().toLocaleString()}`,
            description: 'Auto-recorded session',
            courseId: '0',
            courseLessionId: null,
          };

          const reel = await this.reelService.uploadReel(dto, user, fakeFile);

          fs.unlinkSync(outputFile);
          this.ffmpegMap.delete(roomId);

          console.log('reel', reel);
          resolve(reel);
        } catch (err) {
          console.error('Failed to process recording upload:', err);
          reject(err);
        }
      });
      ffmpegProcess.kill('SIGINT');
    });
  }
}
