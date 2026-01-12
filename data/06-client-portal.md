# Client Portal

## Overview

The Client Portal is the authenticated area of the web application (`apps/web`) where organization members can manage their account, view billing, access services, and get support.

---

## URL Structure

```
/                           # Landing page (public)
/about                      # About page (public)
/contact                    # Contact page (public)
/login                      # Login page (public)
/register                   # Registration (invite-only)

/clients                    # Client dashboard selector
/clients/[orgSlug]          # Organization dashboard
/clients/[orgSlug]/billing  # Billing & invoices
/clients/[orgSlug]/services # Active services
/clients/[orgSlug]/api-keys # API key management
/clients/[orgSlug]/support  # Support tickets
/clients/[orgSlug]/settings # Organization settings
/clients/[orgSlug]/members  # Team members

/pay/[token]                # Public payment page (invoice link)
```

---

## Page Specifications

### 1. Dashboard (`/clients/[orgSlug]`)

**Purpose:** Organization overview and quick actions.

**Components:**
- Account status banner (active/overdue/suspended)
- Quick stats cards
- Recent activity feed
- Outstanding invoice alert
- Quick action buttons

**Data Requirements:**
```typescript
interface DashboardData {
  organization: Organization;
  billingStatus: BillingAccountStatus;
  stats: {
    activeServices: number;
    outstandingBalance: number;
    lastPayment: Payment | null;
  };
  recentActivity: AuditLog[];
  pendingInvoices: Invoice[];
}
```

**Wireframe:**
```
┌─────────────────────────────────────────────────────────────────┐
│  [Logo]  Christus Veritas Technologies     [Org Name ▼] [User ▼]│
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ ⚠️ You have an outstanding invoice of $XX.XX  [Pay Now]     ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐│
│  │ Active      │ │ Outstanding │ │ Last        │ │ Account     ││
│  │ Services    │ │ Balance     │ │ Payment     │ │ Status      ││
│  │     3       │ │   $60.00    │ │  Jan 5      │ │   ACTIVE    ││
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘│
│                                                                 │
│  Recent Activity                                                │
│  ├─ Invoice #INV-2026-001234 issued                  Jan 1     │
│  ├─ Payment $60.00 received                          Dec 5     │
│  ├─ API Key created: POS Terminal #1                 Nov 15    │
│  └─ Organization created                             Oct 1     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

### 2. Billing (`/clients/[orgSlug]/billing`)

**Purpose:** View invoices, make payments, see payment history.

**Tabs:**
- Invoices (default)
- Payments
- Statement

**Components:**
- Invoice list with filters
- Invoice detail modal
- Payment button
- PDF download
- Payment history table

**Invoice List:**
```typescript
interface InvoiceListItem {
  id: string;
  invoiceNumber: string;
  issuedAt: Date;
  dueAt: Date;
  total: number;
  amountDue: number;
  status: InvoiceStatus;
}
```

**Wireframe:**
```
┌─────────────────────────────────────────────────────────────────┐
│  Billing                                                        │
├─────────────────────────────────────────────────────────────────┤
│  [Invoices]  [Payments]  [Statement]                            │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ Invoice #      │ Date     │ Due Date │ Amount  │ Status    ││
│  ├────────────────┼──────────┼──────────┼─────────┼───────────┤│
│  │ INV-2026-001   │ Jan 1    │ Jan 15   │ $60.00  │ ⬤ ISSUED  ││
│  │ INV-2025-012   │ Dec 1    │ Dec 15   │ $60.00  │ ⬤ PAID    ││
│  │ INV-2025-011   │ Nov 1    │ Nov 15   │ $60.00  │ ⬤ PAID    ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  [◀ Previous]                               [Next ▶]            │
└─────────────────────────────────────────────────────────────────┘
```

**Invoice Detail Modal:**
```
┌────────────────────────────────────────────────┐
│  Invoice INV-2026-001234                    ✕  │
├────────────────────────────────────────────────┤
│                                                │
│  Issued: January 1, 2026                       │
│  Due: January 15, 2026                         │
│  Status: ISSUED                                │
│                                                │
│  ─────────────────────────────────────────     │
│  Description                      Amount       │
│  ─────────────────────────────────────────     │
│  POS Terminal #1 - Monthly Fee    $20.00       │
│  POS Terminal #2 - Monthly Fee    $20.00       │
│  Maintenance - January 2026       $20.00       │
│  ─────────────────────────────────────────     │
│  Subtotal                         $60.00       │
│  Tax                              $0.00        │
│  Total                            $60.00       │
│                                                │
│  [Download PDF]     [Pay Now - $60.00]         │
│                                                │
└────────────────────────────────────────────────┘
```

---

### 3. Services (`/clients/[orgSlug]/services`)

**Purpose:** View active services and hardware.

**Components:**
- Service cards with status
- Service detail view
- Hardware serial numbers

**Service Card:**
```typescript
interface ServiceDisplay {
  id: string;
  name: string;
  type: ServiceType;
  status: ServiceStatus;
  monthlyFee: number;
  hardwareSerial?: string;
  activatedAt: Date;
}
```

**Wireframe:**
```
┌─────────────────────────────────────────────────────────────────┐
│  Services                                                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────┐ ┌─────────────────────────┐       │
│  │ POS Terminal #1         │ │ POS Terminal #2         │       │
│  │ ─────────────────────── │ │ ─────────────────────── │       │
│  │ Type: POS Terminal      │ │ Type: POS Terminal      │       │
│  │ Serial: CVT-POS-001234  │ │ Serial: CVT-POS-001235  │       │
│  │ Monthly: $20.00         │ │ Monthly: $20.00         │       │
│  │ Status: ⬤ ACTIVE        │ │ Status: ⬤ ACTIVE        │       │
│  │ Since: Oct 1, 2025      │ │ Since: Nov 15, 2025     │       │
│  │                         │ │                         │       │
│  │ [View Details]          │ │ [View Details]          │       │
│  └─────────────────────────┘ └─────────────────────────┘       │
│                                                                 │
│  ┌─────────────────────────┐                                   │
│  │ Maintenance Plan        │                                   │
│  │ ─────────────────────── │                                   │
│  │ Type: Maintenance       │                                   │
│  │ Monthly: $20.00         │                                   │
│  │ Status: ⬤ ACTIVE        │                                   │
│  │ Since: Oct 1, 2025      │                                   │
│  └─────────────────────────┘                                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

