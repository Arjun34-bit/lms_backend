import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import * as mediasoup from 'mediasoup';
import { MediasoupService } from './mediasoup.service';

@WebSocketGateway({
  namespace: '/mediasoup',
  cors: { origin: process.env.ALLOWED_ORIGIN?.split(','), credentials: true },
})
export class MediasoupGateway {
  @WebSocketServer() server: Server;

  constructor(private readonly mediasoupService: MediasoupService) {}

  handleConnection(socket: Socket) {
    socket.emit('connection-success', { socketId: socket.id });
    console.log(`Client connected: ${socket.id}`);
  }

  handleDisconnect(socket: Socket) {
    console.log(`Client disconnected: ${socket.id}`);
    // Cleanup in all rooms
    this.mediasoupService.handleDisconnect(socket.id);
  }

  @SubscribeMessage('leave-room')
  async handleLeaveRoom(
    socket: Socket,
    { roomId, userName }: { roomId: string; userName: string },
  ) {
    try {
      console.log(`${userName} is leaving room ${roomId}`);

      const producerIds = await this.mediasoupService.handleDisconnect(
        socket.id,
      );

      socket.leave(roomId);

      socket.to(roomId).emit('user-left', {
        message: `${userName} has left the meet.`,
        userName,
        socketId: socket.id,
        roomId,
        producerIds,
      });

      return { success: true };
    } catch (error) {
      console.error('Error handling leave-room:', error);
      return { success: false, error: error.message };
    }
  }

  @SubscribeMessage('join-instructor')
  async handleJoinInstructor(
    socket: Socket,
    { roomId, role }: { roomId: string; role: string },
  ) {
    try {
      const response = await this.mediasoupService.joinInstructor(roomId, role);
      return {
        message: `You have joined the class ${roomId}`,
        data: response,
      };
    } catch (error) {
      console.log(error);
      throw new Error('Failed to Join Room or Create Room', error);
    }
  }

  @SubscribeMessage('join-room')
  async handleJoinRoom(
    socket: Socket,
    {
      roomId,
      userName,
      role,
    }: { roomId: string; userName: string; role: string },
  ) {
    try {
      console.log(`Socket ${socket.id} joining room: ${roomId}`);
      if (role === 'student') {
        let room = await this.mediasoupService.getRoom(roomId, role, socket);
      }
      let room = await this.mediasoupService.getRoom(roomId, role, socket);
      if (!room) {
        room = await this.mediasoupService.createRoom(roomId);
      }
      this.mediasoupService.addPeer(roomId, socket.id, socket);
      socket.join(roomId);

      socket.to(roomId).emit('user-joined', {
        message: `${userName} has joined the Meet.`,
        userName,
        socketId: socket.id,
        roomId,
      });

      return { joined: true, rtpCapabilities: room.router.rtpCapabilities };
    } catch (error) {
      // console.log(error);
      return { params: { error: error.message } };
      // throw new Error('Failed to Join Room or Create Room', error);
    }
  }

  @SubscribeMessage('getRouterRtpCapabilities')
  async handleGetRtpCapabilities(
    socket: Socket,
    { roomId }: { roomId: string },
  ) {
    console.log(
      `Sending routerRtpCapabilities for socket ${socket.id}: and room ${roomId}`,
    );
    const room = await this.mediasoupService.createRoom(roomId);
    console.log(
      `Sending routerRtpCapabilities for socket ${socket.id}:`,
      room.router.rtpCapabilities,
    );

    return { routerRtpCapabilities: room.router.rtpCapabilities };
  }

  @SubscribeMessage('createTransport')
  async handleCreateTransport(
    socket: Socket,
    { roomId, sender }: { roomId: string; sender: boolean },
  ) {
    try {
      const transport = await this.mediasoupService.createWebRtcTransport(
        roomId,
        socket.id,
        sender,
      );
      console.log(
        `Created transport for socket ${socket.id}, sender: ${sender}, room : ${roomId}`,
        transport.id,
      );
      return {
        params: {
          id: transport.id,
          iceParameters: transport.iceParameters,
          iceCandidates: transport.iceCandidates,
          dtlsParameters: transport.dtlsParameters,
        },
      };
    } catch (error: any) {
      console.error(`Error creating transport for ${socket.id}`, error);
      return { params: { error: error.message } };
    }
  }

