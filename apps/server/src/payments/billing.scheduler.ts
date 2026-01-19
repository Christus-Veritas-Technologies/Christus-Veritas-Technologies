import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { prisma, ClientServiceStatus } from '@repo/db';
import { EmailService } from '../email/email.service';

@Injectable()
export class BillingScheduler {
  private readonly logger = new Logger(BillingScheduler.name);

  constructor(private readonly emailService: EmailService) {}

  /**
   * Check for upcoming billing and send reminders
   * Runs daily at 9:00 AM
   */
  @Cron(CronExpression.EVERY_DAY_AT_9AM)
  async sendBillingReminders() {
    this.logger.log('Running billing reminder check...');

    // Get services that will be billed in the next 7 days
    const upcomingBillingDate = new Date();
    upcomingBillingDate.setDate(upcomingBillingDate.getDate() + 7);

    const services = await prisma.clientService.findMany({
      where: {
        status: ClientServiceStatus.ACTIVE,
        enableRecurring: true,
        nextBillingDate: {
          lte: upcomingBillingDate,
          gte: new Date(),
        },
      },
      include: {
        user: true,
        serviceDefinition: true,
      },
    });

    for (const service of services) {
      if (!service.nextBillingDate) continue;

      const daysUntilBilling = Math.ceil(
        (service.nextBillingDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      );

      const recurringAmount = service.serviceDefinition.recurringPricePerUnit
        ? (service.serviceDefinition.recurringPrice! * service.units) / 100
        : service.serviceDefinition.recurringPrice! / 100;

      await this.emailService.sendEmail({
        to: service.user.email,
        subject: `Upcoming Billing - ${service.serviceDefinition.name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Billing Reminder</h2>
            <p>Dear ${service.user.name},</p>
            <p>This is a reminder that your subscription for <strong>${service.serviceDefinition.name}</strong> will be billed in <strong>${daysUntilBilling} day(s)</strong>.</p>
            
            <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0;">Billing Details</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0;"><strong>Service:</strong></td>
                  <td style="padding: 8px 0; text-align: right;">${service.serviceDefinition.name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0;"><strong>Units:</strong></td>
                  <td style="padding: 8px 0; text-align: right;">${service.units}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0;"><strong>Next Billing Date:</strong></td>
                  <td style="padding: 8px 0; text-align: right;">${service.nextBillingDate.toLocaleDateString()}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-top: 2px solid #ddd;"><strong>Amount:</strong></td>
                  <td style="padding: 8px 0; text-align: right; border-top: 2px solid #ddd;"><strong>$${recurringAmount.toFixed(2)}</strong></td>
                </tr>
              </table>
            </div>

            <p>To manage your subscription, please visit your dashboard.</p>
            
            <p style="color: #666; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
              If you have any questions, please contact us at support@christusveritastechnologies.com
            </p>
          </div>
        `,
      });

      this.logger.log(`Billing reminder sent to ${service.user.email} for service ${service.serviceDefinition.name}`);
    }

    this.logger.log(`Billing reminder check completed. Sent ${services.length} reminders.`);
  }

  /**
   * Process recurring billing
   * Runs daily at 1:00 AM
   */
  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async processRecurringBilling() {
    this.logger.log('Running recurring billing process...');

    // Get services that need to be billed today
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    const servicesToBill = await prisma.clientService.findMany({
      where: {
        status: ClientServiceStatus.ACTIVE,
        enableRecurring: true,
        nextBillingDate: {
          lte: today,
        },
      },
      include: {
        user: true,
        serviceDefinition: true,
      },
    });

    for (const service of servicesToBill) {
      try {
        await this.billService(service);
      } catch (error) {
        this.logger.error(`Failed to bill service ${service.id}: ${error}`);
      }
    }

    this.logger.log(`Recurring billing completed. Processed ${servicesToBill.length} services.`);
  }

  /**
   * Bill a specific service
   */
  private async billService(service: any): Promise<void> {
    const recurringAmount = service.serviceDefinition.recurringPricePerUnit
      ? service.serviceDefinition.recurringPrice! * service.units
      : service.serviceDefinition.recurringPrice!;

    // Create a payment request notification
    await prisma.notification.create({
      data: {
        userId: service.userId,
        type: 'PAYMENT',
        title: 'Recurring Payment Due',
        message: `Your subscription for ${service.serviceDefinition.name} is due. Amount: $${(recurringAmount / 100).toFixed(2)}`,
      },
    });

    // Send billing email
    await this.emailService.sendEmail({
      to: service.user.email,
      subject: `Payment Due - ${service.serviceDefinition.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Payment Due</h2>
          <p>Dear ${service.user.name},</p>
          <p>Your recurring payment for <strong>${service.serviceDefinition.name}</strong> is now due.</p>
          
          <div style="background-color: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
            <h3 style="margin-top: 0;">Payment Required</h3>
            <p style="margin: 0;"><strong>Amount Due: $${(recurringAmount / 100).toFixed(2)}</strong></p>
            <p style="margin: 10px 0 0 0;">Please log in to your account to complete the payment.</p>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/dashboard/services" style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; display: inline-block;">Pay Now</a>
          </div>
          
          <p style="color: #666; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
            If you have any questions, please contact us at support@christusveritastechnologies.com
          </p>
        </div>
      `,
    });

    // Update next billing date
    const nextBillingDate = new Date(service.nextBillingDate);
    nextBillingDate.setDate(nextBillingDate.getDate() + service.serviceDefinition.billingCycleDays);

    await prisma.clientService.update({
      where: { id: service.id },
      data: {
        nextBillingDate,
      },
    });

    this.logger.log(`Billed service ${service.serviceDefinition.name} for user ${service.user.email}`);
  }
}
