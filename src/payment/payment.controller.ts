import { Controller, Post, Body, Get, Param, Delete } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('create')
  async createPayment(
    @Body('customerEmail') customerEmail: string,
    @Body('cartItems') cartItems: any[],
    @Body('coupon') coupon?: string,
  ) {
    return await this.paymentService.createPayment(
      customerEmail,
      cartItems,
      coupon,
    );
  }

  @Post('confirm')
  async confirmPayment(@Body('transactionId') transactionId: string) {
    return await this.paymentService.confirmPayment(transactionId);
  }

  @Get('user/:email')
  async getPaymentsByEmail(@Param('email') email: string) {
    return await this.paymentService.getPaymentsByEmail(email);
  }

  // New endpoint to delete all payments by email
  @Delete('user/:email')
  async deletePaymentsByEmail(@Param('email') email: string) {
    return await this.paymentService.deletePaymentsByEmail(email);
  }
}
