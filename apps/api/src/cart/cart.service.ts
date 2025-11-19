import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  getCart(userId: string) {
    return this.prisma.cart.findUnique({
      where: { userId },
      include: { items: { include: { product: true } } }
    });
  }

  async addItem(userId: string, data: { productId: string; quantity: number }) {
    const product = await this.prisma.product.findUnique({
      where: { id: data.productId }
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    await this.ensureCart(userId);

    const item = await this.prisma.cartItem.upsert({
      where: {
        cartId_productId: {
          cartId: userId,
          productId: data.productId
        }
      },
      update: {
        quantity: { increment: data.quantity }
      },
      create: {
        quantity: data.quantity,
        productId: data.productId,
        cartId: userId
      }
    });

    return item;
  }

  updateItem(id: string, quantity: number) {
    return this.prisma.cartItem.update({
      where: { id },
      data: { quantity }
    });
  }

  removeItem(id: string) {
    return this.prisma.cartItem.delete({ where: { id } });
  }

  clearCart(userId: string) {
    return this.prisma.cartItem.deleteMany({ where: { cartId: userId } });
  }

  private async ensureCart(userId: string) {
    await this.prisma.cart.upsert({
      where: { userId },
      update: {},
      create: { userId }
    });
  }
}
