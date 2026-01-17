import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  Req,
  Res,
  HttpStatus,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PaymentsService } from './payments.service';
import { InitiatePaymentDto, CheckPaymentStatusDto, PaynowCallbackDto } from './dto/payment.dto';

@Controller('payments')
export class PaymentsController {
  private readonly logger = new Logger(PaymentsController.name);

  constructor(private readonly paymentsService: PaymentsService) {}

  /**
   * Initiate a new payment
   * POST /api/payments/initiate
   */
  @Post('initiate')
  @UseGuards(JwtAuthGuard)
  async initiatePayment(@Req() req: Request, @Body() dto: InitiatePaymentDto) {
    const userId = (req.user as any).sub;
    const result = await this.paymentsService.initiatePayment(userId, dto);

    if (!result.success) {
      return {
        success: false,
        error: result.error,
      };
    }

    return {
      success: true,
      redirectUrl: result.redirectUrl,
      pollUrl: result.pollUrl,
      paymentId: result.paymentId,
    };
  }

  /**
   * Paynow callback/webhook
   * POST /api/payments/paynow/callback
   */
  @Post('paynow/callback')
  async handlePaynowCallback(@Body() data: PaynowCallbackDto, @Res() res: Response) {
    this.logger.log(`Paynow callback received: ${JSON.stringify(data)}`);

    try {
      await this.paymentsService.handlePaynowCallback(data);
      res.status(HttpStatus.OK).send('OK');
    } catch (error) {
      this.logger.error(`Error handling Paynow callback: ${error}`);
      res.status(HttpStatus.OK).send('OK'); // Always return OK to Paynow
    }
  }

  /**
   * Check payment status
   * POST /api/payments/status
   */
  @Post('status')
  @UseGuards(JwtAuthGuard)
  async checkPaymentStatus(@Body() dto: CheckPaymentStatusDto) {
    const result = await this.paymentsService.checkPaymentStatus(dto.pollUrl);
    return result;
  }

  /**
   * Get payment by ID
   * GET /api/payments/:id
   */
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getPayment(@Param('id') id: string) {
    const payment = await this.paymentsService.getPayment(id);
    if (!payment) {
      return { error: 'Payment not found' };
    }
    return payment;
  }

  /**
   * Get user's payment history
   * GET /api/payments/history
   */
  @Get('user/history')
  @UseGuards(JwtAuthGuard)
  async getPaymentHistory(@Req() req: Request) {
    const userId = (req.user as any).sub;
    return this.paymentsService.getPaymentHistory(userId);
  }
}
