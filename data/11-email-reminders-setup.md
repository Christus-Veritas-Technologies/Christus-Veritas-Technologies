# Email Reminder System (Future Implementation)

## Overview
Automated email reminders for maintenance payments using Nodemailer and a scheduled cron job.

## Setup Required

### 1. Email Configuration
Already have Nodemailer installed. Configure SMTP settings in `.env`:
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=noreply@cvt.com
EMAIL_PASS=your-app-password
EMAIL_FROM=CVT Maintenance <noreply@cvt.com>
```

### 2. Cron Job Service
Create `apps/server/src/maintenance/maintenance-cron.service.ts`:

```typescript
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MaintenanceService } from './maintenance.service';
import { EmailService } from '../email/email.service';
import { addDays } from 'date-fns';

@Injectable()
export class MaintenanceCronService {
  constructor(
    private maintenanceService: MaintenanceService,
    private emailService: EmailService,
  ) {}

  // Run daily at 9 AM
  @Cron(CronExpression.EVERY_DAY_AT_9AM)
  async sendMaintenanceReminders() {
    // Get maintenance due in 7 days
    const dueSoon = await this.maintenanceService.getMaintenanceDueSoon(7);
    
    for (const maintenance of dueSoon) {
      await this.sendReminderEmail(maintenance, '7-day');
      await this.maintenanceService.updateReminderSent(maintenance.id);
    }
    
    // Get overdue maintenance
    const overdue = await this.maintenanceService.getOverdueMaintenance();
    
    for (const maintenance of overdue) {
      await this.sendReminderEmail(maintenance, 'overdue');
      await this.maintenanceService.updateReminderSent(maintenance.id);
    }
  }
  
  private async sendReminderEmail(maintenance: any, type: string) {
    const subject = type === 'overdue' 
      ? `⚠️ Overdue: ${maintenance.project.title} Maintenance Payment`
      : `🔔 Reminder: ${maintenance.project.title} Maintenance Due Soon`;
      
    const html = this.generateEmailTemplate(maintenance, type);
    
    await this.emailService.sendEmail({
      to: maintenance.project.user.email,
      subject,
      html,
    });
  }
  
  private generateEmailTemplate(maintenance: any, type: string): string {
    const amount = `$${(maintenance.monthlyFee / 100).toFixed(2)}`;
    const dueDate = new Date(maintenance.currentPeriodEnd).toLocaleDateString();
    
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
            .content { background: #f9fafb; padding: 20px; }
            .amount { font-size: 32px; font-weight: bold; color: #2563eb; }
            .button { 
              background: #2563eb; 
              color: white; 
              padding: 12px 24px; 
              text-decoration: none; 
              border-radius: 6px;
              display: inline-block;
              margin: 20px 0;
            }
            .warning { background: #fef2f2; border-left: 4px solid #dc2626; padding: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Maintenance Payment ${type === 'overdue' ? 'Overdue' : 'Reminder'}</h1>
            </div>
            <div class="content">
              ${type === 'overdue' ? `
                <div class="warning">
                  <strong>⚠️ Payment Overdue</strong>
                  <p>Your maintenance payment was due on ${dueDate}. Please make payment as soon as possible.</p>
                </div>
              ` : `
                <p>Your monthly maintenance payment will be due soon.</p>
              `}
              
              <h2>Project: ${maintenance.project.title}</h2>
              <p><strong>Monthly Fee:</strong> <span class="amount">${amount}</span></p>
              <p><strong>Due Date:</strong> ${dueDate}</p>
              
              <a href="${process.env.FRONTEND_URL}/dashboard/maintenance" class="button">
                Make Payment
              </a>
              
              <h3>Payment Methods</h3>
              <ul>
                <li><strong>Paynow:</strong> Pay online for instant confirmation</li>
                <li><strong>Cash:</strong> Mark as paid in your dashboard (requires admin confirmation)</li>
              </ul>
              
              <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
                If you have already made payment, please disregard this email.
              </p>
            </div>
          </div>
        </body>
      </html>
    `;
  }
}
```

### 3. Install Dependencies
```bash
bun add @nestjs/schedule
```

### 4. Update MaintenanceModule
```typescript
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { MaintenanceController } from './maintenance.controller';
import { MaintenanceService } from './maintenance.service';
import { MaintenanceCronService } from './maintenance-cron.service';
import { DatabaseModule } from '../config/database.module';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [
    DatabaseModule,
    EmailModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [MaintenanceController],
  providers: [MaintenanceService, MaintenanceCronService],
  exports: [MaintenanceService],
})
export class MaintenanceModule {}
```

## Reminder Schedule

| Event | Trigger | Email Type |
|-------|---------|------------|
| 7 days before due | Daily cron at 9 AM | "Due Soon" reminder |
| Due date | Daily cron at 9 AM | "Payment Due Today" |
| After due date | Daily cron at 9 AM | "Overdue" warning |

## Email Templates

### 1. Due Soon (7 days before)
- Subject: 🔔 Reminder: [Project] Maintenance Due Soon
- Tone: Friendly reminder
- CTA: Make Payment button

### 2. Overdue
- Subject: ⚠️ Overdue: [Project] Maintenance Payment
- Tone: Urgent but professional
- CTA: Make Payment Now button
- Warning banner

## Testing

### Manual Test Endpoint (Admin Only)
```typescript
@Post('admin/:id/send-test-reminder')
@Roles(Role.ADMIN)
async sendTestReminder(@Param('id') id: string) {
  const maintenance = await this.maintenanceService.getMaintenance(id);
  await this.maintenanceCronService.sendReminderEmail(maintenance, '7-day');
  return { message: 'Test reminder sent' };
}
```

## Configuration Options

Add to `.env`:
```env
# Reminder settings
MAINTENANCE_REMINDER_DAYS=7
MAINTENANCE_REMINDER_TIME=09:00
MAINTENANCE_MAX_REMINDERS=3
```

## Database Tracking

Already implemented:
- `lastReminderSent` - Timestamp of last reminder
- `reminderCount` - Total reminders sent for current period
- Reset on period advance

## Future Enhancements

1. **Configurable Schedules**: Per-client reminder preferences
2. **Reminder Templates**: Customizable email templates
3. **SMS Notifications**: Twilio integration for SMS reminders
4. **Escalation**: After X reminders, escalate to admin
5. **Unsubscribe**: Allow clients to opt-out of reminders
6. **Digest Emails**: Weekly summary of all maintenance for clients with multiple projects

## Notes

- Cron jobs only run when server is running
- Consider using a task queue (Bull/BullMQ) for reliability
- Log all sent emails for audit trail
- Implement rate limiting to avoid spam filters
- Test thoroughly with different timezones
