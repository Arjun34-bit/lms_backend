import { Injectable } from '@nestjs/common';
import Razorpay from 'razorpay';

@Injectable()
export class PaymentService {
  private razorpay: Razorpay;

  constructor() {
    this.razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }

  async createOrder(amount: number) {
    const options = {
      amount: amount * 100,
      currency: 'INR',
      receipt: 'receipt_order_' + Math.floor(Math.random() * 10000),
    };

    return await this.razorpay.orders.create(options);
  }
}
