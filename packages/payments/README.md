# @cvt/payments

Payment processing package for Christus Veritas Technologies ERP using Paynow.

## Features

- Paynow payment gateway integration
- Mobile money support (EcoCash, OneMoney, InnBucks)
- Card payments (Visa, Mastercard)
- Payment status tracking and reconciliation
- Webhook handling utilities

## Configuration

Set the following environment variables:

```env
PAYNOW_INTEGRATION_ID=your_integration_id
PAYNOW_INTEGRATION_KEY=your_integration_key
PAYNOW_RESULT_URL=https://api.yoursite.com/webhooks/paynow
PAYNOW_RETURN_URL=https://yoursite.com/payment/complete
```

## Usage

### Initialize Paynow Service

```typescript
import { createPaynowService } from "@cvt/payments";

const paynow = createPaynowService();
```

### Create a Payment

```typescript
import { PaynowService } from "@cvt/payments";

const response = await paynow.createPayment({
  reference: "payment-123",
  amount: 50.00,  // In dollars
  email: "customer@example.com",
  method: "PAYNOW_ECOCASH",
  phone: "0771234567",
});

if (response.success) {
  // Redirect to response.redirectUrl
}
```

### Check Payment Status

```typescript
const status = await paynow.checkStatus(pollUrl);

if (PaynowService.isSuccessStatus(status.status)) {
  // Payment successful
}
```

### High-Level Payment Service

```typescript
import { createPaymentService } from "@cvt/payments";

const paymentService = createPaymentService();

// Initiate payment for an invoice
const { paymentId, response } = await paymentService.initiatePayment(
  invoiceId,
  "PAYNOW_ECOCASH",
  "0771234567"
);

// Reconcile pending payments
const pendingPayments = await paymentService.getPendingPayments();
for (const payment of pendingPayments) {
  await paymentService.reconcilePayment(payment.id);
}
```

### Webhook Verification

```typescript
import { verifyPaynowHash } from "@cvt/payments";

const isValid = verifyPaynowHash(webhookPayload, integrationKey);
```

## Supported Payment Methods

| Method | Description |
|--------|-------------|
| `PAYNOW_ECOCASH` | EcoCash mobile money |
| `PAYNOW_ONEMONEY` | OneMoney mobile money |
| `PAYNOW_INNBUCKS` | InnBucks wallet |
| `PAYNOW_VISA` | Visa card |
| `PAYNOW_MASTERCARD` | Mastercard |
| `BANK_TRANSFER` | Direct bank transfer |
| `CASH` | Cash payment |
| `CREDIT` | Account credit |

## Payment Statuses

| Status | Description |
|--------|-------------|
| `PENDING` | Payment initiated, awaiting confirmation |
| `PAID` | Payment successful |
| `FAILED` | Payment failed |
| `CANCELLED` | Payment cancelled |
