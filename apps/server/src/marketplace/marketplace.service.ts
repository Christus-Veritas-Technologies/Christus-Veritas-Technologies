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
    return prisma.serviceDefinition.findMany({
      where: { isActive: true },
      orderBy: [{ createdAt: 'desc' }],
      take: limit,
    });
  }

  async getAllServices(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const [services, total] = await Promise.all([
      prisma.serviceDefinition.findMany({
        where: { isActive: true },
        orderBy: [{ createdAt: 'desc' }],
        skip,
        take: limit,
      }),
      prisma.serviceDefinition.count({ where: { isActive: true } }),
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
    return prisma.serviceDefinition.findUnique({
      where: { id },
    });
  }

  async getServicesCount() {
    return prisma.serviceDefinition.count({ where: { isActive: true } });
  }

  // Package methods
  async getPackages(limit: number = 10) {
    return prisma.package.findMany({
      where: { isActive: true },
      orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
      take: limit,
      include: {
        variants: {
          where: { isDefault: true },
          take: 1,
          include: {
            items: {
              include: { product: true },
            },
          },
        },
      },
    });
  }

  async getAllPackages(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const [packages, total] = await Promise.all([
      prisma.package.findMany({
        where: { isActive: true },
        orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
        skip,
        take: limit,
        include: {
          variants: {
            include: {
              items: {
                include: { product: true },
              },
            },
          },
        },
      }),
      prisma.package.count({ where: { isActive: true } }),
    ]);

    return {
      packages,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getPackageById(id: string) {
    return prisma.package.findUnique({
      where: { id },
      include: {
        variants: {
          include: {
            items: {
              include: { product: true },
            },
          },
        },
      },
    });
  }

  async getPackagesCount() {
    return prisma.package.count({ where: { isActive: true } });
  }

  async getMarketplaceOverview() {
    const [products, services, packages, productsCount, servicesCount, packagesCount] =
      await Promise.all([
        this.getProducts(10),
        this.getServices(10),
        this.getPackages(10),
        this.getProductsCount(),
        this.getServicesCount(),
        this.getPackagesCount(),
      ]);

    const data = {
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
      packages: {
        items: packages,
        total: packagesCount,
        hasMore: packagesCount > 10,
      },
    };

    console.log("Marketplace data: ", data);

    return data;
  }
}
