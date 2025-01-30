import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { AdminApprovalEnum, PaymentStatusEnum } from '@prisma/client';
import { envConstant } from '@constants/index';
import Razorpay from 'razorpay';
import { PrismaService } from 'src/prisma/prisma.service';
import * as crypto from 'crypto';

@Injectable()
export class CourseService {
  private razorpay: Razorpay;
  constructor(private readonly prisma: PrismaService) {
    this.razorpay = new Razorpay({
      key_id: envConstant.RAZORPAY_KEY_ID,
      key_secret: envConstant.RAZORPAY_KEY_SECRET,
    });
  }

  async buyCourse(studentId: string, courseId: string) {
    try {
      const checkCourseEnrollment =
        await this.prisma.studentCourseEnrolled.count({
          where: {
            courseId,
            studentId,
            courseBuy: {
              status: PaymentStatusEnum.COMPLETED,
            },
          },
        });
      if (checkCourseEnrollment) {
        throw new BadRequestException('Already enrolled this course');
      }

      // Fetch course details
      const course = await this.prisma.course.findUnique({
        where: { id: courseId, approvalStatus: AdminApprovalEnum.approved },
      });

      if (!course) {
        throw new NotFoundException('Course not found');
      }

      // Create Razorpay order
      const order = await this.razorpay.orders.create({
        amount: course.price * 100, // Convert to paise
        currency: 'INR',
        receipt: `receipt_${Date.now()}`,
        payment_capture: true, // Auto capture
      });

      // Save order details in database
      const courseEnroll = await this.prisma.studentCourseEnrolled.create({
        data: {
          courseId,
          studentId,
          courseBuy: {
            create: {
              razorpayPaymentId: order.id,
              amount: course.price,
              status: PaymentStatusEnum.PENDING,
            },
          },
        },
        include: {
          courseBuy: true,
        },
      });

      return { order, courseEnroll };
    } catch (error) {
      if (error.statusCode === 500) {
        Logger.error(error?.stack);
      }
      throw error;
    }
  }

  async verifyPayment(paymentData: any) {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
        paymentData;

      // Fetch order details from DB
      const order = await this.prisma.courseBuy.findUnique({
        where: { razorpayPaymentId: razorpay_order_id },
      });

      if (!order) {
        throw new NotFoundException('Order not found');
      }

      // Generate HMAC signature
      const hmac = crypto.createHmac('sha256', envConstant.RAZORPAY_KEY_SECRET);
      hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
      const generatedSignature = hmac.digest('hex');

      if (generatedSignature !== razorpay_signature) {
        throw new BadRequestException('Invalid payment signature');
      }

      // Update payment status in DB
      await this.prisma.courseBuy.update({
        where: { razorpayPaymentId: razorpay_order_id },
        data: {
          status: PaymentStatusEnum.COMPLETED,
          razorpayPaymentId: razorpay_payment_id,
        },
      });

      return { success: true, message: 'Payment verified successfully' };
    } catch (error) {
      if (error.statusCode === 500) {
        Logger.error(error?.stack);
      }
      throw error;
    }
  }
}
