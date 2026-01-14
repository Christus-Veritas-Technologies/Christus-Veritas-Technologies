import {
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { PaymentMethodsService, CreateCardPaymentMethodDto, CreateMobileMoneyPaymentMethodDto } from './payment-methods.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('payment-methods')
@UseGuards(JwtAuthGuard)
export class PaymentMethodsController {
  constructor(private readonly paymentMethodsService: PaymentMethodsService) {}

  @Get()
  async getPaymentMethods(@Request() req: { user: { userId: string } }) {
    return this.paymentMethodsService.getPaymentMethods(req.user.userId);
  }

  @Post('card')
  async addCardPaymentMethod(
    @Request() req: { user: { userId: string } },
    @Body() dto: CreateCardPaymentMethodDto,
  ) {
    return this.paymentMethodsService.createCardPaymentMethod(req.user.userId, dto);
  }

  @Post('mobile-money')
  async addMobileMoneyPaymentMethod(
    @Request() req: { user: { userId: string } },
    @Body() dto: CreateMobileMoneyPaymentMethodDto,
  ) {
    return this.paymentMethodsService.createMobileMoneyPaymentMethod(req.user.userId, dto);
  }

  @Delete(':id')
  async deletePaymentMethod(
    @Request() req: { user: { userId: string } },
    @Param('id') id: string,
  ) {
    return this.paymentMethodsService.deletePaymentMethod(req.user.userId, id);
  }

  @Patch(':id/default')
  async setDefaultPaymentMethod(
    @Request() req: { user: { userId: string } },
    @Param('id') id: string,
  ) {
    return this.paymentMethodsService.setDefaultPaymentMethod(req.user.userId, id);
  }
}
