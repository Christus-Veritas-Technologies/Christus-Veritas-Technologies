# Integrations

## Overview

This document details the external integrations for the Christus Veritas Technologies ERP:

1. **Paynow** - Payment processing
2. **Email Service** - Transactional emails
3. **POS Systems** - Hardware integration

---

## 1. Paynow Integration

### Overview

Paynow is Zimbabwe's leading payment gateway, supporting mobile money and card payments. It serves as the **payment processor only**—all billing logic remains in the ERP.

### Supported Payment Methods

| Method | Provider | Notes |
|--------|----------|-------|
| EcoCash | Econet | Most popular |
| OneMoney | NetOne | Growing usage |
| InnBucks | Innscor | Prepaid wallet |
| Visa | Card Networks | Requires PCI |
| Mastercard | Card Networks | Requires PCI |

### Integration Flow

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│   ERP    │────▶│  Paynow  │────▶│  Client  │────▶│  Mobile  │
│ Initiate │     │  Create  │     │ Redirect │     │  Money   │
│ Payment  │     │   TX     │     │  to Pay  │     │   App    │
└──────────┘     └──────────┘     └──────────┘     └──────────┘
     │                                                   │
     │           ┌──────────┐      ┌──────────┐          │
     │◀──────────│ Webhook  │◀─────│  Paynow  │◀─────────┘
     │           │ Callback │      │ Confirms │
     │           └──────────┘      └──────────┘
     ▼
┌──────────┐
│  Update  │
│ Invoice  │
└──────────┘
```

### Paynow Service Implementation

```typescript
// src/modules/payments/paynow.service.ts

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Paynow } from 'paynow';

export interface PaynowPaymentRequest {
  reference: string;
  amount: number;
  email: string;
  method: PaymentMethod;
  phone?: string; // Required for mobile money
}

export interface PaynowPaymentResponse {
  success: boolean;
  redirectUrl?: string;
  pollUrl?: string;
  error?: string;
}

export interface PaynowStatusResponse {
  status: 'Created' | 'Sent' | 'Paid' | 'Awaiting Delivery' | 'Delivered' | 'Failed' | 'Cancelled';
  amount: number;
  reference: string;
}

@Injectable()
export class PaynowService {
  private paynow: Paynow;
  
  constructor(private config: ConfigService) {
    this.paynow = new Paynow(
      config.get('PAYNOW_INTEGRATION_ID'),
      config.get('PAYNOW_INTEGRATION_KEY'),
    );
    
    this.paynow.resultUrl = config.get('PAYNOW_RESULT_URL');
    this.paynow.returnUrl = config.get('PAYNOW_RETURN_URL');
  }
  
  async createPayment(request: PaynowPaymentRequest): Promise<PaynowPaymentResponse> {
    const payment = this.paynow.createPayment(
      request.reference,
      request.email,
    );
    
    payment.add('Invoice Payment', request.amount);
    
    let response;
    
    if (this.isMobileMethod(request.method)) {
      // Mobile money payment
      const mobileMethod = this.getMobileMethodCode(request.method);
      response = await this.paynow.sendMobile(
        payment,
        request.phone,
        mobileMethod,
      );
    } else {
      // Web payment (card, bank)
      response = await this.paynow.send(payment);
    }
    
    if (!response.success) {
      return {
        success: false,
        error: response.error || 'Payment initiation failed',
      };
    }
    
    return {
      success: true,
      redirectUrl: response.redirectUrl,
      pollUrl: response.pollUrl,
    };
  }
  
  async checkStatus(pollUrl: string): Promise<PaynowStatusResponse> {
    const status = await this.paynow.pollTransaction(pollUrl);
    
    return {
      status: status.status,
      amount: status.amount,
      reference: status.reference,
    };
  }
  
  private isMobileMethod(method: PaymentMethod): boolean {
    return ['PAYNOW_ECOCASH', 'PAYNOW_ONEMONEY', 'PAYNOW_INNBUCKS'].includes(method);
  }
  
