# Database Schema Design

## Overview

This document defines the complete Prisma schema for the Christus Veritas Technologies ERP. The schema is designed to support:

- Multi-tenant organizations
- Immutable billing records
- Usage-based metering
- Role-based access control
- Full audit trails

---

## Database: PostgreSQL

PostgreSQL is chosen for:
- ACID compliance
- JSON support for flexible metadata
- Robust date/time handling
- Scalability
- Prisma compatibility

---

## Schema Definition

```prisma
// packages/db/prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============================================
// ORGANIZATIONS
// ============================================

model Organization {
  id          String   @id @default(cuid())
  name        String
  slug        String   @unique
  email       String   // Primary contact email
  phone       String?
  address     String?
  city        String?
  country     String   @default("Zimbabwe")
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  // Relations
  members         OrganizationMember[]
  billingAccount  BillingAccount?
  services        Service[]
  apiKeys         ApiKey[]
  usageEvents     UsageEvent[]
  supportTickets  SupportTicket[]
  
  @@index([slug])
  @@index([email])
}

// ============================================
// USERS & MEMBERSHIP
// ============================================

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  emailVerified DateTime?
  image         String?
  
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  // Relations
  memberships   OrganizationMember[]
  sessions      Session[]
  accounts      Account[]
  
  // Admin flag for CVT internal staff
  isAdmin       Boolean   @default(false)
  
  @@index([email])
}

model OrganizationMember {
  id             String       @id @default(cuid())
  organizationId String
  userId         String
  role           MemberRole   @default(MEMBER)
  
  createdAt      DateTime     @default(now())
  updatedAt      DateTime     @updatedAt
  
  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  user           User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@unique([organizationId, userId])
  @@index([organizationId])
  @@index([userId])
}

enum MemberRole {
  OWNER       // Full control, can delete organization
  ADMIN       // Can manage billing, services, members
  MEMBER      // Can view and use services
  BILLING     // Can only view/pay invoices
}

// ============================================
// AUTHENTICATION (better-auth compatible)
// ============================================

model Session {
  id           String   @id @default(cuid())
  userId       String
  token        String   @unique
  expiresAt    DateTime
  ipAddress    String?
  userAgent    String?
  
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@index([userId])
  @@index([token])
}

model Account {
  id                String   @id @default(cuid())
  userId            String
  accountId         String
  providerId        String
  accessToken       String?
  refreshToken      String?
  accessTokenExpiresAt  DateTime?
  refreshTokenExpiresAt DateTime?
  scope             String?
  idToken           String?
  password          String?
  
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  user              User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@unique([providerId, accountId])
  @@index([userId])
}

model Verification {
  id         String   @id @default(cuid())
  identifier String
  value      String
  expiresAt  DateTime
  
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
  
  @@index([identifier])
}

// ============================================
// BILLING
// ============================================

model BillingAccount {
  id             String              @id @default(cuid())
  organizationId String              @unique
  status         BillingAccountStatus @default(ACTIVE)
  
  // Grace period settings
  gracePeriodDays Int                @default(14)
  
  // Balance tracking
  balance        Decimal             @default(0) @db.Decimal(10, 2) // Positive = credit, Negative = owed
  
  createdAt      DateTime            @default(now())
  updatedAt      DateTime            @updatedAt
  
  organization   Organization        @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  invoices       Invoice[]
  payments       Payment[]
  credits        Credit[]
  
  @@index([organizationId])
  @@index([status])
}

enum BillingAccountStatus {
  ACTIVE     // Good standing
  OVERDUE    // Payment past due, within grace period
  SUSPENDED  // Services suspended due to non-payment
}

model Invoice {
  id               String        @id @default(cuid())
  billingAccountId String
  invoiceNumber    String        @unique // e.g., INV-2026-001234
  
  // Billing period
  periodStart      DateTime
  periodEnd        DateTime
  
  // Amounts (all in USD cents for precision)
  subtotal         Int           // Sum of line items
  tax              Int           @default(0)
  total            Int           // subtotal + tax
  amountPaid       Int           @default(0)
  amountDue        Int           // total - amountPaid
  
  // Status
  status           InvoiceStatus @default(DRAFT)
  
  // Dates
  issuedAt         DateTime?
  dueAt            DateTime?
  paidAt           DateTime?
  
  // Payment link
  paymentToken     String?       @unique // Secure token for payment link
  paymentTokenExpiresAt DateTime?
  
  // Immutability
  finalizedAt      DateTime?     // Once set, invoice cannot be modified
  
  createdAt        DateTime      @default(now())
  updatedAt        DateTime      @updatedAt
  
  billingAccount   BillingAccount @relation(fields: [billingAccountId], references: [id], onDelete: Cascade)
  lineItems        InvoiceLineItem[]
  payments         Payment[]
  
  @@index([billingAccountId])
  @@index([invoiceNumber])
  @@index([status])
  @@index([paymentToken])
}

enum InvoiceStatus {
  DRAFT      // Being prepared
  ISSUED     // Sent to client
  PAID       // Fully paid
  PARTIAL    // Partially paid
  OVERDUE    // Past due date
  VOID       // Cancelled/voided
}

model InvoiceLineItem {
  id          String   @id @default(cuid())
  invoiceId   String
  
  description String
  quantity    Int      @default(1)
  unitPrice   Int      // In cents
  total       Int      // quantity * unitPrice
  
  // Reference to service if applicable
  serviceId   String?
  
  createdAt   DateTime @default(now())
  
  invoice     Invoice  @relation(fields: [invoiceId], references: [id], onDelete: Cascade)
  service     Service? @relation(fields: [serviceId], references: [id])
  
  @@index([invoiceId])
  @@index([serviceId])
}

model Payment {
  id               String        @id @default(cuid())
  billingAccountId String
  invoiceId        String?
  
  amount           Int           // In cents
  currency         String        @default("USD")
  
  // Payment method
  method           PaymentMethod
  
  // Status
  status           PaymentStatus @default(PENDING)
  
  // External reference (Paynow)
  externalId       String?       // Paynow poll URL or reference
  externalStatus   String?       // Raw status from payment provider
  
  // Timestamps
  initiatedAt      DateTime      @default(now())
  completedAt      DateTime?
  failedAt         DateTime?
  
  // Error tracking
  errorMessage     String?
  
  createdAt        DateTime      @default(now())
  updatedAt        DateTime      @updatedAt
  
  billingAccount   BillingAccount @relation(fields: [billingAccountId], references: [id], onDelete: Cascade)
  invoice          Invoice?       @relation(fields: [invoiceId], references: [id])
  
  @@index([billingAccountId])
  @@index([invoiceId])
  @@index([status])
  @@index([externalId])
}

enum PaymentMethod {
  PAYNOW_ECOCASH
  PAYNOW_ONEMONEY
  PAYNOW_INNBUCKS
  PAYNOW_VISA
  PAYNOW_MASTERCARD
  BANK_TRANSFER
  CASH
  CREDIT      // Applied from credit balance
}

enum PaymentStatus {
  PENDING     // Awaiting confirmation
  PAID        // Successfully completed
  FAILED      // Payment failed
  CANCELLED   // Cancelled by user or system
}

model Credit {
  id               String         @id @default(cuid())
  billingAccountId String
  
  amount           Int            // In cents
  reason           String         // Why credit was issued
  
  // Admin who issued the credit
  issuedById       String?
  
  createdAt        DateTime       @default(now())
  
  billingAccount   BillingAccount @relation(fields: [billingAccountId], references: [id], onDelete: Cascade)
  
  @@index([billingAccountId])
}

// ============================================
// SERVICES
// ============================================

model Service {
  id             String          @id @default(cuid())
  organizationId String
  
  type           ServiceType
  name           String          // e.g., "POS Terminal #1"
  
  // Hardware reference if applicable
  hardwareSerial String?
  
  // Pricing
  monthlyFee     Int             // In cents
  
  // Status
  status         ServiceStatus   @default(ACTIVE)
  
  // Dates
  activatedAt    DateTime        @default(now())
  suspendedAt    DateTime?
  cancelledAt    DateTime?
  
  createdAt      DateTime        @default(now())
  updatedAt      DateTime        @updatedAt
  
  organization   Organization    @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  lineItems      InvoiceLineItem[]
  
  @@index([organizationId])
  @@index([type])
  @@index([status])
  @@index([hardwareSerial])
}

enum ServiceType {
  POS_TERMINAL
  POS_MAINTENANCE
  FUTURE_PRODUCT  // Placeholder for future services
}

enum ServiceStatus {
  ACTIVE
  SUSPENDED
  CANCELLED
}

// ============================================
// API KEYS
// ============================================

model ApiKey {
  id             String       @id @default(cuid())
  organizationId String
  
  name           String       // Descriptive name
  keyHash        String       @unique // Hashed API key (never store plain)
  keyPrefix      String       // First 8 chars for identification
  
  // Permissions
  scopes         String[]     // e.g., ["pos:read", "pos:write"]
  
  // Status
  isActive       Boolean      @default(true)
  
  // Rate limiting
  rateLimit      Int          @default(1000) // Requests per hour
  
  // Expiration
  expiresAt      DateTime?
  
  // Last used
  lastUsedAt     DateTime?
  
  createdAt      DateTime     @default(now())
  updatedAt      DateTime     @updatedAt
  
  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  usageEvents    UsageEvent[]
  
  @@index([organizationId])
  @@index([keyPrefix])
  @@index([isActive])
}

// ============================================
// USAGE EVENTS (for metered billing)
// ============================================

model UsageEvent {
  id             String       @id @default(cuid())
  organizationId String
  apiKeyId       String?
  
  eventType      String       // e.g., "pos.transaction", "api.call"
  eventData      Json?        // Flexible metadata
  
  // For metering
  quantity       Int          @default(1)
  
  timestamp      DateTime     @default(now())
  
  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  apiKey         ApiKey?      @relation(fields: [apiKeyId], references: [id])
  
  @@index([organizationId])
  @@index([apiKeyId])
  @@index([eventType])
  @@index([timestamp])
}

// ============================================
// SUPPORT
// ============================================

model SupportTicket {
  id             String              @id @default(cuid())
  organizationId String
  
  subject        String
  description    String
  
  status         SupportTicketStatus @default(OPEN)
  priority       SupportPriority     @default(NORMAL)
  
  // Assigned CVT staff
  assignedToId   String?
  
  createdAt      DateTime            @default(now())
  updatedAt      DateTime            @updatedAt
  resolvedAt     DateTime?
  
  organization   Organization        @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  messages       SupportMessage[]
  
  @@index([organizationId])
  @@index([status])
  @@index([assignedToId])
}

enum SupportTicketStatus {
  OPEN
  IN_PROGRESS
  WAITING_ON_CLIENT
  RESOLVED
  CLOSED
}

enum SupportPriority {
  LOW
  NORMAL
  HIGH
  URGENT
}

model SupportMessage {
  id        String   @id @default(cuid())
  ticketId  String
  
  senderId  String   // User ID
  message   String
  
  isInternal Boolean @default(false) // Internal notes not visible to client
  
  createdAt DateTime @default(now())
  
  ticket    SupportTicket @relation(fields: [ticketId], references: [id], onDelete: Cascade)
  
  @@index([ticketId])
  @@index([senderId])
}

// ============================================
// AUDIT LOG
// ============================================

model AuditLog {
  id          String   @id @default(cuid())
  
  actorId     String?  // User who performed action (null for system)
  actorType   String   // "user", "system", "api_key"
  
  action      String   // e.g., "invoice.created", "payment.received"
  entityType  String   // e.g., "Invoice", "Payment"
  entityId    String   // ID of affected entity
  
  metadata    Json?    // Additional context
  
  ipAddress   String?
  userAgent   String?
  
  timestamp   DateTime @default(now())
  
  @@index([actorId])
  @@index([action])
  @@index([entityType, entityId])
  @@index([timestamp])
}

// ============================================
// EMAIL NOTIFICATIONS
// ============================================

model EmailLog {
  id          String      @id @default(cuid())
  
  to          String
  subject     String
  template    String      // Template name
  
  status      EmailStatus @default(QUEUED)
  
  // Reference
  entityType  String?     // e.g., "Invoice"
  entityId    String?
  
  sentAt      DateTime?
  failedAt    DateTime?
  errorMessage String?
  
  createdAt   DateTime    @default(now())
  
  @@index([to])
  @@index([status])
  @@index([entityType, entityId])
}

enum EmailStatus {
  QUEUED
  SENT
  FAILED
}

// ============================================
// SYSTEM SETTINGS
// ============================================

model SystemSetting {
  id    String @id @default(cuid())
  key   String @unique
  value String
  
  updatedAt DateTime @updatedAt
  
  @@index([key])
}
```