### 4. API Keys (`/clients/[orgSlug]/api-keys`)

**Purpose:** Manage API keys for POS systems.

**Components:**
- API key list
- Create key modal
- Key details (scopes, last used)
- Revoke confirmation

**Permissions Required:** `api-keys:read`, `api-keys:create`, `api-keys:revoke`

**Wireframe:**
```
┌─────────────────────────────────────────────────────────────────┐
│  API Keys                                    [+ Create Key]     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ Name          │ Key Prefix  │ Last Used    │ Actions       ││
│  ├───────────────┼─────────────┼──────────────┼───────────────┤│
│  │ POS Terminal 1│ cvt_Hx7k... │ 5 mins ago   │ [Revoke]      ││
│  │ POS Terminal 2│ cvt_9mPq... │ 2 hours ago  │ [Revoke]      ││
│  │ Test Key      │ cvt_test... │ Never        │ [Revoke]      ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  ⚠️ API keys are shown only once when created. Store them      │
│     securely.                                                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Create Key Modal:**
```
┌────────────────────────────────────────────────┐
│  Create API Key                             ✕  │
├────────────────────────────────────────────────┤
│                                                │
│  Name                                          │
│  [POS Terminal #3                       ]      │
│                                                │
│  Scopes                                        │
│  [✓] pos:read   - Read POS data               │
│  [✓] pos:write  - Create transactions         │
│  [ ] pos:void   - Void transactions           │
│  [✓] usage:write - Report usage events        │
│                                                │
│  Expiration (optional)                         │
│  [Never expires              ▼]                │
│                                                │
│  [Cancel]                    [Create Key]      │
│                                                │
└────────────────────────────────────────────────┘
```

**Key Created Modal:**
```
┌────────────────────────────────────────────────┐
│  API Key Created                            ✕  │
├────────────────────────────────────────────────┤
│                                                │
│  ⚠️ Copy this key now. You won't be able to   │
│     see it again!                              │
│                                                │
│  ┌────────────────────────────────────────────┐│
│  │ cvt_Hx7kLmNpQrStUvWxYz1234567890abcdef    ││
│  │                                    [Copy] ││
│  └────────────────────────────────────────────┘│
│                                                │
│  [I've copied the key]                         │
│                                                │
└────────────────────────────────────────────────┘
```

---

### 5. Support (`/clients/[orgSlug]/support`)

**Purpose:** Create and manage support tickets.

**Components:**
- Ticket list
- Create ticket form
- Ticket detail with messages

**Wireframe:**
```
┌─────────────────────────────────────────────────────────────────┐
│  Support                                   [+ New Ticket]       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ Subject                 │ Status      │ Priority │ Updated ││
│  ├─────────────────────────┼─────────────┼──────────┼─────────┤│
│  │ POS not connecting      │ In Progress │ High     │ 2h ago  ││
│  │ Receipt printer issue   │ Resolved    │ Normal   │ 3 days  ││
│  │ Account question        │ Closed      │ Low      │ 1 week  ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

### 6. Settings (`/clients/[orgSlug]/settings`)

**Purpose:** Manage organization settings.

**Sections:**
- Organization details
- Contact information
- Notification preferences

**Permissions Required:** `org:update`

---

### 7. Members (`/clients/[orgSlug]/members`)

**Purpose:** Manage organization members.

**Components:**
- Member list with roles
- Invite member modal
- Role change dropdown
- Remove member confirmation

**Permissions Required:** `members:read`, `members:invite`, `members:update-role`, `members:remove`

---

### 8. Payment Page (`/pay/[token]`)

**Purpose:** Public page for invoice payment via secure link.

**No authentication required** - token validates access.

**Components:**
- Invoice summary
- Payment method selector
- Payment button

**Wireframe:**
```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                   [CVT Logo]                                    │
│                                                                 │
│           ┌─────────────────────────────────────────┐           │
│           │        PAY INVOICE                      │           │
│           │                                         │           │
│           │  Invoice: INV-2026-001234              │           │
│           │  Organization: ABC Retailers           │           │
│           │  Amount Due: $60.00                    │           │
│           │                                         │           │
│           │  ─────────────────────────────────     │           │
│           │                                         │           │
│           │  Select Payment Method:                │           │
│           │                                         │           │
│           │  ○ EcoCash                             │           │
│           │  ○ OneMoney                            │           │
│           │  ○ InnBucks                            │           │
│           │  ○ Visa/Mastercard                     │           │
│           │                                         │           │
│           │  [Pay $60.00]                          │           │
│           │                                         │           │
│           │  ─────────────────────────────────     │           │
│           │  Powered by Paynow                     │           │
│           └─────────────────────────────────────────┘           │
│                                                                 │
│                   Christus Veritas Technologies                 │
│                      accounts@cvt.co.zw                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Component Library

### Shared Components (from `packages/ui`)

```
packages/ui/src/
├── button.tsx           # Primary, secondary, danger buttons
├── card.tsx             # Content cards
├── code.tsx             # Code display
├── badge.tsx            # Status badges
├── modal.tsx            # Modal dialogs
├── table.tsx            # Data tables
├── form/
│   ├── input.tsx
│   ├── select.tsx
│   ├── checkbox.tsx
│   └── form-field.tsx
├── layout/
│   ├── sidebar.tsx
│   ├── header.tsx
│   └── page-header.tsx
├── feedback/
│   ├── alert.tsx
│   ├── toast.tsx
│   └── loading.tsx
└── data-display/
    ├── stat-card.tsx
    ├── activity-feed.tsx
    └── empty-state.tsx
```

### Client Portal Specific Components

```
apps/web/app/clients/
├── components/
│   ├── org-switcher.tsx
│   ├── billing-status-banner.tsx
│   ├── invoice-list.tsx
│   ├── invoice-detail.tsx
│   ├── payment-method-selector.tsx
│   ├── service-card.tsx
│   ├── api-key-list.tsx
│   ├── support-ticket-list.tsx
│   └── member-list.tsx
└── layouts/
    ├── client-layout.tsx
    └── client-sidebar.tsx
```

---

## State Management

### Server Components (Default)
Most pages use React Server Components for data fetching.

### Client Components (When Needed)
- Forms
- Modals
- Interactive elements
- Real-time updates

### Data Fetching Pattern

```typescript
// app/clients/[orgSlug]/billing/page.tsx

import { getServerSession } from '@cvt/auth/server';
import { getInvoices } from '@/lib/api/billing';
import { InvoiceList } from './components/invoice-list';

export default async function BillingPage({
  params,
}: {
  params: { orgSlug: string };
}) {
  const session = await getServerSession();
  const invoices = await getInvoices(params.orgSlug);
  
  return (
    <div>
      <PageHeader title="Billing" />
      <InvoiceList invoices={invoices} />
    </div>
  );
}
```

---

## Access Control

### Route Protection

```typescript
// middleware.ts

import { authMiddleware } from '@cvt/auth/middleware/next';

export default authMiddleware;

export const config = {
  matcher: ['/clients/:path*', '/admin/:path*'],
};
```

### Permission Checks

```typescript
// lib/permissions.ts

import { hasPermission } from '@cvt/auth';

export function requirePermission(
  role: MemberRole,
  permission: Permission,
): boolean {
  if (!hasPermission(role, permission)) {
    throw new ForbiddenError('Insufficient permissions');
  }
  return true;
}
```

---

## Error Handling

### Error Boundaries

```typescript
// app/clients/[orgSlug]/error.tsx

'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="error-container">
      <h2>Something went wrong</h2>
      <p>{error.message}</p>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
```

### Not Found

```typescript
// app/clients/[orgSlug]/not-found.tsx

export default function NotFound() {
  return (
    <div className="not-found">
      <h2>Organization not found</h2>
      <p>You may not have access to this organization.</p>
      <Link href="/clients">Back to organizations</Link>
    </div>
  );
}
```

---

## Styling

### Design System

Following brand guidelines:
- **Primary:** Deep navy (#1e3a5f)
- **Secondary:** Charcoal gray (#374151)
- **Accent:** Muted gold (#d4a574)
- **Background:** White/Light gray
- **Typography:** Inter / IBM Plex Sans

### Tailwind Configuration

```javascript
// tailwind.config.js

module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#1e3a5f',
          charcoal: '#374151',
          gold: '#d4a574',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
};
```

---

## Next: [Admin Dashboard](./07-admin-dashboard.md)
