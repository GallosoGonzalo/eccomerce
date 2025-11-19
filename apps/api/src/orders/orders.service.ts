import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CartService } from '../cart/cart.service';

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cartService: CartService
  ) {}

  async createOrder(userId: string) {
    const cart = await this.cartService.getCart(userId);
    if (!cart || cart.items.length === 0) {
      throw new NotFoundException('Cart is empty');
    }

    const total = cart.items.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0
    );

    const order = await this.prisma.order.create({
      data: {
        userId,
        status: 'pending',
        total,
        items: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.product.price
          }))
        }
      },
      include: { items: true }
    });

    await this.cartService.clearCart(userId);

    return order;
  }

  getOrder(userId: string, id: string) {
    return this.prisma.order.findFirst({
      where: { id, userId },
      include: { items: { include: { product: true } }, payment: true }
    });
  }

  listOrders(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      include: { items: { include: { product: true } }, payment: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  markAsPaid(orderId: string, paymentIntentId: string) {
    return this.prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'paid',
        payment: {
          upsert: {
            create: {
              provider: 'stripe',
              providerId: paymentIntentId,
              status: 'succeeded'
            },
            update: {
              providerId: paymentIntentId,
              status: 'succeeded'
            }
          }
        }
      }
    });
  }
}
