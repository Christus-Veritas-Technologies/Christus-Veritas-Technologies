# Billing System

## Overview

This document details the billing system for the Christus Veritas Technologies ERP. The billing system is the **central function** of the ERP and the **single source of truth** for all financial operations.

---

## Core Principles

### 1. ERP is the Authority
All billing logic resides in the ERP. Payment gateways (Paynow) are used only for payment processing, never for billing decisions.

### 2. Invoices are Immutable
Once issued, invoices cannot be modified. Corrections are made via credits or adjustment invoices.

### 3. Deterministic Generation
Invoice generation is deterministic—same inputs always produce same outputs. No hidden calculations.

### 4. Graceful Enforcement
Non-hostile approach to collection:
- Clear communication
- Grace periods
- Escalating notifications
- Service suspension as last resort

---

## Billing Cycle

```
┌─────────────────────────────────────────────────────────────────────┐
│                        MONTHLY BILLING CYCLE                        │
└─────────────────────────────────────────────────────────────────────┘
     │
     ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Day 1     │────▶│   Day 7     │────▶│   Day 14    │
│  Generate   │     │  Reminder   │     │   Overdue   │
│  Invoices   │     │   Email     │     │   Notice    │
└─────────────┘     └─────────────┘     └─────────────┘
                                               │
                                               ▼
                    ┌─────────────┐     ┌─────────────┐
                    │   Day 30    │◀────│   Day 21    │
                    │   Suspend   │     │   Warning   │
                    │  Services   │     │   Email     │
                    └─────────────┘     └─────────────┘
```

### Timeline

| Day | Action | Status Change |
|-----|--------|---------------|
| 1 | Generate invoice | Invoice: `ISSUED` |
| 1 | Send invoice email | - |
| 7 | Send payment reminder | - |
| 14 | Mark as overdue | Invoice: `OVERDUE`, Account: `OVERDUE` |
| 14 | Send overdue notice | - |
| 21 | Send final warning | - |
| 30 | Suspend services | Account: `SUSPENDED` |

---

## Invoice Generation

### Monthly Invoice Structure

```typescript
interface MonthlyInvoice {
  // Header
  invoiceNumber: string;      // INV-2026-000001
  organizationId: string;
  billingAccountId: string;
  
  // Period
  periodStart: Date;          // First day of month
  periodEnd: Date;            // Last day of month
  
  // Line Items
  lineItems: InvoiceLineItem[];
  
  // Totals
  subtotal: number;           // Sum of line items (cents)
  tax: number;                // Tax amount (cents)
  total: number;              // Final amount (cents)
  
  // Dates
  issuedAt: Date;
  dueAt: Date;                // 14 days after issue
}
```

### Line Item Types

| Type | Description | Calculation |
|------|-------------|-------------|
| Fixed Monthly Fee | Maintenance, support | `monthlyFee` from Service |
| Hardware Fee | POS terminal fee | `monthlyFee` from Service |
| Usage Charges | Metered usage (future) | Aggregate from UsageEvents |
| Adjustments | Credits, discounts | Manual or automated |

### Generation Algorithm

```typescript
// src/modules/billing/invoice-generator.ts

export class InvoiceGenerator {
  async generateMonthlyInvoice(organization: Organization): Promise<Invoice> {
    const billingAccount = organization.billingAccount;
    const services = organization.services.filter(s => s.status === 'ACTIVE');
    
    // Calculate period
    const periodStart = startOfMonth(new Date());
    const periodEnd = endOfMonth(new Date());
    
    // Generate line items
    const lineItems: CreateLineItem[] = [];
    
    for (const service of services) {
      lineItems.push({
        description: `${service.name} - Monthly Fee`,
        quantity: 1,
        unitPrice: service.monthlyFee,
        total: service.monthlyFee,
        serviceId: service.id,
      });
    }
    
    // Calculate totals
    const subtotal = lineItems.reduce((sum, item) => sum + item.total, 0);
    const tax = 0; // Zimbabwe: VAT exemptions may apply
    const total = subtotal + tax;
    
    // Generate invoice number
    const invoiceNumber = await this.generateInvoiceNumber();
    
    // Generate payment token
    const paymentToken = this.generatePaymentToken();
    
    // Create invoice
    const invoice = await this.prisma.invoice.create({
      data: {
        billingAccountId: billingAccount.id,
        invoiceNumber,
        periodStart,
        periodEnd,
        subtotal,
        tax,
        total,
        amountDue: total,
        status: 'ISSUED',
        issuedAt: new Date(),
        dueAt: addDays(new Date(), 14),
        paymentToken,
        paymentTokenExpiresAt: addDays(new Date(), 60),
        finalizedAt: new Date(),
        lineItems: {
          create: lineItems,
        },
      },
      include: { lineItems: true },
    });
    
    return invoice;
  }
  
  private async generateInvoiceNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const count = await this.prisma.invoice.count({
      where: {
        invoiceNumber: { startsWith: `INV-${year}` },
      },
    });
    
    return `INV-${year}-${String(count + 1).padStart(6, '0')}`;
  }
  
  private generatePaymentToken(): string {
    return randomBytes(32).toString('base64url');
  }
}
```