  private getMobileMethodCode(method: PaymentMethod): string {
    const codes = {
      PAYNOW_ECOCASH: 'ecocash',
      PAYNOW_ONEMONEY: 'onemoney',
      PAYNOW_INNBUCKS: 'innbucks',
    };
    return codes[method];
  }
}
```

### Webhook Handler

```typescript
// src/modules/webhooks/paynow-webhook.handler.ts

import { Controller, Post, Body, Headers, BadRequestException } from '@nestjs/common';
import { PaymentsService } from '../payments/payments.service';

interface PaynowWebhookPayload {
  reference: string;
  paynowreference: string;
  amount: string;
  status: string;
  hash: string;
}

@Controller('webhooks')
export class WebhooksController {
  constructor(
    private paymentsService: PaymentsService,
    private configService: ConfigService,
  ) {}
  
  @Post('paynow')
  async handlePaynowWebhook(
    @Body() payload: PaynowWebhookPayload,
  ) {
    // Verify hash
    const isValid = this.verifyPaynowHash(payload);
    if (!isValid) {
      throw new BadRequestException('Invalid hash');
    }
    
    // Find payment by reference (our payment ID)
    const payment = await this.paymentsService.findByReference(payload.reference);
    
    if (!payment) {
      // Log unknown reference but return 200 to prevent retries
      console.warn('Unknown payment reference:', payload.reference);
      return { received: true };
    }
    
    // Update payment status
    if (payload.status === 'Paid') {
      await this.paymentsService.markPaid(payment.id, {
        externalReference: payload.paynowreference,
        amount: parseFloat(payload.amount) * 100, // Convert to cents
      });
    } else if (['Failed', 'Cancelled'].includes(payload.status)) {
      await this.paymentsService.markFailed(payment.id, payload.status);
    }
    
    return { received: true };
  }
  
  private verifyPaynowHash(payload: PaynowWebhookPayload): boolean {
    const integrationKey = this.configService.get('PAYNOW_INTEGRATION_KEY');
    const dataToHash = Object.entries(payload)
      .filter(([key]) => key !== 'hash')
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([, value]) => value)
      .join('');
    
    const expectedHash = crypto
      .createHash('sha512')
      .update(dataToHash + integrationKey)
      .digest('hex')
      .toUpperCase();
    
    return payload.hash === expectedHash;
  }
}
```

### Payment Reconciliation Job

```typescript
// src/jobs/payment-reconciliation.job.ts

import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '@cvt/db';
import { PaynowService } from '../modules/payments/paynow.service';
import { PaymentsService } from '../modules/payments/payments.service';

@Injectable()
export class PaymentReconciliationJob {
  constructor(
    private prisma: PrismaService,
    private paynowService: PaynowService,
    private paymentsService: PaymentsService,
  ) {}
  
  @Cron('*/15 * * * *') // Every 15 minutes
  async reconcilePendingPayments() {
    // Find pending payments older than 5 minutes
    const pendingPayments = await this.prisma.payment.findMany({
      where: {
        status: 'PENDING',
        initiatedAt: {
          lt: subMinutes(new Date(), 5),
        },
        externalId: { not: null },
      },
    });
    
    for (const payment of pendingPayments) {
      try {
        const status = await this.paynowService.checkStatus(payment.externalId);
        
        if (status.status === 'Paid') {
          await this.paymentsService.markPaid(payment.id, {
            externalStatus: status.status,
          });
        } else if (['Failed', 'Cancelled'].includes(status.status)) {
          await this.paymentsService.markFailed(payment.id, status.status);
        }
        // If still pending, leave as is for next check
        
      } catch (error) {
        console.error(`Failed to reconcile payment ${payment.id}:`, error);
      }
    }
  }
  
