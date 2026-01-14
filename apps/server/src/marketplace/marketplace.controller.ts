import { Controller, Get, Param, Query } from '@nestjs/common';
import { MarketplaceService } from './marketplace.service';

@Controller('api/marketplace')
export class MarketplaceController {
  constructor(private readonly marketplaceService: MarketplaceService) {}

  @Get()
  async getMarketplaceOverview() {
    return this.marketplaceService.getMarketplaceOverview();
  }

  @Get('products')
  async getAllProducts(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
  ) {
    return this.marketplaceService.getAllProducts(
      parseInt(page, 10),
      parseInt(limit, 10),
    );
  }

  @Get('products/:id')
  async getProductById(@Param('id') id: string) {
    return this.marketplaceService.getProductById(id);
  }

  @Get('services')
  async getAllServices(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
  ) {
    return this.marketplaceService.getAllServices(
      parseInt(page, 10),
      parseInt(limit, 10),
    );
  }

  @Get('services/:id')
  async getServiceById(@Param('id') id: string) {
    return this.marketplaceService.getServiceById(id);
  }
}
