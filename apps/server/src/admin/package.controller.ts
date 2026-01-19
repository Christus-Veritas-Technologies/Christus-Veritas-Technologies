import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { PackageService } from './package.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';

@Controller('api/admin/packages')
@UseGuards(JwtAuthGuard, AdminGuard)
export class PackageController {
  constructor(private packageService: PackageService) {}

  // Get all packages
  @Get()
  async getAllPackages() {
    return this.packageService.getAllPackages();
  }

  // Get all products (for adding to packages)
  @Get('products')
  async getAllProducts() {
    return this.packageService.getAllProducts();
  }

  // Get package by ID
  @Get(':id')
  async getPackageById(@Param('id') id: string) {
    return this.packageService.getPackageById(id);
  }

  // Create package
  @Post()
  async createPackage(
    @Body() body: {
      name: string;
      description?: string;
      imageUrl?: string;
      category?: string;
      isActive?: boolean;
      isFeatured?: boolean;
    },
  ) {
    return this.packageService.createPackage(body);
  }

  // Update package
  @Put(':id')
  async updatePackage(
    @Param('id') id: string,
    @Body() body: {
      name?: string;
      description?: string;
      imageUrl?: string;
      category?: string;
      isActive?: boolean;
      isFeatured?: boolean;
    },
  ) {
    return this.packageService.updatePackage(id, body);
  }

  // Delete package
  @Delete(':id')
  async deletePackage(@Param('id') id: string) {
    return this.packageService.deletePackage(id);
  }

  // Create variant
  @Post(':packageId/variants')
  async createVariant(
    @Param('packageId') packageId: string,
    @Body() body: {
      name: string;
      description?: string;
      priceOverride?: number;
      isDefault?: boolean;
      items: {
        productId: string;
        quantity: number;
        priceOverride?: number;
      }[];
    },
  ) {
    return this.packageService.createVariant(packageId, body);
  }

  // Update variant
  @Put('variants/:variantId')
  async updateVariant(
    @Param('variantId') variantId: string,
    @Body() body: {
      name?: string;
      description?: string;
      priceOverride?: number;
      isDefault?: boolean;
    },
  ) {
    return this.packageService.updateVariant(variantId, body);
  }

  // Delete variant
  @Delete('variants/:variantId')
  async deleteVariant(@Param('variantId') variantId: string) {
    return this.packageService.deleteVariant(variantId);
  }

  // Add item to variant
  @Post('variants/:variantId/items')
  async addItemToVariant(
    @Param('variantId') variantId: string,
    @Body() body: {
      productId: string;
      quantity: number;
      priceOverride?: number;
    },
  ) {
    return this.packageService.addItemToVariant(
      variantId,
      body.productId,
      body.quantity,
      body.priceOverride,
    );
  }

  // Update item
  @Put('items/:itemId')
  async updateItem(
    @Param('itemId') itemId: string,
    @Body() body: {
      quantity: number;
      priceOverride?: number;
    },
  ) {
    return this.packageService.updateItem(itemId, body.quantity, body.priceOverride);
  }

  // Remove item
  @Delete('items/:itemId')
  async removeItem(@Param('itemId') itemId: string) {
    return this.packageService.removeItem(itemId);
  }
}