  @Cron('0 0 * * *') // Daily at midnight
  async expireStalePendingPayments() {
    // Expire payments pending for more than 24 hours
    await this.prisma.payment.updateMany({
      where: {
        status: 'PENDING',
        initiatedAt: {
          lt: subHours(new Date(), 24),
        },
      },
      data: {
        status: 'FAILED',
        failedAt: new Date(),
        errorMessage: 'Payment expired after 24 hours',
      },
    });
  }
}
```

### Configuration

```env
# Paynow Configuration
PAYNOW_INTEGRATION_ID=12345
PAYNOW_INTEGRATION_KEY=abc123...
PAYNOW_RESULT_URL=https://api.cvt.co.zw/webhooks/paynow
PAYNOW_RETURN_URL=https://cvt.co.zw/payment/complete
```

---

## 2. Email Service Integration

### Overview

Transactional emails are critical for the billing workflow. The ERP uses a reliable email service for all client communication.

### Email Types

| Category | Templates |
|----------|-----------|
| Authentication | Welcome, Email Verification, Password Reset |
| Billing | Invoice Issued, Payment Reminder, Overdue Notice, Final Warning |
| Payments | Payment Confirmation, Payment Failed |
| Account | Suspension Notice, Reactivation Confirmation |
| Support | Ticket Created, Ticket Updated, Ticket Resolved |

### Email Service Architecture

```typescript
// src/modules/notifications/email.service.ts

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { PrismaService } from '@cvt/db';

export interface EmailOptions {
  to: string;
  subject: string;
  template: string;
  data: Record<string, any>;
  entityType?: string;
  entityId?: string;
}

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;
  
  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
  ) {
    this.transporter = nodemailer.createTransport({
      host: config.get('SMTP_HOST'),
      port: config.get('SMTP_PORT'),
      secure: config.get('SMTP_SECURE') === 'true',
      auth: {
        user: config.get('SMTP_USER'),
        pass: config.get('SMTP_PASS'),
      },
    });
  }
  
  async send(options: EmailOptions): Promise<void> {
    // Create email log entry
    const emailLog = await this.prisma.emailLog.create({
      data: {
        to: options.to,
        subject: options.subject,
        template: options.template,
        entityType: options.entityType,
        entityId: options.entityId,
        status: 'QUEUED',
      },
    });
    
    try {
      const html = await this.renderTemplate(options.template, options.data);
      
      await this.transporter.sendMail({
        from: this.config.get('EMAIL_FROM'),
        to: options.to,
        subject: options.subject,
        html,
      });
      
      await this.prisma.emailLog.update({
        where: { id: emailLog.id },
        data: {
          status: 'SENT',
          sentAt: new Date(),
        },
      });
      
    } catch (error) {
      await this.prisma.emailLog.update({
        where: { id: emailLog.id },
        data: {
          status: 'FAILED',
          failedAt: new Date(),
          errorMessage: error.message,
        },
      });
      
      throw error;
    }
  }
  
  private async renderTemplate(
    template: string,
    data: Record<string, any>,
  ): Promise<string> {
    // Use a templating engine like Handlebars
    const templateContent = await this.loadTemplate(template);
    return Handlebars.compile(templateContent)(data);
  }
  
  private async loadTemplate(name: string): Promise<string> {
    const path = `./templates/${name}.hbs`;
    return fs.readFile(path, 'utf-8');
  }
}
```

### Notification Service

```typescript
// src/modules/notifications/notifications.service.ts

import { Injectable } from '@nestjs/common';
import { EmailService } from './email.service';
import { Invoice, Payment, Organization } from '@prisma/client';

@Injectable()
export class NotificationsService {
  constructor(private emailService: EmailService) {}
  
  async sendInvoiceIssued(
    invoice: Invoice & { billingAccount: { organization: Organization } },
  ): Promise<void> {
    const org = invoice.billingAccount.organization;
    const paymentLink = `https://cvt.co.zw/pay/${invoice.paymentToken}`;
    
    await this.emailService.send({
      to: org.email,
      subject: `Invoice ${invoice.invoiceNumber} - Christus Veritas Technologies`,
      template: 'invoice-issued',
      data: {
        organizationName: org.name,
        invoiceNumber: invoice.invoiceNumber,
        amount: (invoice.total / 100).toFixed(2),
        dueDate: format(invoice.dueAt, 'MMMM d, yyyy'),
        paymentLink,
      },
      entityType: 'Invoice',
      entityId: invoice.id,
    });
  }
  