---

## Invoice States

```
┌─────────┐
│  DRAFT  │ (not used in monthly billing)
└────┬────┘
     │ issue()
     ▼
┌─────────┐     pay()      ┌────────┐
│ ISSUED  │───────────────▶│  PAID  │
└────┬────┘                └────────┘
     │                          ▲
     │ overdue                  │
     ▼                          │
┌─────────┐    pay()            │
│ OVERDUE │─────────────────────┘
└────┬────┘
     │
     │ void()
     ▼
┌─────────┐
│  VOID   │
└─────────┘
```

### State Transitions

```typescript
// src/modules/billing/invoice.service.ts

export class InvoiceService {
  async markOverdue(invoiceId: string): Promise<void> {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id: invoiceId },
    });
    
    if (invoice.status !== 'ISSUED') {
      throw new BadRequestException('Only issued invoices can become overdue');
    }
    
    await this.prisma.$transaction([
      this.prisma.invoice.update({
        where: { id: invoiceId },
        data: { status: 'OVERDUE' },
      }),
      this.prisma.billingAccount.update({
        where: { id: invoice.billingAccountId },
        data: { status: 'OVERDUE' },
      }),
    ]);
  }
  
  async markPaid(invoiceId: string, paymentId: string): Promise<void> {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id: invoiceId },
    });
    
    if (!['ISSUED', 'OVERDUE', 'PARTIAL'].includes(invoice.status)) {
      throw new BadRequestException('Invoice cannot be marked as paid');
    }
    
    await this.prisma.$transaction([
      this.prisma.invoice.update({
        where: { id: invoiceId },
        data: {
          status: 'PAID',
          paidAt: new Date(),
          amountPaid: invoice.total,
          amountDue: 0,
        },
      }),
      // Reactivate account if it was overdue
      this.prisma.billingAccount.updateMany({
        where: {
          id: invoice.billingAccountId,
          status: { in: ['OVERDUE', 'SUSPENDED'] },
        },
        data: { status: 'ACTIVE' },
      }),
    ]);
  }
  
  async voidInvoice(invoiceId: string, reason: string): Promise<void> {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id: invoiceId },
    });
    
    if (invoice.status === 'PAID') {
      throw new BadRequestException('Cannot void a paid invoice');
    }
    
    await this.prisma.invoice.update({
      where: { id: invoiceId },
      data: { status: 'VOID' },
    });
    
    await this.auditLog.record({
      action: 'invoice.voided',
      entityType: 'Invoice',
      entityId: invoiceId,
      metadata: { reason },
    });
  }
}
```

---

## Payment Processing

### Payment Flow

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  Client  │────▶│   ERP    │────▶│  Paynow  │────▶│  Client  │
│ Clicks   │     │ Creates  │     │ Redirect │     │  Pays    │
│  Link    │     │ Payment  │     │          │     │          │
└──────────┘     └──────────┘     └──────────┘     └──────────┘
                      │                                  │
                      │           ┌──────────┐           │
                      │◀──────────│ Callback │◀──────────┘
                      │           └──────────┘
                      ▼
              ┌───────────────┐
              │ Reconcile &   │
              │ Update Status │
              └───────────────┘
```

### Initiating Payment

```typescript
// src/modules/payments/payments.service.ts

export class PaymentsService {
  async initiatePayment(
    invoiceId: string,
    method: PaymentMethod,
  ): Promise<PaymentInitiation> {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: {
        billingAccount: {
          include: { organization: true },
        },
      },
    });
    
    if (!['ISSUED', 'OVERDUE', 'PARTIAL'].includes(invoice.status)) {
      throw new BadRequestException('Invoice cannot be paid');
    }
    
    // Create payment record
    const payment = await this.prisma.payment.create({
      data: {
        billingAccountId: invoice.billingAccountId,
        invoiceId: invoice.id,
        amount: invoice.amountDue,
        method,
        status: 'PENDING',
      },
    });
    
    // Initiate with Paynow
    const paynowResponse = await this.paynowService.createPayment({
      reference: payment.id,
      amount: invoice.amountDue / 100, // Convert cents to dollars
      email: invoice.billingAccount.organization.email,
      method,
    });
    
    // Update with external reference
    await this.prisma.payment.update({
      where: { id: payment.id },
      data: {
        externalId: paynowResponse.pollUrl,
      },
    });
    
    return {
      paymentId: payment.id,
      redirectUrl: paynowResponse.redirectUrl,
    };
  }
}
```

### Payment Reconciliation

```typescript
// src/modules/payments/payments.service.ts

