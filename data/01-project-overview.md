# Christus Veritas Technologies – ERP System Overview

## Executive Summary

This document outlines the comprehensive architecture and implementation plan for the Christus Veritas Technologies Internal ERP system. The ERP serves as the **system of record** for all client, billing, service, and usage data—the operational backbone of the company.

---

## Project Structure

### Monorepo Architecture (Turborepo)

```
christusveritastechnologies/
├── apps/
│   ├── docs/          # Developer documentation (Next.js)
│   ├── web/           # Website + Client Portal (Next.js)
│   └── server/        # API Server (NestJS) [TO CREATE]
├── packages/
│   ├── db/            # Prisma database package [TO CREATE]
│   ├── auth/          # Authentication logic [TO CREATE]
│   ├── ui/            # Shared UI components
│   ├── eslint-config/ # Shared ESLint configuration
│   └── typescript-config/ # Shared TypeScript configuration
```

---

## Application Breakdown

### 1. `apps/web` – Website & Client Portal

**Purpose:** Public-facing website and authenticated client area.

**Structure:**
- `/` – Landing page (public)
- `/contact` – Contact page (public)
- `/about`, `/services`, etc. – Marketing pages (public)
- `/clients/*` – Client Portal (authenticated)
  - `/clients/dashboard` – Organization overview
  - `/clients/billing` – Invoices & payments
  - `/clients/services` – Active services
  - `/clients/support` – Support tickets
  - `/clients/settings` – Organization settings

### 2. `apps/server` – NestJS API Server

**Purpose:** Backend API handling all business logic.

**Responsibilities:**
- RESTful API endpoints
- Authentication middleware
- Billing logic & invoice generation
- Payment processing (Paynow integration)
- Email notifications (transactional)
- API key management
- Usage event logging
- Admin operations

### 3. `apps/docs` – Developer Documentation

**Purpose:** Future API documentation for external developers.

**Content:**
- API reference
- Authentication guides
- Webhook documentation
- SDK documentation (future)

### 4. `packages/db` – Prisma Database Package

**Purpose:** Centralized database schema and client.

**Contains:**
- Prisma schema definition
- Database migrations
- Prisma client generation
- Seed scripts
- Type exports

### 5. `packages/auth` – Authentication Package

**Purpose:** Shared authentication logic using better-auth.

**Contains:**
- Auth configuration
- Session management
- Role-based access control (RBAC)
- Organization membership
- API key authentication

---

## Core Domain Entities

### Organizations
The central entity. Every client is an Organization.
- Owns billing accounts
- Owns services (POS systems, future products)
- Owns API keys
- Has members (users with roles)

### Users
People who interact with the system.
- Belong to one or more organizations
- Have roles within organizations
- Managed via better-auth

### Billing Accounts
Financial record per organization.
- Status: `active`, `overdue`, `suspended`
- Linked to invoices and payments
- Determines service access

### Invoices
Immutable billing records.
- Generated monthly
- Deterministic and auditable
- Contains line items
- Has secure payment link

### Payments
Transaction records.
- Always tied to invoices
- States: `pending`, `paid`, `failed`
- Reconciled via Paynow callbacks

### Services
Products/services an organization subscribes to.
- POS systems (hardware-linked)
- Maintenance plans
- Future products

### API Keys
Machine authentication.
- Per-organization
- Scoped permissions
- Usage logging

### Usage Events
Audit trail for metered billing.
- Timestamped events
- Linked to API keys and organizations
- Enables usage-based pricing

---

## Key Design Principles

### 1. ERP is the Authority
- All billing logic lives in the ERP
- Payment gateways (Paynow) are integrations, not authorities
- No business logic in external dashboards

### 2. Immutable Records
- Invoices cannot be modified after issuance
- Adjustments create new records (credits, adjustments)
- Full audit trail

### 3. Deterministic Billing
- Monthly billing runs produce predictable results
- Same inputs = same outputs
- No hidden calculations

### 4. Graceful Enforcement
- Email-driven payment flow
- Grace periods before suspension
- Non-hostile, compliant approach

### 5. Future-Ready Architecture
- Usage event logging from day one
- API key infrastructure ready
- Extensible for new products

---

## Technology Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14+ (App Router) |
| UI Components | Shared `ui` package |
| API Server | NestJS |
| Database | PostgreSQL |
| ORM | Prisma |
| Authentication | better-auth |
| Email | Transactional email provider (TBD) |
| Payments | Paynow |
| Monorepo | Turborepo |
| Language | TypeScript |

---

## Brand Alignment

The system reflects the Christus Veritas Technologies brand:

- **Professional:** Clean, enterprise-grade interfaces
- **Reliable:** Robust error handling, audit trails
- **Transparent:** Clear billing, no hidden logic
- **Conservative:** No experimental features in production
- **Trustworthy:** Data integrity, security-first

---

## Next Steps

1. [Database Schema Design](./02-database-schema.md)
2. [Authentication System](./03-authentication.md)
3. [API Architecture](./04-api-architecture.md)
4. [Billing System](./05-billing-system.md)
5. [Client Portal](./06-client-portal.md)
6. [Admin Dashboard](./07-admin-dashboard.md)
7. [Integrations](./08-integrations.md)
8. [Implementation Roadmap](./09-implementation-roadmap.md)