  async sendPaymentReminder(
    invoice: Invoice & { billingAccount: { organization: Organization } },
  ): Promise<void> {
    const org = invoice.billingAccount.organization;
    const paymentLink = `https://cvt.co.zw/pay/${invoice.paymentToken}`;
    
    await this.emailService.send({
      to: org.email,
      subject: `Payment Reminder: Invoice ${invoice.invoiceNumber}`,
      template: 'payment-reminder',
      data: {
        organizationName: org.name,
        invoiceNumber: invoice.invoiceNumber,
        amount: (invoice.amountDue / 100).toFixed(2),
        dueDate: format(invoice.dueAt, 'MMMM d, yyyy'),
        daysUntilDue: differenceInDays(invoice.dueAt, new Date()),
        paymentLink,
      },
      entityType: 'Invoice',
      entityId: invoice.id,
    });
  }
  
  async sendOverdueNotice(
    invoice: Invoice & { billingAccount: { organization: Organization } },
  ): Promise<void> {
    const org = invoice.billingAccount.organization;
    const paymentLink = `https://cvt.co.zw/pay/${invoice.paymentToken}`;
    
    await this.emailService.send({
      to: org.email,
      subject: `OVERDUE: Invoice ${invoice.invoiceNumber}`,
      template: 'invoice-overdue',
      data: {
        organizationName: org.name,
        invoiceNumber: invoice.invoiceNumber,
        amount: (invoice.amountDue / 100).toFixed(2),
        daysOverdue: differenceInDays(new Date(), invoice.dueAt),
        paymentLink,
        suspensionWarning: true,
      },
      entityType: 'Invoice',
      entityId: invoice.id,
    });
  }
  
  async sendPaymentConfirmation(
    payment: Payment & {
      invoice: Invoice;
      billingAccount: { organization: Organization };
    },
  ): Promise<void> {
    const org = payment.billingAccount.organization;
    
    await this.emailService.send({
      to: org.email,
      subject: `Payment Received - ${payment.invoice.invoiceNumber}`,
      template: 'payment-confirmation',
      data: {
        organizationName: org.name,
        invoiceNumber: payment.invoice.invoiceNumber,
        amount: (payment.amount / 100).toFixed(2),
        paymentDate: format(payment.completedAt, 'MMMM d, yyyy'),
        paymentMethod: this.formatPaymentMethod(payment.method),
      },
      entityType: 'Payment',
      entityId: payment.id,
    });
  }
  
  async sendSuspensionNotice(
    organization: Organization,
    reason: string,
  ): Promise<void> {
    await this.emailService.send({
      to: organization.email,
      subject: 'Account Suspended - Immediate Action Required',
      template: 'suspension-notice',
      data: {
        organizationName: organization.name,
        reason,
        contactEmail: 'accounts@cvt.co.zw',
        portalLink: 'https://cvt.co.zw/clients',
      },
      entityType: 'Organization',
      entityId: organization.id,
    });
  }
  
