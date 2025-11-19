import { Injectable, Logger } from '@nestjs/common';
import Stripe from 'stripe';
import { OrdersService } from '../orders/orders.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PaymentsService {
  private readonly stripe: Stripe;
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    private readonly ordersService: OrdersService,
    private readonly prisma: PrismaService
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
      apiVersion: '2023-10-16'
    });
  }

  async createIntent(userId: string, orderId: string) {
    const order = await this.ordersService.getOrder(userId, orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    const intent = await this.stripe.paymentIntents.create({
      amount: Math.round(order.total * 100),
      currency: 'usd',
      metadata: { orderId },
      automatic_payment_methods: { enabled: true }
    });

    await this.prisma.payment.upsert({
      where: { orderId },
      update: {
        providerId: intent.id,
        provider: 'stripe',
        status: intent.status
      },
      create: {
        orderId,
        provider: 'stripe',
        providerId: intent.id,
        status: intent.status
      }
    });

    return { clientSecret: intent.client_secret };
  }

  async handleWebhook(signature: string, payload: Buffer) {
    const secret = process.env.STRIPE_WEBHOOK_SECRET || '';
    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(payload, signature, secret);
    } catch (err) {
      this.logger.error('Stripe signature verification failed', err as Error);
      throw err;
    }

    if (event.type === 'payment_intent.succeeded') {
      const intent = event.data.object as Stripe.PaymentIntent;
      const orderId = intent.metadata?.orderId;
      if (orderId) {
        await this.ordersService.markAsPaid(orderId, intent.id);
      }
    }

    return { received: true };
  }
}
