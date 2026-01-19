import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { BillingScheduler } from './billing.scheduler';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [EmailModule],
  controllers: [PaymentsController],
  providers: [PaymentsService, BillingScheduler],
  exports: [PaymentsService],
})
export class PaymentsModule {}
