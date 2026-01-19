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
  ConfirmCashPaymentDto,
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

  private checkAuth(authHeader?: string) {
    const payload = this.authService.validateToken(authHeader);
    if (!payload) {
      throw new Error('Unauthorized: Authentication required');
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
    // Public endpoint - no admin check required
    // Only return active services for non-admin users
    const isAdmin = authHeader ? this.authService.validateToken(authHeader)?.isAdmin : false;
    return this.serviceService.getServiceDefinitions(isAdmin && includeInactive === 'true');
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
    this.checkAuth(authHeader);
    return this.serviceService.provisionService(dto);
  }

  @Get('client-services')
  async getClientServices(
    @Query('userId') userId?: string,
    @Headers('authorization') authHeader?: string,
  ) {
    // Allow authenticated users to view their own services
    // Admin can view all services or specific user's services
    const payload = authHeader ? this.authService.validateToken(authHeader) : null;
    
    if (!payload) {
      throw new Error('Unauthorized: Authentication required');
    }
    
    // If user is not admin, they can only view their own services
    const services = !payload.isAdmin 
      ? await this.serviceService.getClientServices(payload.userId)
      : await this.serviceService.getClientServices(userId);
    
    // Transform data to include computed fields expected by frontend
    return services.map((service: any) => {
      const serviceDef = service.serviceDefinition;
      // Calculate monthly price: use custom price if set, otherwise use recurring price per unit * units
      const monthlyPrice = service.customRecurringPrice 
        ?? (serviceDef?.recurringPricePerUnit 
          ? (serviceDef?.recurringPrice || 0) * service.units 
          : (serviceDef?.recurringPrice || 0));
      
      // Determine billing cycle based on days
      const billingCycleDays = serviceDef?.billingCycleDays || 30;
      const billingCycle = billingCycleDays === 7 ? 'WEEKLY' 
        : billingCycleDays === 30 ? 'MONTHLY' 
        : billingCycleDays === 365 ? 'YEARLY' 
        : 'MONTHLY';

      return {
        id: service.id,
        name: serviceDef?.name || 'Unknown Service',
        description: serviceDef?.description || null,
        status: service.status,
        monthlyPrice: monthlyPrice, // In cents
        billingCycle: billingCycle,
        nextBillingDate: service.nextBillingDate,
        createdAt: service.dateJoined || service.createdAt,
        service: serviceDef ? {
          id: serviceDef.id,
          name: serviceDef.name,
          category: serviceDef.category || 'Uncategorized',
        } : null,
      };
    });
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

  @Post('client-services/confirm-cash-payment')
  async confirmCashPayment(
    @Body() dto: ConfirmCashPaymentDto,
    @Headers('authorization') authHeader?: string,
  ) {
    const admin = this.checkAdmin(authHeader);
    return this.serviceService.confirmCashPayment(dto, admin.userId);
  }
}
