import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './payment.entity';
import { Cart } from '../cart/cart.entity';
import Stripe from 'stripe';

@Injectable()
export class PaymentService {
  private stripe: Stripe;

  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2022-11-15' as Stripe.LatestApiVersion,
    });
  }

  async createPayment(
    customerEmail: string,
    cartItems: Cart[],
    coupon?: string,
  ) {
    console.log('🔹 Received createPayment request for:', customerEmail);
    console.log('🛒 Cart Items:', cartItems);

    const totalPrice = coupon
      ? parseFloat(coupon)
      : cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    console.log('💰 Calculated Total Price:', totalPrice);

    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: Math.round(totalPrice * 100),
      currency: 'usd',
      receipt_email: customerEmail,
    });

    console.log('✅ Stripe Payment Intent Created:', paymentIntent.id);

    try {
      for (const item of cartItems) {
        console.log(`💾 Saving payment for product: ${item.name}`);

        const newPayment = new Payment();
        newPayment.customer_email = customerEmail;
        newPayment.product_name = item.name;
        newPayment.price = item.price;
        newPayment.transaction_id = paymentIntent.id;
        newPayment.payment_status = 'Pending';

        await this.paymentRepository.save(newPayment);

        console.log(`✅ Payment saved for: ${item.name}`);
      }

      return { clientSecret: paymentIntent.client_secret };
    } catch (error) {
      console.error('❌ Error saving payment to DB:', error);
      throw new Error('Database error while saving payment');
    }
  }

  async confirmPayment(transactionId: string) {
    console.log('🔍 Confirming payment for transaction:', transactionId);

    const payments = await this.paymentRepository.find({
      where: { transaction_id: transactionId },
    });

    if (!payments.length) {
      throw new Error('❌ Payment not found');
    }

    for (const payment of payments) {
      payment.payment_status = 'Paid';
      await this.paymentRepository.save(payment);
    }

    console.log('✅ Payment confirmed, clearing cart...');

    await this.cartRepository.delete({
      customer_email: payments[0].customer_email,
    });

    console.log('🛒 Cart cleared for user:', payments[0].customer_email);

    return payments;
  }

  async getPaymentsByEmail(customerEmail: string) {
    console.log('🔍 Fetching payments for:', customerEmail);

    return this.paymentRepository.find({
      where: { customer_email: customerEmail, payment_status: 'Paid' },
    });
  }

  // New method to delete all payments by email
  async deletePaymentsByEmail(customerEmail: string) {
    console.log('❌ Deleting all payments for email:', customerEmail);

    const deleteResult = await this.paymentRepository.delete({
      customer_email: customerEmail,
    });

    console.log(
      `✅ Deleted ${deleteResult.affected} payment(s) for email: ${customerEmail}`,
    );

    return {
      message: `Deleted ${deleteResult.affected} payment(s) for email: ${customerEmail}`,
    };
  }
}
