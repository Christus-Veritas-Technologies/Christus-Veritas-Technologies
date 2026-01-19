# Maintenance Tracking System

## Overview
The maintenance tracking system allows CVT to manage monthly maintenance contracts for completed projects. It provides separate interfaces for admins and clients, with support for cash and Paynow payments.

## Database Schema

### Maintenance Model
```prisma
model Maintenance {
  id          String   @id @default(cuid())
  projectId   String   @unique // One maintenance contract per project
  
  // Pricing
  monthlyFee  Int      // Monthly maintenance fee in cents
  
  // Status
  isActive    Boolean  @default(true)
  startDate   DateTime @default(now())
  endDate     DateTime? // Optional end date
  
  // Payment tracking for current month
  currentPeriodStart    DateTime
  currentPeriodEnd      DateTime
  isPaidForCurrentMonth Boolean  @default(false)
  paidInCash            Boolean  @default(false)
  cashConfirmed         Boolean  @default(false)
  cashConfirmedAt       DateTime?
  cashConfirmedBy       String?  // Admin user ID
  paidAt                DateTime?
  
  // Reminders
  lastReminderSent      DateTime?
  reminderCount         Int      @default(0)
  
  // Notes
  notes       String?  @db.Text
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  project     Project  @relation(fields: [projectId], references: [id], onDelete: Cascade)
}
```

## Backend API

### Admin Endpoints

#### GET `/api/maintenance/admin/all`
Get all maintenance contracts (active by default)
- Query: `?includeInactive=true` to include inactive contracts
- Returns: Array of maintenance contracts with project and user details

#### GET `/api/maintenance/admin/overdue`
Get all overdue maintenance contracts (unpaid and past due date)

#### GET `/api/maintenance/admin/due-soon`
Get maintenance contracts due within X days
- Query: `?days=7` (default: 7 days)

#### POST `/api/maintenance/admin/create`
Create or update maintenance contract
```json
{
  "projectId": "string",
  "monthlyFee": 2000,  // In cents
  "startDate": "2024-01-01T00:00:00Z"  // Optional
}
```

#### POST `/api/maintenance/admin/:id/confirm-cash`
Confirm cash payment received (admin only)
- Marks payment as confirmed and updates payment status

#### POST `/api/maintenance/admin/:id/advance-period`
Advance to next billing period
- Resets payment status for the new month
- Moves period dates forward by one month

#### POST `/api/maintenance/admin/:id/deactivate`
Deactivate maintenance contract
```json
{
  "endDate": "2024-12-31T00:00:00Z"  // Optional
}
```

#### PUT `/api/maintenance/admin/:id/notes`
Add or update notes
```json
{
  "notes": "Client requested pause until next quarter"
}
```

#### POST `/api/maintenance/admin/:id/reminder-sent`
Update reminder sent timestamp
- Increments reminder count
- Updates lastReminderSent timestamp

### Client Endpoints

#### GET `/api/maintenance/my-maintenance`
Get all active maintenance contracts for the logged-in user

#### POST `/api/maintenance/:id/pay-cash`
Mark payment as paid in cash
- Sets `paidInCash: true`
- Awaits admin confirmation

#### POST `/api/maintenance/:id/pay-paynow`
Mark payment as paid via Paynow
- Sets `isPaidForCurrentMonth: true`
- Immediate confirmation (no admin approval needed)

#### GET `/api/maintenance/:id`
Get single maintenance contract
- Accessible by admin or project owner only

## Frontend Pages

### Admin: `/admin/maintenance`

Features:
- **Filters**: Unpaid, Overdue, Due Soon, All Active
- **Create Maintenance**: Dialog to set up new contracts for completed projects
- **Payment Confirmation**: Confirm cash payments
- **Period Management**: Advance to next billing period after payment
- **Reminder Tracking**: Track and mark reminders as sent
- **Status Badges**:
  - ✅ Paid (green)
  - ⏳ Cash Pending (yellow)
  - ⚠️ Overdue (red)
  - 🕐 Due Soon (orange)
  - ○ Unpaid (outline)

### Client: `/dashboard/maintenance`

