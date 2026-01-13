import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  Query,
  Headers,
} from '@nestjs/common';
import { InvitationService } from './invitation.service';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { AuthService } from '../auth/auth.service';

// Simple admin guard - checks if user is admin
class AdminGuard {
  constructor(private authService: AuthService) {}

  canActivate(authHeader?: string): boolean {
    const payload = this.authService.validateToken(authHeader);
    return payload?.isAdmin === true;
  }
}

@Controller('api/invitations')
export class InvitationController {
  constructor(
    private readonly invitationService: InvitationService,
    private readonly authService: AuthService,
  ) {}

  private checkAdmin(authHeader?: string) {
    const payload = this.authService.validateToken(authHeader);
    if (!payload?.isAdmin) {
      throw new Error('Unauthorized: Admin access required');
    }
    return payload;
  }

  @Post()
  async createInvitation(
    @Body() dto: CreateInvitationDto,
    @Headers('authorization') authHeader?: string,
  ) {
    this.checkAdmin(authHeader);
    return this.invitationService.createInvitation(dto);
  }

  @Get()
  async getInvitations(
    @Query('status') status?: string,
    @Headers('authorization') authHeader?: string,
  ) {
    this.checkAdmin(authHeader);
    return this.invitationService.getInvitations(status);
  }

  @Post(':id/resend')
  async resendInvitation(
    @Param('id') id: string,
    @Headers('authorization') authHeader?: string,
  ) {
    this.checkAdmin(authHeader);
    return this.invitationService.resendInvitation(id);
  }

  @Delete(':id')
  async cancelInvitation(
    @Param('id') id: string,
    @Headers('authorization') authHeader?: string,
  ) {
    this.checkAdmin(authHeader);
    return this.invitationService.cancelInvitation(id);
  }

  @Post('accept/:token')
  async acceptInvitation(@Param('token') token: string) {
    return this.invitationService.acceptInvitation(token);
  }
}
