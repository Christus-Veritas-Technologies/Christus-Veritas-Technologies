import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Query,
  Body,
  Req,
  UseGuards,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';
import { PaymentStatus, OrderStatus } from '@repo/db';

@Controller('api/admin')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // ==================== DASHBOARD ====================

  @Get('dashboard')
  async getDashboardStats() {
    return this.adminService.getDashboardStats();
  }

  @Get('dashboard/activity')
  async getRecentActivity(
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.adminService.getRecentActivity(limit);
  }

  // ==================== REVENUE ANALYTICS ====================

  @Get('analytics/revenue')
  async getRevenueAnalytics(
    @Query('period') period: 'week' | 'month' | 'year' = 'month',
  ) {
    return this.adminService.getRevenueAnalytics(period);
  }

  // ==================== USERS ====================

  @Get('users')
  async getAllUsers(
    @Query('search') search?: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit?: number,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
  ) {
    return this.adminService.getAllUsers({ search, page, limit, sortBy, sortOrder });
  }

  @Get('users/:id')
  async getUserDetails(@Param('id') id: string) {
    return this.adminService.getUserDetails(id);
  }

  @Patch('users/:id')
  async updateUser(
    @Param('id') id: string,
    @Body() data: { isAdmin?: boolean; name?: string },
  ) {
    return this.adminService.updateUserAdmin(id, data);
  }

  // ==================== PAYMENTS ====================

  @Get('payments')
  async getAllPayments(
    @Query('status') status?: PaymentStatus,
    @Query('method') method?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit?: number,
  ) {
    return this.adminService.getAllPayments({
      status,
      method,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      page,
      limit,
    });
  }

  @Get('payments/:id')
  async getPaymentDetails(@Param('id') id: string) {
    return this.adminService.getPaymentDetails(id);
  }

  // ==================== ORDERS ====================

  @Get('orders')
  async getAllOrders(
    @Query('status') status?: OrderStatus,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit?: number,
  ) {
    return this.adminService.getAllOrders({
      status,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      page,
      limit,
    });
  }

  @Get('orders/:id')
  async getOrderDetails(@Param('id') id: string) {
    return this.adminService.getOrderDetails(id);
  }

  @Patch('orders/:id/status')
  async updateOrderStatus(
    @Param('id') id: string,
    @Body('status') status: OrderStatus,
  ) {
    return this.adminService.updateOrderStatus(id, status);
  }

  // ==================== SERVICES ====================

  @Get('services/stats')
  async getServiceStats() {
    return this.adminService.getServiceStats();
  }

  // ==================== PROJECTS ====================

  @Get('projects/stats')
  async getProjectStats() {
    return this.adminService.getProjectStats();
  }
}