Features:
- **View Contracts**: See all active maintenance for user's projects
- **Payment Dialog**: Choose payment method (Cash or Paynow)
- **Status Tracking**: See payment status and confirmation state
- **Due Date Alerts**: Visual indicators for overdue and upcoming payments
- **Status Cards**:
  - ✅ Payment Received (green)
  - ⚠️ Payment Overdue (red)
  - ℹ️ Payment Pending (blue)

## Key Features

### Payment Workflow

1. **Client Payment Options**:
   - **Cash**: Client marks as paid in cash → Admin confirms → Payment complete
   - **Paynow**: Client marks as paid via Paynow → Instant confirmation

2. **Payment States**:
   - Unpaid: `isPaidForCurrentMonth: false`
   - Paid (Paynow): `isPaidForCurrentMonth: true, paidInCash: false`
   - Paid (Cash - Pending): `paidInCash: true, cashConfirmed: false`
   - Paid (Cash - Confirmed): `paidInCash: true, cashConfirmed: true, isPaidForCurrentMonth: true`

### Billing Periods

- Each maintenance contract has a current billing period (start/end dates)
- After payment is confirmed, admin can advance to the next period
- Advancing resets all payment flags and moves dates forward one month

### Status Indicators

The system automatically calculates status based on:
- Payment status (`isPaidForCurrentMonth`)
- Due date (`currentPeriodEnd`)
- Days until due
- Cash confirmation status

### Reminders

- Admin can manually mark reminders as sent
- System tracks:
  - Last reminder sent timestamp
  - Total reminder count
- **Future Enhancement**: Automated email reminders via cron job

## Usage Examples

### Setting Up Maintenance

1. Admin navigates to `/admin/maintenance`
2. Clicks "Add Maintenance"
3. Selects a completed project from dropdown
4. Enters monthly fee in dollars (e.g., "20.00")
5. System creates contract with:
   - Current period: Current month
   - Monthly fee: $20.00 (stored as 2000 cents)
   - Status: Unpaid

### Client Making Payment

1. Client navigates to `/dashboard/maintenance`
2. Sees active maintenance contracts
3. Clicks "Make Payment" on unpaid contract
4. Chooses payment method:
   - **Cash**: Marks as paid, status shows "Pending Confirmation"
   - **Paynow**: Marks as paid, status shows "Paid" immediately
5. Admin confirms cash payment if needed

### Admin Confirming Cash Payment

1. Admin sees maintenance with "Cash Pending" badge
2. Clicks "Confirm Cash" button
3. System updates:
   - `cashConfirmed: true`
   - `isPaidForCurrentMonth: true`
   - `paidAt: current timestamp`
   - `cashConfirmedBy: admin user ID`
4. Status changes to "Paid"

### Advancing to Next Period

1. After payment is confirmed
2. Admin clicks "Advance Period"
3. System:
   - Moves period dates forward one month
   - Resets all payment flags
   - Clears reminder counters
4. New billing period begins

## Data Flow

```
Client Dashboard → API → Controller → Service → Prisma → Database
                                               ↓
                                          Business Logic
                                               ↓
                                         Date Calculations
                                               ↓
                                         Status Updates
```

## Security

- **Authentication**: All endpoints require JWT authentication
- **Authorization**:
  - Admin endpoints: Role-based guard (`@Roles(Role.ADMIN)`)
  - Client endpoints: User can only access their own maintenance
  - Get single maintenance: Admin or project owner only

## Future Enhancements

1. **Automated Reminders**:
   - Cron job to send email reminders
   - Configurable reminder schedule (7 days before, on due date, after overdue)
   - Email templates with nodemailer

2. **Payment Integration**:
   - Direct Paynow payment flow
   - Payment status webhooks
   - Automatic confirmation upon successful payment

3. **Reporting**:
   - Monthly maintenance revenue reports
   - Payment collection rates
   - Overdue payment analytics

4. **Notifications**:
   - In-app notifications for clients
   - Admin dashboard alerts for overdue payments
   - SMS reminders (optional)

5. **History Tracking**:
   - Payment history per contract
   - Audit log for status changes
   - Historical billing periods

## Notes

- All prices stored in cents (100 cents = $1.00)
- Dates use ISO 8601 format
- One maintenance contract per project (enforced by unique constraint)
- Soft delete via `isActive` flag
- Use date-fns for all date operations
