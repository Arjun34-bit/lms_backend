import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Redis } from 'ioredis';
import { envConstant } from '@constants/index';
import { PrismaService } from 'src/prisma/prisma.service';
import { EmailService } from '@modules/common/email/email.service';

const redis = new Redis({
  host: envConstant.REDIS_HOST,
  port: envConstant.REDIS_PORT,
  db: envConstant.REDIS_DB
});

@WebSocketGateway({ namespace: '/webRTC',cors: true })
export class WebrtcGateway implements OnGatewayInit {
  @WebSocketServer() server: Server;
constructor(private prisma: PrismaService,private studentEmailService: EmailService) {
  }
  afterInit(server: Server) {
    console.log('WebRTC Signaling Server Initialized');
  }

  @SubscribeMessage('joinInstructor')
  async handleJoinInstructor(
    client: Socket,
    payload: { classId: string; role: string, courseId: string },
  ) {
    const { classId, role,courseId='' } = payload;
    if(!courseId){
  this.server.to(client.id).emit('joinInstructorError', {
    message: `Course ID is required`,
    classId,
  } );
  return;
    }
    if (role === 'instructor') {
      await redis.set(`instructor:${classId}`, client.id);
      client.join(classId);
      console.log(`Instructor joined class: ${classId}`);
      //get all  student in courseId
      const students =await this.prisma.studentCourseEnrolled.findMany({
        where:{
          courseId:courseId,
          courseBuy: {
         status: 'COMPLETED',   
          }
        }, 
        include:{
          student:{
            include:{
           user:true,  
            }
          } 
        } 

      })
      if (!students || students.length === 0) {
        this.server.to(client.id).emit('joinInstructorError', {
          message: `No students found in course ${courseId}`,
          classId,
        });
        return;
      }
      for (const student of students) {
       this.studentEmailService.sendLiveClassInvitationEmail(student.student.user?.email,courseId); 
      }
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
    payload: { userId: string, signal: string },
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
}