---

## Entity Relationship Diagram

```
┌─────────────────┐
│      User       │
└────────┬────────┘
         │ 1:N
         ▼
┌─────────────────────┐
│ OrganizationMember  │
└─────────┬───────────┘
          │ N:1
          ▼
┌─────────────────┐     1:1    ┌──────────────────┐
│  Organization   │───────────▶│  BillingAccount  │
└────────┬────────┘            └────────┬─────────┘
         │                              │
         │ 1:N                          │ 1:N
         ▼                              ▼
    ┌─────────┐                   ┌───────────┐
    │ Service │                   │  Invoice  │
    └─────────┘                   └─────┬─────┘
         │                              │
         │                              │ 1:N
         │                              ▼
         │                        ┌───────────┐
         │                        │  Payment  │
         │                        └───────────┘
         │ 1:N
         ▼
    ┌─────────┐
    │ ApiKey  │
    └────┬────┘
         │ 1:N
         ▼
┌─────────────────┐
│   UsageEvent    │
└─────────────────┘
```

---

## Key Design Decisions

### 1. Money in Cents
All monetary values stored in cents (integers) to avoid floating-point precision issues.

### 2. Invoice Immutability
Once `finalizedAt` is set, the invoice record cannot be modified. Adjustments create credit records.

### 3. Soft Deletes Not Used
We use status fields instead of soft deletes for cleaner queries. Cancelled/void records maintain their history.

### 4. CUID IDs
Using CUIDs instead of UUIDs for:
- Shorter URLs
- Sortable by creation time
- Better indexing performance

### 5. Flexible JSON Fields
`eventData` and `metadata` fields allow storing additional context without schema changes.

### 6. Audit Everything
`AuditLog` captures all significant actions for compliance and debugging.

---

## Indexes

All foreign keys are indexed. Additional indexes on:
- Frequently queried fields (status, email, slug)
- Timestamp fields for range queries
- Unique business identifiers (invoiceNumber, keyPrefix)

---

## Migration Strategy

1. **Initial Migration**: Create all tables
2. **Seed Data**: Default system settings, admin user
3. **Future Migrations**: Additive changes only where possible

---

## Package Structure

```
packages/db/
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── src/
│   ├── index.ts       # Re-export Prisma client
│   └── types.ts       # Additional type definitions
├── package.json
└── tsconfig.json
```

---

## Next: [Authentication System](./03-authentication.md)