  private formatPaymentMethod(method: string): string {
    const names = {
      PAYNOW_ECOCASH: 'EcoCash',
      PAYNOW_ONEMONEY: 'OneMoney',
      PAYNOW_INNBUCKS: 'InnBucks',
      PAYNOW_VISA: 'Visa',
      PAYNOW_MASTERCARD: 'Mastercard',
      BANK_TRANSFER: 'Bank Transfer',
      CASH: 'Cash',
      CREDIT: 'Account Credit',
    };
    return names[method] || method;
  }
}
```

### Email Templates

```handlebars
{{!-- templates/invoice-issued.hbs --}}
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Inter', Arial, sans-serif; color: #374151; }
    .header { background: #1e3a5f; color: white; padding: 20px; }
    .content { padding: 30px; }
    .button { 
      background: #1e3a5f; 
      color: white; 
      padding: 12px 24px; 
      text-decoration: none;
      border-radius: 4px;
      display: inline-block;
    }
    .footer { background: #f3f4f6; padding: 20px; font-size: 12px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Christus Veritas Technologies</h1>
  </div>
  
  <div class="content">
    <p>Dear {{organizationName}},</p>
    
    <p>Your invoice <strong>{{invoiceNumber}}</strong> has been issued.</p>
    
    <table>
      <tr>
        <td>Amount Due:</td>
        <td><strong>${{amount}}</strong></td>
      </tr>
      <tr>
        <td>Due Date:</td>
        <td>{{dueDate}}</td>
      </tr>
    </table>
    
    <p>
      <a href="{{paymentLink}}" class="button">Pay Now</a>
    </p>
    
    <p>If you have any questions, please contact us at accounts@cvt.co.zw.</p>
    
    <p>Thank you for your business.</p>
    
    <p>
      Best regards,<br>
      Christus Veritas Technologies
    </p>
  </div>
  
  <div class="footer">
    <p>Christus Veritas Technologies | Harare, Zimbabwe</p>
    <p>This is an automated message. Please do not reply directly.</p>
  </div>
</body>
</html>
```

### Configuration

```env
# Email Configuration
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=noreply@cvt.co.zw
SMTP_PASS=secret
EMAIL_FROM="Christus Veritas Technologies <noreply@cvt.co.zw>"
```

---

## 3. POS System Integration

### Overview

POS terminals authenticate via API keys and communicate with the ERP for:
- Transaction logging
- Usage reporting
- Status verification
- Configuration updates

### API Key Authentication

POS terminals use Bearer token authentication:

```http
GET /api/pos/status
Authorization: Bearer cvt_Hx7kLmNpQrStUvWxYz1234567890abcdef
```

### POS API Endpoints

```
# POS Terminal Endpoints (API Key Auth Required)

GET  /api/pos/status           # Check terminal status & config
POST /api/pos/transactions     # Log a transaction
POST /api/pos/heartbeat        # Report terminal is online
GET  /api/pos/config           # Get terminal configuration
```

### POS Controller

```typescript
// src/modules/pos/pos.controller.ts

import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiKeyGuard, ScopeGuard } from '@/common/guards';
import { CurrentApiKey } from '@/common/decorators';
import { ValidatedApiKey } from '@cvt/auth';

@Controller('pos')
@UseGuards(ApiKeyGuard)
export class PosController {
  constructor(
    private posService: PosService,
    private usageService: UsageService,
  ) {}
  
  @Get('status')
  @UseGuards(new ScopeGuard('pos:read'))
  async getStatus(@CurrentApiKey() apiKey: ValidatedApiKey) {
    // Check billing status
    const billingStatus = await this.posService.getBillingStatus(
      apiKey.organizationId,
    );
    
    return {
      status: billingStatus === 'ACTIVE' ? 'operational' : 'suspended',
      billingStatus,
      timestamp: new Date().toISOString(),
    };
  }
  
  @Post('transactions')
  @UseGuards(new ScopeGuard('pos:write'))
  async logTransaction(
    @CurrentApiKey() apiKey: ValidatedApiKey,
    @Body() transaction: LogTransactionDto,
  ) {
    // Log usage event
    await this.usageService.logEvent({
      organizationId: apiKey.organizationId,
      apiKeyId: apiKey.id,
      eventType: 'pos.transaction',
      eventData: {
        amount: transaction.amount,
        currency: transaction.currency,
        type: transaction.type,
        reference: transaction.reference,
      },
      quantity: 1,
    });
    
    return {
      success: true,
      eventId: /* generated event ID */,
    };
  }
  
  @Post('heartbeat')
  async heartbeat(@CurrentApiKey() apiKey: ValidatedApiKey) {
    await this.posService.recordHeartbeat(apiKey.id);
    
    return {
      success: true,
      timestamp: new Date().toISOString(),
    };
  }
  
  @Get('config')
  @UseGuards(new ScopeGuard('pos:read'))
  async getConfig(@CurrentApiKey() apiKey: ValidatedApiKey) {
    const config = await this.posService.getTerminalConfig(apiKey.id);
    
    return {
      config,
      lastUpdated: config.updatedAt,
    };
  }
}
```

### Billing Status Check Middleware

```typescript
// Ensures suspended accounts cannot use POS

@UseGuards(ApiKeyGuard, BillingStatusGuard)
export class PosController {
  // All endpoints protected by billing status
}
```

### Usage Event Logging

```typescript
// src/modules/usage/usage.service.ts

export interface LogEventRequest {
  organizationId: string;
  apiKeyId?: string;
  eventType: string;
  eventData?: Record<string, any>;
  quantity?: number;
}

@Injectable()
export class UsageService {
  constructor(private prisma: PrismaService) {}
  
  async logEvent(request: LogEventRequest): Promise<UsageEvent> {
    return this.prisma.usageEvent.create({
      data: {
        organizationId: request.organizationId,
        apiKeyId: request.apiKeyId,
        eventType: request.eventType,
        eventData: request.eventData,
        quantity: request.quantity ?? 1,
      },
    });
  }
  
  async getUsageSummary(
    organizationId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<UsageSummary> {
    const events = await this.prisma.usageEvent.groupBy({
      by: ['eventType'],
      where: {
        organizationId,
        timestamp: { gte: startDate, lte: endDate },
      },
      _sum: { quantity: true },
      _count: true,
    });
    
    return {
      period: { startDate, endDate },
      byEventType: events.map(e => ({
        eventType: e.eventType,
        count: e._count,
        totalQuantity: e._sum.quantity,
      })),
    };
  }
}
```

### Rate Limiting

```typescript
// src/common/middleware/rate-limit.middleware.ts

import { Injectable, NestMiddleware } from '@nestjs/common';
import { RateLimiterRedis } from 'rate-limiter-flexible';

@Injectable()
export class ApiKeyRateLimitMiddleware implements NestMiddleware {
  private rateLimiter: RateLimiterRedis;
  
  constructor(private redis: RedisService) {
    this.rateLimiter = new RateLimiterRedis({
      storeClient: redis.client,
      keyPrefix: 'rl:apikey:',
      points: 1000, // Default, overridden per key
      duration: 3600, // Per hour
    });
  }
  
  async use(req: Request, res: Response, next: NextFunction) {
    const apiKey = req['apiKey'];
    
    if (!apiKey) {
      return next();
    }
    
    try {
      await this.rateLimiter.consume(apiKey.id, 1);
      next();
    } catch (error) {
      res.status(429).json({
        success: false,
        error: {
          message: 'Rate limit exceeded',
          retryAfter: Math.ceil(error.msBeforeNext / 1000),
        },
      });
    }
  }
}
```

---

## Integration Testing

### Paynow Test Mode

```typescript
// Use Paynow sandbox for testing
const paynow = new Paynow(
  process.env.PAYNOW_TEST_INTEGRATION_ID,
  process.env.PAYNOW_TEST_INTEGRATION_KEY,
);
paynow.resultUrl = 'https://staging-api.cvt.co.zw/webhooks/paynow';
```

### Email Testing

```typescript
// Use Ethereal or similar for development
if (process.env.NODE_ENV === 'development') {
  const testAccount = await nodemailer.createTestAccount();
  // Use test SMTP credentials
}
```

### POS Simulation

```typescript
// Test script for POS integration
async function simulatePosTerminal() {
  const apiKey = 'cvt_test_key';
  
  // Check status
  const status = await fetch('/api/pos/status', {
    headers: { Authorization: `Bearer ${apiKey}` },
  });
  
  // Log transaction
  const tx = await fetch('/api/pos/transactions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount: 1500,
      currency: 'USD',
      type: 'sale',
      reference: 'TX-001',
    }),
  });
}
```

---

## Error Handling

### Retry Strategies

| Integration | Retry Policy |
|-------------|--------------|
| Paynow | 3 retries, exponential backoff |
| Email | 5 retries over 24 hours |
| POS Webhooks | Client should retry |

### Circuit Breaker

```typescript
import CircuitBreaker from 'opossum';

const paynowBreaker = new CircuitBreaker(paynowService.createPayment, {
  timeout: 10000,
  errorThresholdPercentage: 50,
  resetTimeout: 30000,
});

paynowBreaker.on('open', () => {
  console.error('Paynow circuit breaker opened');
  // Alert operations team
});
```

---

## Next: [Implementation Roadmap](./09-implementation-roadmap.md)
