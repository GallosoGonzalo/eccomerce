import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CatalogService {
  constructor(private readonly prisma: PrismaService) {}

  listCategories() {
    return this.prisma.category.findMany({ orderBy: { name: 'asc' } });
  }

  async listProducts(params: {
    search?: string;
    category?: string;
    sort?: string;
    order?: 'asc' | 'desc';
    page?: number;
    limit?: number;
  }) {
    const { search, category, sort = 'name', order = 'asc', page = 1, limit = 12 } = params;
    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }
    if (category) {
      where.category = { slug: category };
    }

    const [items, count] = await this.prisma.$transaction([
      this.prisma.product.findMany({
        where,
        include: { category: true },
        orderBy: { [sort]: order },
        skip: (page - 1) * limit,
        take: limit
      }),
      this.prisma.product.count({ where })
    ]);

    return {
      items,
      meta: {
        total: count,
        page,
        limit
      }
    };
  }

  getProduct(id: string) {
    return this.prisma.product.findUnique({
      where: { id },
      include: { category: true }
    });
  }

  createProduct(data: any) {
    return this.prisma.product.create({
      data,
      include: { category: true }
    });
  }

  updateProduct(id: string, data: any) {
    return this.prisma.product.update({
      where: { id },
      data,
      include: { category: true }
    });
  }

  deleteProduct(id: string) {
    return this.prisma.product.delete({
      where: { id }
    });
  }
}
