# Admin Dashboard

## Overview

The Admin Dashboard is the internal control panel for Christus Veritas Technologies staff. It provides complete oversight of all organizations, billing, payments, and system operations.

**Access:** Restricted to users with `isAdmin: true`.

---

## URL Structure

```
/admin                      # Admin dashboard
/admin/organizations        # All organizations
/admin/organizations/[id]   # Organization detail
/admin/billing              # Billing overview
/admin/billing/invoices     # All invoices
/admin/billing/payments     # All payments
/admin/billing/credits      # Credit management
/admin/services             # All services
/admin/usage                # Usage analytics
/admin/support              # All support tickets
/admin/audit-log            # System audit log
/admin/settings             # System settings
```

---

## Dashboard (`/admin`)

**Purpose:** High-level system overview and quick actions.

### Metrics Cards

| Metric | Description |
|--------|-------------|
| Total Organizations | Active client count |
| Active Services | Total active POS/services |
| Monthly Revenue | Current month's paid invoices |
| Outstanding Balance | Total unpaid invoices |
| Overdue Accounts | Accounts past due |
| Suspended Accounts | Currently suspended |

### Wireframe

```
┌─────────────────────────────────────────────────────────────────┐
│  [Logo]  CVT Admin                               [Admin User ▼] │
├─────────────────────────────────────────────────────────────────┤
│ Dashboard │ Organizations │ Billing │ Support │ Audit │ Settings│
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐       │
│  │ Orgs      │ │ Services  │ │ Revenue   │ │ Outstanding│       │
│  │    47     │ │    123    │ │  $4,560   │ │   $840    │       │
│  └───────────┘ └───────────┘ └───────────┘ └───────────┘       │
│                                                                 │
│  ┌───────────┐ ┌───────────┐                                   │
│  │ Overdue   │ │ Suspended │                                   │
│  │     5     │ │     2     │                                   │
│  └───────────┘ └───────────┘                                   │
│                                                                 │
│  ┌─────────────────────────────┐ ┌─────────────────────────────┐│
│  │ Recent Activity             │ │ Requiring Attention         ││
│  │ ─────────────────────────── │ │ ─────────────────────────── ││
│  │ • Payment $60 - ABC Ltd     │ │ • ABC Store - Overdue 14d   ││
│  │ • New org - XYZ Retail      │ │ • XYZ Shop - Overdue 7d     ││
│  │ • Invoice issued - DEF Co   │ │ • Ticket #123 - Unassigned  ││
│  │ • Service activated         │ │ • DEF Ltd - Suspended       ││
│  └─────────────────────────────┘ └─────────────────────────────┘│
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Organizations Management

### Organizations List (`/admin/organizations`)

**Features:**
- Search by name, email, slug
- Filter by billing status
- Sort by name, created date, balance
- Quick actions (view, suspend, reactivate)

**Columns:**
| Column | Description |
|--------|-------------|
| Name | Organization name |
| Email | Primary contact |
| Services | Active service count |
| Balance | Outstanding amount |
| Status | Billing account status |
| Created | Registration date |
| Actions | View, suspend, etc. |

### Organization Detail (`/admin/organizations/[id]`)

**Sections:**

1. **Overview**
   - Organization info
   - Billing account status
   - Quick actions

2. **Billing**
   - All invoices
   - Payment history
   - Credits issued
   - Balance adjustments

3. **Services**
   - Active services
   - Service history
   - Add/remove services

4. **Members**
   - Organization members
   - Role management

5. **API Keys**
   - All API keys
   - Usage statistics
   - Revoke access

6. **Activity**
   - Audit log filtered to organization

**Wireframe:**
```
┌─────────────────────────────────────────────────────────────────┐
│  ← Organizations    ABC Retailers                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────────────────┐  ┌───────────────────────┐│
│  │ Organization Details             │  │ Quick Actions         ││
│  │ ──────────────────────────────── │  │ ───────────────────── ││
│  │ Name: ABC Retailers              │  │ [Issue Credit]        ││
│  │ Email: abc@example.com           │  │ [Create Invoice]      ││
│  │ Phone: +263 77 123 4567          │  │ [Add Service]         ││
│  │ Address: 123 Main St, Harare     │  │ [Suspend Account]     ││
│  │ Created: Oct 1, 2025             │  │ [View as Client]      ││
│  └──────────────────────────────────┘  └───────────────────────┘│
│                                                                 │
│  ┌──────────────────────────────────────────────────────────────│
│  │ Billing Account                                              │
│  │ ────────────────                                             │
│  │ Status: ⬤ ACTIVE                                             │
│  │ Balance: $0.00                                               │
│  │ Outstanding: $60.00 (1 invoice)                              │
│  │ Last Payment: Jan 5, 2026 - $60.00                           │
│  └──────────────────────────────────────────────────────────────│
│                                                                 │
│  [Overview] [Billing] [Services] [Members] [API Keys] [Activity]│
│  ────────────────────────────────────────────────────────────── │
│                                                                 │
│  Invoices                                                       │
│  ┌──────────────────────────────────────────────────────────────│
│  │ Invoice       │ Date    │ Amount  │ Due     │ Status        │
│  │ INV-2026-001  │ Jan 1   │ $60.00  │ Jan 15  │ ISSUED        │
│  │ INV-2025-012  │ Dec 1   │ $60.00  │ Dec 15  │ PAID          │
│  └──────────────────────────────────────────────────────────────│
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Billing Management

