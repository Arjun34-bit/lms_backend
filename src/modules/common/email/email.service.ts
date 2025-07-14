// src/firebase.service.ts
import { Inject, Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { envConstant } from '@constants/index';
import { RoleEnum } from '@prisma/client';
import { v4 as uuid4 } from 'uuid';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class EmailService {
  sendEmailOtpapp: any;
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  @OnEvent('user.sendVerificationLink')
  async handleUserCreatedEvent(payload: {email: string, role: RoleEnum}) {
    await this.sendVerificationEmail(payload.email, payload.role)
  }

  async generateUserVerificationLink(email: string, role: RoleEnum) {
    const verificationToken = uuid4();
    const link = `${envConstant.BASE_URL}/api/${role}/auth/verify-email?token=${verificationToken}`;
    const cacheKey = `user-verification:${verificationToken}`;
    const userData = {
      email,
      role
    }
    await this.cacheManager.set(cacheKey, JSON.stringify(userData), 10 * 60 * 1000);
    return link;
  }

  async sendVerificationEmail(email: string, role: RoleEnum) {
    const link = await this.generateUserVerificationLink(email, role);

    // Set up Nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: envConstant.SENDER_EMAIL,
        pass: envConstant.SENDER_PASSWORD,
      },
    });

    const mailOptions = {
      from: envConstant.SENDER_EMAIL,
      to: email,
      subject: 'Email Verification',
      html: `<p>Please click the link to verify your email: <a href="${link}">Verify Email</a></p>`,
    };

    await transporter.sendMail(mailOptions);
  }

  async sendLiveClassInvitationEmail(email: string, link: string) {
    // Set up Nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: envConstant.SENDER_EMAIL,
        pass: envConstant.SENDER_PASSWORD,
      },
      
    }); 
    const mailOptions = {
      from: envConstant.SENDER_EMAIL,
      to: email,
      subject: 'Live Class Invitation', 
    }
    await transporter.sendMail(mailOptions);


  }
      
}
