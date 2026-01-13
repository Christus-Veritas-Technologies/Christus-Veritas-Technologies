import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  Headers,
} from '@nestjs/common';
import { ServiceService } from './service.service';
import {
  CreateServiceDefinitionDto,
  UpdateServiceDefinitionDto,
  ProvisionServiceDto,
} from './dto/service.dto';
import { AuthService } from '../auth/auth.service';
import { ClientServiceStatus } from '@repo/db';

@Controller('api/services')
export class ServiceController {
  constructor(
    private readonly serviceService: ServiceService,
    private readonly authService: AuthService,
  ) {}

  private checkAdmin(authHeader?: string) {
    const payload = this.authService.validateToken(authHeader);
    if (!payload?.isAdmin) {
      throw new Error('Unauthorized: Admin access required');
    }
    return payload;
  }

  // Service Definitions
  @Post('definitions')
  async createServiceDefinition(
    @Body() dto: CreateServiceDefinitionDto,
    @Headers('authorization') authHeader?: string,
  ) {
    this.checkAdmin(authHeader);
    return this.serviceService.createServiceDefinition(dto);
  }

  @Get('definitions')
  async getServiceDefinitions(
    @Query('includeInactive') includeInactive?: string,
    @Headers('authorization') authHeader?: string,
  ) {
    this.checkAdmin(authHeader);
    return this.serviceService.getServiceDefinitions(includeInactive === 'true');
  }

  @Get('definitions/:id')
  async getServiceDefinition(
    @Param('id') id: string,
    @Headers('authorization') authHeader?: string,
  ) {
    this.checkAdmin(authHeader);
    return this.serviceService.getServiceDefinition(id);
  }

  @Patch('definitions/:id')
  async updateServiceDefinition(
    @Param('id') id: string,
    @Body() dto: UpdateServiceDefinitionDto,
    @Headers('authorization') authHeader?: string,
  ) {
    this.checkAdmin(authHeader);
    return this.serviceService.updateServiceDefinition(id, dto);
  }

  @Delete('definitions/:id')
  async deleteServiceDefinition(
    @Param('id') id: string,
    @Headers('authorization') authHeader?: string,
  ) {
    this.checkAdmin(authHeader);
    return this.serviceService.deleteServiceDefinition(id);
  }

  // Client Services (Provisioning)
  @Post('provision')
  async provisionService(
    @Body() dto: ProvisionServiceDto,
    @Headers('authorization') authHeader?: string,
  ) {
    this.checkAdmin(authHeader);
    return this.serviceService.provisionService(dto);
  }

  @Get('client-services')
  async getClientServices(
    @Query('userId') userId?: string,
    @Headers('authorization') authHeader?: string,
  ) {
    this.checkAdmin(authHeader);
    return this.serviceService.getClientServices(userId);
  }

  @Get('client-services/:id')
  async getClientService(
    @Param('id') id: string,
    @Headers('authorization') authHeader?: string,
  ) {
    this.checkAdmin(authHeader);
    return this.serviceService.getClientService(id);
  }

  @Patch('client-services/:id')
  async updateClientService(
    @Param('id') id: string,
    @Body()
    dto: {
      units?: number;
      enableRecurring?: boolean;
      customRecurringPrice?: number;
      oneOffPricePaid?: boolean;
      status?: ClientServiceStatus;
    },
    @Headers('authorization') authHeader?: string,
  ) {
    this.checkAdmin(authHeader);
    return this.serviceService.updateClientService(id, dto);
  }

  @Post('client-services/:id/mark-paid')
  async markOneOffPaid(
    @Param('id') id: string,
    @Headers('authorization') authHeader?: string,
  ) {
    this.checkAdmin(authHeader);
    return this.serviceService.markOneOffPaid(id);
  }

  @Post('client-services/:id/cancel')
  async cancelClientService(
    @Param('id') id: string,
    @Headers('authorization') authHeader?: string,
  ) {
    this.checkAdmin(authHeader);
    return this.serviceService.cancelClientService(id);
  }

  @Post('client-services/:id/pause')
  async pauseClientService(
    @Param('id') id: string,
    @Headers('authorization') authHeader?: string,
  ) {
    this.checkAdmin(authHeader);
    return this.serviceService.pauseClientService(id);
  }

  @Post('client-services/:id/resume')
  async resumeClientService(
    @Param('id') id: string,
    @Headers('authorization') authHeader?: string,
  ) {
    this.checkAdmin(authHeader);
    return this.serviceService.resumeClientService(id);
  }
}