### Invoices (`/admin/billing/invoices`)

**Features:**
- Filter by status, date range, organization
- Search by invoice number
- Bulk actions (void, send reminder)
- Export to CSV

**Actions per Invoice:**
- View details
- Download PDF
- Send reminder email
- Void invoice
- Record manual payment

### Payments (`/admin/billing/payments`)

**Features:**
- Filter by status, method, date range
- Search by reference
- Reconciliation view for pending payments

**Manual Payment Recording:**
```
┌────────────────────────────────────────────────┐
│  Record Manual Payment                      ✕  │
├────────────────────────────────────────────────┤
│                                                │
│  Organization                                  │
│  [ABC Retailers                         ▼]     │
│                                                │
│  Invoice                                       │
│  [INV-2026-001234 - $60.00              ▼]     │
│                                                │
│  Amount                                        │
│  [$60.00                                ]      │
│                                                │
│  Payment Method                                │
│  [Bank Transfer                         ▼]     │
│                                                │
│  Reference/Notes                               │
│  [Bank ref: TRN123456789                ]      │
│                                                │
│  [Cancel]                  [Record Payment]    │
│                                                │
└────────────────────────────────────────────────┘
```

### Credits (`/admin/billing/credits`)

**Features:**
- View all issued credits
- Issue new credit
- Credit history by organization

**Issue Credit Modal:**
```
┌────────────────────────────────────────────────┐
│  Issue Credit                               ✕  │
├────────────────────────────────────────────────┤
│                                                │
│  Organization                                  │
│  [ABC Retailers                         ▼]     │
│                                                │
│  Amount                                        │
│  [$20.00                                ]      │
│                                                │
│  Reason                                        │
│  [Service interruption compensation     ]      │
│  [                                      ]      │
│                                                │
│  ⚠️ This will add $20.00 to the account      │
│     balance, which will be applied to the      │
│     next invoice.                              │
│                                                │
│  [Cancel]                     [Issue Credit]   │
│                                                │
└────────────────────────────────────────────────┘
```

---

## Account Status Management

### Suspend Account

```typescript
interface SuspendAccountAction {
  organizationId: string;
  reason: string;
  notifyClient: boolean; // Send suspension email
}
```

**Suspension Effects:**
- Sets billing account to `SUSPENDED`
- API keys return 403 Forbidden
- Client sees suspension notice in portal
- Email notification sent

### Reactivate Account

```typescript
interface ReactivateAccountAction {
  organizationId: string;
  requireFullPayment: boolean;
  notes: string;
}
```

**Reactivation Flow:**
1. Admin confirms reactivation
2. System checks for outstanding balance
3. If `requireFullPayment`, client must pay first
4. Otherwise, admin can override
5. Status changes to `ACTIVE`
6. Services resume immediately
7. Confirmation email sent

---

## Support Ticket Management

### All Tickets (`/admin/support`)

**Features:**
- Filter by status, priority, assignee
- Search by subject, organization
- Assign to admin
- Bulk status updates

**Columns:**
| Column | Description |
|--------|-------------|
| ID | Ticket reference |
| Subject | Issue summary |
| Organization | Client organization |
| Priority | Low/Normal/High/Urgent |
| Status | Open/In Progress/etc. |
| Assigned | Staff member |
| Updated | Last activity |

### Ticket Detail

**Features:**
- Full message thread
- Internal notes (not visible to client)
- Change status/priority
- Assign/reassign
- Related organization link

---

## Audit Log (`/admin/audit-log`)

