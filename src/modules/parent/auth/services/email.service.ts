import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SENDER_EMAIL,
      pass: process.env.SENDER_PASSWORD, // App Password (not Gmail login)
    },
  });

  async sendOtpEmail(to: string, otp: string) {
    const mail = await this.transporter.sendMail({
      from: `"PCC" <${process.env.SENDER_EMAIL}>`,
      to,
      subject: 'Your OTP Code',
      html: `<p>Your OTP is <strong>${otp}</strong></p>`,
    });

    console.log('✅ OTP email sent:', mail.messageId);
  }
}
