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
      // 1. Check if already enrolled (with a successful buy)
      const alreadyEnrolled = await this.prisma.studentCourseEnrolled.findFirst({
        where: {
          courseId,
          studentId,
          courseBuy: {
            status: PaymentStatusEnum.COMPLETED,
          },
        },
      });
  
      if (alreadyEnrolled) {
        throw new BadRequestException('You have already enrolled in this course');
      }
  
      // 2. Fetch course
      const course = await this.prisma.course.findUnique({
        where: { id: courseId, approvalStatus: AdminApprovalEnum.approved },
      });
  
      if (!course) {
        throw new NotFoundException('Course not found');
      }
  
      // 3. Create Razorpay order
      const order = await this.razorpay.orders.create({
        amount: course.price * 100,
        currency: 'INR',
        receipt: `receipt_${Date.now()}`,
        payment_capture: true,
      });
  
      // 4. Create Enrollment (first!)
      const enrollment = await this.prisma.studentCourseEnrolled.create({
        data: {
          courseId,
          studentId,
        },
      });
  
      // 5. Now create CourseBuy using enrollment ID
      const courseBuy = await this.prisma.courseBuy.create({
        data: {
          courseId,
          studentId,
          amount: course.price,
          razorpayOrderId: order.id,
          status: PaymentStatusEnum.PENDING,
          courseEnrollmentId: enrollment.id,
        },
      });
  
      return { order, courseBuy };
    } catch (error) {
      if (error.statusCode === 500) Logger.error(error?.stack);
      throw error;
    }
  }
  

  async verifyPayment(paymentData: any) {
    const { razorpay_payment_id, razorpay_order_id } = paymentData;
  
    const courseBuyOrder = await this.prisma.courseBuy.findUnique({
      where: { razorpayOrderId: razorpay_order_id },
    });
  
    if (!courseBuyOrder) {
      throw new NotFoundException('Order not found');
    }
  
    const updatedCourseBuy = await this.prisma.courseBuy.update({
      where: { id: courseBuyOrder.id },
      data: {
        status: PaymentStatusEnum.COMPLETED,
        razorpayPaymentId: razorpay_payment_id,
      },
    });
  
    return {
      success: true,
      message: 'Payment verified and course enrollment activated',
    };
  }
  
}