  @SubscribeMessage('connectProducerTransport')
  async handleConnectProducerTransport(
    socket: Socket,
    {
      roomId,
      dtlsParameters,
    }: { roomId: string; dtlsParameters: mediasoup.types.DtlsParameters },
  ) {
    console.log(
      `Connecting producer transport for socket ${socket.id} and room : ${roomId}`,
    );
    await this.mediasoupService.connectTransport(
      roomId,
      socket.id,
      true,
      dtlsParameters,
    );
    return { success: true };
  }

  @SubscribeMessage('connectConsumerTransport')
  async handleConnectConsumerTransport(
    socket: Socket,
    {
      roomId,
      dtlsParameters,
    }: { roomId: string; dtlsParameters: mediasoup.types.DtlsParameters },
  ) {
    console.log(
      `Connecting consumer transport for socket ${socket.id} and room : ${roomId}`,
    );
    try {
      await this.mediasoupService.connectTransport(
        roomId,
        socket.id,
        false,
        dtlsParameters,
      );
      return { success: true };
    } catch (err) {
      console.error('Error connecting consumer transport:', err);
      return { success: false, error: err.message };
    }
  }

  @SubscribeMessage('transport-produce')
  async handleTransportProduce(
    socket: Socket,
    {
      roomId,
      kind,
      rtpParameters,
      label,
    }: {
      roomId: string;
      kind: mediasoup.types.MediaKind;
      rtpParameters: mediasoup.types.RtpParameters;
      label: string;
    },
  ) {
    try {
      console.log(
        `Producing for socket ${socket.id}, kind: ${kind}, label: ${label} and room : ${roomId}`,
      );

      const producerId = await this.mediasoupService.produce(
        roomId,
        socket.id,
        kind,
        rtpParameters,
        label,
        socket,
      );
      return { id: producerId };
    } catch (error) {
      console.error('Error producing media:', error);
      return { success: false, error: error.message };
    }
  }

  @SubscribeMessage('consumeMedia')
  async handleConsumeMedia(
    socket: Socket,
    {
      roomId,
      rtpCapabilities,
      producerId,
    }: {
      roomId: string;
      rtpCapabilities: mediasoup.types.RtpCapabilities;
      producerId: string;
    },
  ) {
    console.log(`Consuming media for socket ${socket.id} and room : ${roomId}`);
    try {
      const params = await this.mediasoupService.consume(
        roomId,
        socket.id,
        rtpCapabilities,
        producerId,
      );
      console.log(
        `Consumer params for socket ${socket.id} and room : ${roomId}:`,
        params,
      );
      return { params };
    } catch (error: any) {
      const message =
        error instanceof Error
          ? error.message
          : String(error || 'Unknown error');
      return { params: { error: message } };
    }
  }

  @SubscribeMessage('resumePausedConsumers')
  async handleResumePausedConsumers(
    socket: Socket,
    { roomId, producerId }: { roomId: string; producerId: string },
  ) {
    try {
      console.log(
        `Resuming consumers for socket ${socket.id}, producerIds and room : ${roomId}:`,
        producerId,
      );
      await this.mediasoupService.resumeConsumer(roomId, socket.id, producerId);
      return { success: true };
    } catch (error) {
      console.error('Error resuming paused consumers:', error);
      return { success: false, error: error.message };
    }
  }

  @SubscribeMessage('start-recording')
  async handleRecording(
    socket: Socket,
    {
      roomId,
    }: {
      roomId: string;
    },
  ) {
    try {
      console.log('Recording Starting.....');
      const record = await this.mediasoupService.startRecording(roomId,socket.id);
      console.log('Recording Started');
      return { success: true };
    } catch (error) {
      console.error('Error in starting recording:', error);
      return { success: false, error: error.message };
    }
  }

  @SubscribeMessage('stop-recording')
  async handleStopRecording(
    socket: Socket,
    {
      roomId,
    }: {
      roomId: string;
    },
  ) { 
    try {
      const user = socket.data.user;
      console.log(user)
      const record = await this.mediasoupService.stopRecording(roomId,user);
      return { success: true };
    } catch (error) {
      console.error('Error in stoping recording:', error);
      return { success: false, error: error.message };
    }
  }
}