export class PaymentsService {
  async reconcilePayment(paymentId: string): Promise<void> {
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
      include: { invoice: true },
    });
    
    if (payment.status !== 'PENDING') return;
    
    // Check status with Paynow
    const status = await this.paynowService.checkStatus(payment.externalId);
    
    if (status === 'Paid') {
      await this.prisma.$transaction([
        this.prisma.payment.update({
          where: { id: paymentId },
          data: {
            status: 'PAID',
            completedAt: new Date(),
            externalStatus: status,
          },
        }),
      ]);
      
      // Update invoice
      await this.invoiceService.markPaid(payment.invoiceId, paymentId);
      
      // Send confirmation email
      await this.notificationService.sendPaymentConfirmation(payment);
      
    } else if (status === 'Failed' || status === 'Cancelled') {
      await this.prisma.payment.update({
        where: { id: paymentId },
        data: {
          status: 'FAILED',
          failedAt: new Date(),
          externalStatus: status,
        },
      });
    }
  }
}
```

---

## Account Status Management

### Status Effects

| Status | API Access | Portal Access | Support | Billing |
|--------|------------|---------------|---------|---------|
| `ACTIVE` | ✅ Full | ✅ Full | ✅ Full | ✅ Normal |
| `OVERDUE` | ✅ Full | ✅ Full | ✅ Full | ⚠️ Reminders |
| `SUSPENDED` | ❌ Denied | ✅ Limited | ⚠️ Billing only | ⚠️ Must pay |

### Status Transitions

```typescript
// src/modules/billing/billing.service.ts

export class BillingService {
  async updateAccountStatuses(): Promise<void> {
    const now = new Date();
    
    // Mark overdue accounts (14+ days past due)
    await this.prisma.billingAccount.updateMany({
      where: {
        status: 'ACTIVE',
        invoices: {
          some: {
            status: 'ISSUED',
            dueAt: { lt: now },
          },
        },
      },
      data: { status: 'OVERDUE' },
    });
    
    // Update invoice statuses
    await this.prisma.invoice.updateMany({
      where: {
        status: 'ISSUED',
        dueAt: { lt: now },
      },
      data: { status: 'OVERDUE' },
    });
    
    // Suspend accounts (30+ days past due)
    const suspensionThreshold = subDays(now, 30);
    
    await this.prisma.billingAccount.updateMany({
      where: {
        status: 'OVERDUE',
        invoices: {
          some: {
            status: 'OVERDUE',
            issuedAt: { lt: suspensionThreshold },
          },
        },
      },
      data: { status: 'SUSPENDED' },
    });
  }
  
  async reactivateAccount(billingAccountId: string): Promise<void> {
    const account = await this.prisma.billingAccount.findUnique({
      where: { id: billingAccountId },
      include: {
        invoices: {
          where: { status: { in: ['ISSUED', 'OVERDUE'] } },
        },
      },
    });
    
    // Check if all invoices are paid
    if (account.invoices.length > 0) {
      throw new BadRequestException('Outstanding invoices must be paid first');
    }
    
    await this.prisma.billingAccount.update({
      where: { id: billingAccountId },
      data: { status: 'ACTIVE' },
    });
  }
}
```

---

## Credits & Adjustments

### Issuing Credits

```typescript
// src/modules/billing/billing.service.ts

export class BillingService {
  async issueCredit(
    billingAccountId: string,
    amount: number,
    reason: string,
    issuedById: string,
  ): Promise<Credit> {
    const credit = await this.prisma.credit.create({
      data: {
        billingAccountId,
        amount,
        reason,
        issuedById,
      },
    });
    
    // Update account balance
    await this.prisma.billingAccount.update({
      where: { id: billingAccountId },
      data: {
        balance: { increment: amount },
      },
    });
    
    await this.auditLog.record({
      action: 'credit.issued',
      entityType: 'Credit',
      entityId: credit.id,
      actorId: issuedById,
      metadata: { amount, reason },
    });
    
    return credit;
  }
  
