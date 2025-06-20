import { Injectable } from '@nestjs/common';
import * as mediasoup from 'mediasoup';
import { Socket } from 'socket.io';

interface Peer {
  socket: Socket;
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

  constructor() {
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

    room.peers.set(peerId, {
      socket,
      transports: {},
      producers: new Map(),
      consumers: new Map(),
    });

    this.broadcastRoomUserCount(roomId);
  }

  removePeer(roomId: string, peerId: string) {
    const room = this.rooms.get(roomId);
    if (!room) return;
    room.peers.delete(peerId);
  }

  handleDisconnect(peerId: string) {
    for (const [roomId, room] of this.rooms.entries()) {
      const peer = room.peers.get(peerId);
      if (!peer) continue;

      console.log(`Cleaning up resources for peer ${peerId} in room ${roomId}`);

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
  }

  getRouterRtpCapabilities(roomId: string) {
    const room = this.rooms.get(roomId);
    if (!room) throw new Error(`Router not found for roomId: ${roomId}`);
    return room.router.rtpCapabilities;
  }

  async createWebRtcTransport(roomId: string, peerId: string, sender: boolean) {
    console.log('roomId', roomId);
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
    if (!transport) throw new Error('Transport not found');
    await transport.connect({ dtlsParameters });

    if (sender) {
      console.log(
        `Producer transport connected for room : ${roomId} and peer ${peerId}`,
      );
    } else {
      console.log(
        `Consumer transport connected for room : ?${roomId} and peer ${peerId}`,
      );
    }
  }

  async produce(
    roomId: string,
    peerId: string,
    kind: mediasoup.types.MediaKind,
    rtpParameters: mediasoup.types.RtpParameters,
    label: string = '',
  ) {
    const peer = this.rooms.get(roomId)?.peers.get(peerId);
    const transport = peer?.transports.producer;
    if (!transport) throw new Error('Producer transport not found');

    const producer = await transport.produce({ kind, rtpParameters });
    peer.producers.set(`${kind}:${label}`, producer);

    for (const [otherId, otherPeer] of this.rooms.get(roomId).peers.entries()) {
      if (otherId !== peerId) {
        console.log('new-producer-emitiing', otherId);
        otherPeer.socket.to(roomId).emit('new-producer', {
          roomId,
          producerId: producer.id,
          peerId,
          kind,
          label,
        });
      }
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
      paused: producer.kind === 'video',
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
    const consumer = this.rooms
      .get(roomId)
      ?.peers.get(peerId)
      ?.consumers.get(producerId);
    console.log('Resuming the stream for room :', roomId);
    if (consumer) await consumer.resume();
  }
}
