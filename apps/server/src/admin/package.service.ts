import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { prisma } from '@repo/db';

interface CreatePackageDto {
  name: string;
  description?: string;
  imageUrl?: string;
  category?: string;
  isActive?: boolean;
  isFeatured?: boolean;
}

interface CreatePackageVariantDto {
  name: string;
  description?: string;
  priceOverride?: number;
  isDefault?: boolean;
  items: {
    productId: string;
    quantity: number;
    priceOverride?: number;
  }[];
}

@Injectable()
export class PackageService {
  // Get all packages (admin)
  async getAllPackages() {
    return prisma.package.findMany({
      orderBy: { createdAt: 'desc' },
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

  // Get package by ID
  async getPackageById(id: string) {
    const pkg = await prisma.package.findUnique({
      where: { id },
      include: {
        variants: {
          include: {
            items: {
              include: { product: true },
              orderBy: { createdAt: 'asc' },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!pkg) {
      throw new NotFoundException('Package not found');
    }

    return pkg;
  }

  // Create package
  async createPackage(data: CreatePackageDto) {
    return prisma.package.create({
      data: {
        name: data.name,
        description: data.description,
        imageUrl: data.imageUrl,
        category: data.category,
        isActive: data.isActive ?? true,
        isFeatured: data.isFeatured ?? false,
      },
      include: {
        variants: true,
      },
    });
  }

  // Update package
  async updatePackage(id: string, data: Partial<CreatePackageDto>) {
    await this.getPackageById(id);

    return prisma.package.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        imageUrl: data.imageUrl,
        category: data.category,
        isActive: data.isActive,
        isFeatured: data.isFeatured,
      },
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

  // Delete package
  async deletePackage(id: string) {
    await this.getPackageById(id);
    return prisma.package.delete({ where: { id } });
  }

  // Create variant for a package
  async createVariant(packageId: string, data: CreatePackageVariantDto) {
    await this.getPackageById(packageId);

    // If this is set as default, unset other defaults
    if (data.isDefault) {
      await prisma.packageVariant.updateMany({
        where: { packageId },
        data: { isDefault: false },
      });
    }

    return prisma.packageVariant.create({
      data: {
        packageId,
        name: data.name,
        description: data.description,
        priceOverride: data.priceOverride,
        isDefault: data.isDefault ?? false,
        items: {
          create: data.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            priceOverride: item.priceOverride,
          })),
        },
      },
      include: {
        items: {
          include: { product: true },
        },
      },
    });
  }

  // Update variant
  async updateVariant(variantId: string, data: Partial<CreatePackageVariantDto>) {
    const variant = await prisma.packageVariant.findUnique({
      where: { id: variantId },
    });

    if (!variant) {
      throw new NotFoundException('Variant not found');
    }

    // If this is set as default, unset other defaults
    if (data.isDefault) {
      await prisma.packageVariant.updateMany({
        where: { packageId: variant.packageId, id: { not: variantId } },
        data: { isDefault: false },
      });
    }

    return prisma.packageVariant.update({
      where: { id: variantId },
      data: {
        name: data.name,
        description: data.description,
        priceOverride: data.priceOverride,
        isDefault: data.isDefault,
      },
      include: {
        items: {
          include: { product: true },
        },
      },
    });
  }

  // Delete variant
  async deleteVariant(variantId: string) {
    const variant = await prisma.packageVariant.findUnique({
      where: { id: variantId },
    });

    if (!variant) {
      throw new NotFoundException('Variant not found');
    }

    return prisma.packageVariant.delete({ where: { id: variantId } });
  }

  // Add item to variant
  async addItemToVariant(variantId: string, productId: string, quantity: number, priceOverride?: number) {
    const variant = await prisma.packageVariant.findUnique({
      where: { id: variantId },
    });

    if (!variant) {
      throw new NotFoundException('Variant not found');
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Check if product already in variant
    const existing = await prisma.packageItem.findUnique({
      where: {
        packageVariantId_productId: {
          packageVariantId: variantId,
          productId,
        },
      },
    });

    if (existing) {
      throw new BadRequestException('Product already in this variant');
    }

    return prisma.packageItem.create({
      data: {
        packageVariantId: variantId,
        productId,
        quantity,
        priceOverride,
      },
      include: {
        product: true,
      },
    });
  }

  // Update item in variant
  async updateItem(itemId: string, quantity: number, priceOverride?: number) {
    const item = await prisma.packageItem.findUnique({
      where: { id: itemId },
    });

    if (!item) {
      throw new NotFoundException('Item not found');
    }

    return prisma.packageItem.update({
      where: { id: itemId },
      data: {
        quantity,
        priceOverride,
      },
      include: {
        product: true,
      },
    });
  }

  // Remove item from variant
  async removeItem(itemId: string) {
    const item = await prisma.packageItem.findUnique({
      where: { id: itemId },
    });

    if (!item) {
      throw new NotFoundException('Item not found');
    }

    return prisma.packageItem.delete({ where: { id: itemId } });
  }

  // Get all products (for adding to packages)
  async getAllProducts() {
    return prisma.product.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });
  }

  // Calculate variant price (sum of items or override)
  calculateVariantPrice(variant: {
    priceOverride?: number | null;
    items: {
      quantity: number;
      priceOverride?: number | null;
      product: { price: number };
    }[];
  }): number {
    if (variant.priceOverride) {
      return variant.priceOverride;
    }

    return variant.items.reduce((sum, item) => {
      const itemPrice = item.priceOverride ?? item.product.price;
      return sum + itemPrice * item.quantity;
    }, 0);
  }
}