  async applyCredit(invoiceId: string): Promise<void> {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: { billingAccount: true },
    });
    
    const availableCredit = invoice.billingAccount.balance;
    
    if (availableCredit <= 0) return;
    
    const amountToApply = Math.min(availableCredit, invoice.amountDue);
    
    // Create credit payment
    await this.prisma.payment.create({
      data: {
        billingAccountId: invoice.billingAccountId,
        invoiceId: invoice.id,
        amount: amountToApply,
        method: 'CREDIT',
        status: 'PAID',
        completedAt: new Date(),
      },
    });
    
    // Update invoice
    const newAmountDue = invoice.amountDue - amountToApply;
    await this.prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        amountPaid: invoice.amountPaid + amountToApply,
        amountDue: newAmountDue,
        status: newAmountDue === 0 ? 'PAID' : 'PARTIAL',
        paidAt: newAmountDue === 0 ? new Date() : null,
      },
    });
    
    // Reduce balance
    await this.prisma.billingAccount.update({
      where: { id: invoice.billingAccountId },
      data: {
        balance: { decrement: amountToApply },
      },
    });
  }
}
```

---

## Invoice PDF Generation

```typescript
// src/modules/billing/invoice-pdf.service.ts

import PDFDocument from 'pdfkit';

export class InvoicePdfService {
  async generatePdf(invoiceId: string): Promise<Buffer> {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: {
        lineItems: true,
        billingAccount: {
          include: { organization: true },
        },
      },
    });
    
    const doc = new PDFDocument();
    const chunks: Buffer[] = [];
    
    doc.on('data', chunks.push.bind(chunks));
    
    // Header
    doc.fontSize(24).text('INVOICE', { align: 'center' });
    doc.moveDown();
    
    // Company Info
    doc.fontSize(12)
      .text('Christus Veritas Technologies')
      .text('Harare, Zimbabwe')
      .text('accounts@cvt.co.zw');
    
    doc.moveDown();
    
    // Invoice Details
    doc.text(`Invoice Number: ${invoice.invoiceNumber}`)
      .text(`Date: ${format(invoice.issuedAt, 'dd MMM yyyy')}`)
      .text(`Due Date: ${format(invoice.dueAt, 'dd MMM yyyy')}`);
    
    doc.moveDown();
    
    // Client Info
    const org = invoice.billingAccount.organization;
    doc.text('Bill To:')
      .text(org.name)
      .text(org.address || '')
      .text(org.email);
    
    doc.moveDown();
    
    // Line Items Table
    // ... table rendering ...
    
    // Totals
    doc.moveDown()
      .text(`Subtotal: $${(invoice.subtotal / 100).toFixed(2)}`, { align: 'right' })
      .text(`Tax: $${(invoice.tax / 100).toFixed(2)}`, { align: 'right' })
      .fontSize(14)
      .text(`Total: $${(invoice.total / 100).toFixed(2)}`, { align: 'right' });
    
    // Payment Link
    if (invoice.paymentToken && invoice.status !== 'PAID') {
      doc.moveDown()
        .fontSize(10)
        .text(`Pay online: https://cvt.co.zw/pay/${invoice.paymentToken}`);
    }
    
    doc.end();
    
    return Buffer.concat(chunks);
  }
}
```

---

## Reporting

### Available Reports

| Report | Description | Access |
|--------|-------------|--------|
| Revenue Report | Monthly/yearly revenue | Admin |
| Outstanding Report | All unpaid invoices | Admin |
| Aging Report | Invoices by age | Admin |
| Client Statement | Single client history | Admin, Client |
| Payment History | All payments | Admin |

### Revenue Report

```typescript
export class ReportingService {
  async getRevenueReport(
    startDate: Date,
    endDate: Date,
  ): Promise<RevenueReport> {
    const invoices = await this.prisma.invoice.findMany({
      where: {
        status: 'PAID',
        paidAt: { gte: startDate, lte: endDate },
      },
    });
    
    const totalRevenue = invoices.reduce((sum, inv) => sum + inv.total, 0);
    
    // Group by month
    const byMonth = groupBy(invoices, inv => 
      format(inv.paidAt, 'yyyy-MM')
    );
    
    return {
      period: { startDate, endDate },
      totalRevenue,
      invoiceCount: invoices.length,
      byMonth: Object.entries(byMonth).map(([month, invs]) => ({
        month,
        revenue: invs.reduce((sum, inv) => sum + inv.total, 0),
        count: invs.length,
      })),
    };
  }
}
```

---

## Notifications

### Invoice Notifications

| Event | Email Template | Timing |
|-------|----------------|--------|
| Invoice issued | `invoice-issued` | Immediately |
| Payment reminder | `payment-reminder` | 7 days after issue |
| Overdue notice | `invoice-overdue` | 14 days after issue |
| Final warning | `final-warning` | 21 days after issue |
| Suspension notice | `service-suspended` | 30 days after issue |
| Payment received | `payment-confirmation` | Immediately |

---

## Next: [Client Portal](./06-client-portal.md)
