import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Redis } from 'ioredis';

const redis = new Redis();

@WebSocketGateway({ cors: true })
export class WebrtcGateway implements OnGatewayInit {
  @WebSocketServer() server: Server;

  afterInit(server: Server) {
    console.log('WebRTC Signaling Server Initialized');
  }

  @SubscribeMessage('joinInstructor')
  async handleJoinInstructor(
    client: Socket,
    payload: { classId: string; role: string },
  ) {
    const { classId, role } = payload;
    if (role === 'instructor') {
      await redis.set(`instructor:${classId}`, client.id);
      client.join(classId);
      console.log(`Instructor joined class: ${classId}`);
      this.server.to(client.id).emit('joinInstructorResponse', {
        message: `You have joined the class ${classId}`,
        classId,
      });
    }
  }

  @SubscribeMessage('joinStudent')
  async handleJoinStudent(
    client: Socket,
    payload: { userId: string; name: string; role: string; classId: string },
  ) {
    try {
      const { userId, name, role, classId } = payload;
      if (role === 'student') {
        await redis.hset(
          `student:${classId}`,
          userId,
          JSON.stringify({ name, socketId: client.id }),
        );
        client.join(classId);
        console.log(`Student ${name} (ID: ${userId}) joined class ${classId}`);

        // Notify the class that a student has joined
        this.server.to(classId).emit('joinStudentResponse', {
          message: `${name} has joined the class.`,
          classId,
          studentSocketId: client.id,
        });
      }
    } catch (error) {
      console.error('Error in joinStudent:', error);
    }
  }

  // for video streaming
  @SubscribeMessage('signal')
  async handleSignal(
    client: Socket,
    payload: { userId:string, signal:string },
  ) {
    const { userId, signal } = payload;
    this.server.to(userId).emit("signal", { userId: client.id, signal });
  }

  @SubscribeMessage('offer')
  handleOffer(
    client: Socket,
    payload: { roomId: string; offer: RTCSessionDescriptionInit },
  ) {
    client.broadcast
      .to(payload.roomId)
      .emit('offer', { sender: client.id, offer: payload.offer });
  }

  @SubscribeMessage('answer')
  handleAnswer(
    client: Socket,
    payload: { roomId: string; answer: RTCSessionDescriptionInit },
  ) {
    client.broadcast
      .to(payload.roomId)
      .emit('answer', { sender: client.id, answer: payload.answer });
  }

  @SubscribeMessage('ice-candidate')
  handleIceCandidate(
    client: Socket,
    payload: { roomId: string; candidate: RTCIceCandidate },
  ) {
    client.broadcast.to(payload.roomId).emit('ice-candidate', {
      sender: client.id,
      candidate: payload.candidate,
    });
  }

  // @SubscribeMessage('disconnect')
  // async handleDisconnect(client: Socket) {
  //   try {
  //     console.log(`User with socketId ${client.id} is disconnected`);
  //     // Check if the disconnected user is an instructor
  //     const instructorKeys = await redis.keys("instructor:*");
  //     await Promise.all(
  //       instructorKeys.map(async (key) => {
  //         const instructorSocketId = await redis.get(key);
  //         if (instructorSocketId === client.id) {
  //           await redis.del(key);
  //           console.log(`Instructor removed: ${key}`);
  //         }
  //       })
  //     );

  //     // Check if the disconnected user is a student
  //     const studentKeys = await redis.keys("student:*");
  //     await Promise.all(
  //       studentKeys.map(async (classKey) => {
  //         const students = await redis.hgetall(classKey);
  //         for (const [studentId, studentData] of Object.entries(students)) {
  //           try {
  //             const parsedData = JSON.parse(studentData);
  //             if (parsedData.socketId === client.id) {
  //               await redis.hdel(classKey, studentId);
  //               console.log(`Student removed: ${studentId} from class ${classKey}`);
  //               break;
  //             }
  //           } catch (error) {
  //             console.error(`Error parsing student data: ${studentData}`, error);
  //           }
  //         }
  //       })
  //     );
  //   } catch (error) {
  //     console.error("Error in disconnect handler:", error);
  //   }
  // }
}
