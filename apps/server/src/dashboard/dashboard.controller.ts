import { Controller, Get, Post, Patch, Param, Req, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('api/dashboard')
@UseGuards(AuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  async getStats(@Req() req: any) {
    return this.dashboardService.getUserDashboardStats(req.user.userId);
  }

  @Get('notifications')
  async getNotifications(@Req() req: any) {
    return this.dashboardService.getRecentNotifications(req.user.userId);
  }

  @Patch('notifications/:id/read')
  async markNotificationRead(@Req() req: any, @Param('id') id: string) {
    await this.dashboardService.markNotificationRead(req.user.userId, id);
    return { success: true };
  }

  @Post('notifications/read-all')
  async markAllNotificationsRead(@Req() req: any) {
    await this.dashboardService.markAllNotificationsRead(req.user.userId);
    return { success: true };
  }

  @Get('invoices')
  async getInvoices(@Req() req: any) {
    return this.dashboardService.getUserInvoices(req.user.userId);
  }

  @Get('payments')
  async getPayments(@Req() req: any) {
    return this.dashboardService.getUserPayments(req.user.userId);
  }

  @Get('usage')
  async getUsage(@Req() req: any) {
    return this.dashboardService.getUserUsageStats(req.user.userId);
  }
}
