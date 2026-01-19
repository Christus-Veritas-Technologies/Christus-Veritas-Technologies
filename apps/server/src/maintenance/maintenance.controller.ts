import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
  Request,
  Query,
  BadRequestException,
  Req,
} from '@nestjs/common';
import { MaintenanceService } from './maintenance.service';
import { AuthGuard } from '../auth/auth.guard';
import { AdminGuard } from '../auth/admin.guard';

@Controller('api/maintenance')
@UseGuards(AuthGuard)
export class MaintenanceController {
  constructor(private maintenanceService: MaintenanceService) {}

  // Admin: Get all maintenance contracts
  @Get('admin/all')
  @UseGuards(AdminGuard)
  async getAllMaintenance(@Query('includeInactive') includeInactive?: string) {
    const include = includeInactive === 'true';
    return this.maintenanceService.getAllMaintenance(include);
  }

  // Admin: Get overdue maintenance
  @Get('admin/overdue')
  @UseGuards(AdminGuard)
  async getOverdueMaintenance() {
    return this.maintenanceService.getOverdueMaintenance();
  }

  // Admin: Get maintenance due soon
  @Get('admin/due-soon')
  @UseGuards(AdminGuard)
  async getMaintenanceDueSoon(@Query('days') days?: string) {
    const daysThreshold = days ? parseInt(days, 10) : 7;
    return this.maintenanceService.getMaintenanceDueSoon(daysThreshold);
  }

  // Admin: Create or update maintenance for a project
  @Post('admin/create')
  @UseGuards(AdminGuard)
  async createMaintenance(
    @Body() body: { projectId: string; monthlyFee: number; startDate?: string },
  ) {
    const startDate = body.startDate ? new Date(body.startDate) : undefined;
    return this.maintenanceService.createOrUpdateMaintenance(
      body.projectId,
      body.monthlyFee,
      startDate,
    );
  }

  // Admin: Confirm cash payment
  @Post('admin/:id/confirm-cash')
  @UseGuards(AdminGuard)
  async confirmCashPayment(@Param('id') id: string, @Req() req: any) {
    return this.maintenanceService.confirmCashPayment(id, req.user.userId);
  }

  // Admin: Advance to next billing period
  @Post('admin/:id/advance-period')
  @UseGuards(AdminGuard)
  async advancePeriod(@Param('id') id: string) {
    return this.maintenanceService.advanceToNextPeriod(id);
  }

  // Admin: Deactivate maintenance
  @Post('admin/:id/deactivate')
  @UseGuards(AdminGuard)
  async deactivateMaintenance(
    @Param('id') id: string,
    @Body() body: { endDate?: string },
  ) {
    const endDate = body.endDate ? new Date(body.endDate) : undefined;
    return this.maintenanceService.deactivateMaintenance(id, endDate);
  }

  // Admin: Add notes
  @Put('admin/:id/notes')
  @UseGuards(AdminGuard)
  async addNotes(@Param('id') id: string, @Body() body: { notes: string }) {
    return this.maintenanceService.addNotes(id, body.notes);
  }

  // Admin: Update reminder sent
  @Post('admin/:id/reminder-sent')
  @UseGuards(AdminGuard)
  async updateReminderSent(@Param('id') id: string) {
    return this.maintenanceService.updateReminderSent(id);
  }

  // Client: Get my maintenance contracts
  @Get('my-maintenance')
  async getMyMaintenance(@Req() req: any) {
    return this.maintenanceService.getUserMaintenance(req.user.userId);
  }

  // Client: Mark as paid in cash
  @Post(':id/pay-cash')
  async payInCash(@Param('id') id: string, @Req() req: any) {
    return this.maintenanceService.markPaidInCash(id, req.user.userId);
  }

  // Client: Mark as paid via Paynow
  @Post(':id/pay-paynow')
  async payViaPaynow(@Param('id') id: string, @Req() req: any) {
    return this.maintenanceService.markPaidViaPaynow(id, req.user.userId);
  }

  // Get single maintenance (admin or owner)
  @Get(':id')
  async getMaintenance(@Param('id') id: string, @Req() req: any) {
    const maintenance = await this.maintenanceService.getMaintenance(id);
    
    // Only admin or project owner can view
    if (req.user.role !== 'ADMIN' && maintenance.project.userId !== req.user.userId) {
      throw new BadRequestException('Unauthorized');
    }
    
    return maintenance;
  }
}