**Purpose:** Complete system activity log for compliance and debugging.

**Features:**
- Filter by action type, actor, entity
- Date range selector
- Search by entity ID
- Export for compliance

**Log Entry Display:**
```
┌─────────────────────────────────────────────────────────────────┐
│  Audit Log                                      [Export CSV]    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Filters: [Actor ▼] [Action ▼] [Entity ▼] [Date Range]         │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────────│
│  │ Timestamp           │ Actor      │ Action          │ Entity │
│  │ ────────────────────────────────────────────────────────────│
│  │ Jan 12, 10:45:23    │ admin@cvt  │ credit.issued   │ Credit │
│  │ Jan 12, 10:30:15    │ System     │ invoice.issued  │ Invoice│
│  │ Jan 12, 09:15:00    │ john@abc   │ payment.init    │ Payment│
│  │ Jan 12, 08:00:00    │ System     │ status.updated  │ Account│
│  └──────────────────────────────────────────────────────────────│
│                                                                 │
│  [◀ Previous]                               [Next ▶]            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Usage Analytics (`/admin/usage`)

**Purpose:** View usage events for metered billing (future).

**Features:**
- Usage by organization
- Usage by event type
- Time-series charts
- Export for analysis

**Metrics:**
- API calls per organization
- POS transactions
- Peak usage times
- Rate limit hits

---

## System Settings (`/admin/settings`)

**Sections:**

### Billing Settings
- Default grace period (days)
- Suspension threshold (days)
- Tax rate
- Invoice numbering format

### Notification Settings
- Email templates
- Reminder schedule
- System email addresses

### Security Settings
- Session timeout
- Rate limit defaults
- API key defaults

---

## Admin API Endpoints

### Organizations

```
GET    /admin/organizations
POST   /admin/organizations              # Create new org
GET    /admin/organizations/:id
PATCH  /admin/organizations/:id
POST   /admin/organizations/:id/suspend
POST   /admin/organizations/:id/reactivate
```

### Billing

```
GET    /admin/billing/overview           # Dashboard stats
GET    /admin/billing/invoices
POST   /admin/billing/invoices           # Create ad-hoc invoice
POST   /admin/billing/invoices/:id/void
POST   /admin/billing/invoices/:id/send-reminder

GET    /admin/billing/payments
POST   /admin/billing/payments/manual    # Record manual payment

GET    /admin/billing/credits
POST   /admin/billing/credits            # Issue credit
```

### Reports

```
GET    /admin/reports/revenue
GET    /admin/reports/outstanding
GET    /admin/reports/aging
GET    /admin/reports/usage
```

### Audit

```
GET    /admin/audit-log
GET    /admin/audit-log/export
```

---

## Access Control

### Admin Guard

```typescript
// NestJS Guard
@Injectable()
export class AdminGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    
    if (!user?.isAdmin) {
      throw new ForbiddenException('Admin access required');
    }
    
    return true;
  }
}

// Usage
@Controller('admin')
@UseGuards(AuthGuard, AdminGuard)
export class AdminController {
  // ...
}
```

### Next.js Middleware

```typescript
// middleware.ts
if (pathname.startsWith('/admin')) {
  if (!session?.user.isAdmin) {
    return NextResponse.redirect(new URL('/', request.url));
  }
}
```

---

## Audit Logging

All admin actions are logged:

```typescript
@Injectable()
export class AdminActionInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    
    return next.handle().pipe(
      tap(async (response) => {
        await this.auditLog.create({
          actorId: request.user.id,
          actorType: 'admin',
          action: `admin.${request.method}.${request.route.path}`,
          entityType: this.extractEntityType(request),
          entityId: response?.id || request.params?.id,
          metadata: {
            requestBody: this.sanitize(request.body),
          },
          ipAddress: request.ip,
          userAgent: request.headers['user-agent'],
        });
      }),
    );
  }
}
```

---

## Data Export

### CSV Export

```typescript
export class ExportService {
  async exportInvoices(filters: InvoiceFilters): Promise<Buffer> {
    const invoices = await this.prisma.invoice.findMany({
      where: this.buildWhere(filters),
      include: {
        billingAccount: {
          include: { organization: true },
        },
      },
    });
    
    const csv = this.generateCsv(invoices, [
      'invoiceNumber',
      'organization.name',
      'issuedAt',
      'dueAt',
      'total',
      'amountPaid',
      'status',
    ]);
    
    return Buffer.from(csv);
  }
}
```

---

## Next: [Integrations](./08-integrations.md)
