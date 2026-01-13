import { Injectable } from '@nestjs/common';
import { prisma } from '@repo/db';

@Injectable()
export class MarketplaceService {
  async getProducts(limit: number = 10) {
    return prisma.product.findMany({
      where: { isActive: true },
      orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
      take: limit,
    });
  }

  async getAllProducts(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: { isActive: true },
        orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
        skip,
        take: limit,
      }),
      prisma.product.count({ where: { isActive: true } }),
    ]);

    return {
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getProductById(id: string) {
    return prisma.product.findUnique({
      where: { id },
    });
  }

  async getProductsCount() {
    return prisma.product.count({ where: { isActive: true } });
  }

  async getServices(limit: number = 10) {
    return prisma.marketplaceService.findMany({
      where: { isActive: true },
      orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
      take: limit,
    });
  }

  async getAllServices(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const [services, total] = await Promise.all([
      prisma.marketplaceService.findMany({
        where: { isActive: true },
        orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
        skip,
        take: limit,
      }),
      prisma.marketplaceService.count({ where: { isActive: true } }),
    ]);

    return {
      services,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getServiceById(id: string) {
    return prisma.marketplaceService.findUnique({
      where: { id },
    });
  }

  async getServicesCount() {
    return prisma.marketplaceService.count({ where: { isActive: true } });
  }

  async getMarketplaceOverview() {
    const [products, services, productsCount, servicesCount] =
      await Promise.all([
        this.getProducts(10),
        this.getServices(10),
        this.getProductsCount(),
        this.getServicesCount(),
      ]);

    return {
      products: {
        items: products,
        total: productsCount,
        hasMore: productsCount > 10,
      },
      services: {
        items: services,
        total: servicesCount,
        hasMore: servicesCount > 10,
      },
    };
  }
}
