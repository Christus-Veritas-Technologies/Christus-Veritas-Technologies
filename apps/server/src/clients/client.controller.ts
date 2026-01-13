import {
  Controller,
  Get,
  Patch,
  Param,
  Query,
  Body,
  Headers,
} from '@nestjs/common';
import { ClientService } from './client.service';
import { AuthService } from '../auth/auth.service';

@Controller('api/clients')
export class ClientController {
  constructor(
    private readonly clientService: ClientService,
    private readonly authService: AuthService,
  ) {}

  private checkAdmin(authHeader?: string) {
    const payload = this.authService.validateToken(authHeader);
    if (!payload?.isAdmin) {
      throw new Error('Unauthorized: Admin access required');
    }
    return payload;
  }

  @Get()
  async getClients(
    @Query('search') search?: string,
    @Headers('authorization') authHeader?: string,
  ) {
    this.checkAdmin(authHeader);
    return this.clientService.getClients(search);
  }

  @Get('stats')
  async getClientStats(@Headers('authorization') authHeader?: string) {
    this.checkAdmin(authHeader);
    return this.clientService.getClientStats();
  }

  @Get(':id')
  async getClient(
    @Param('id') id: string,
    @Headers('authorization') authHeader?: string,
  ) {
    this.checkAdmin(authHeader);
    return this.clientService.getClient(id);
  }

  @Patch(':id')
  async updateClient(
    @Param('id') id: string,
    @Body() dto: { name?: string },
    @Headers('authorization') authHeader?: string,
  ) {
    this.checkAdmin(authHeader);
    return this.clientService.updateClient(id, dto);
  }
}
