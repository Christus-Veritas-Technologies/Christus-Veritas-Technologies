# Authentication System

## Overview

This document details the authentication architecture for the Christus Veritas Technologies ERP, using **better-auth** as the authentication framework. The system supports:

- User authentication (email/password, OAuth)
- Organization-based multi-tenancy
- Role-based access control (RBAC)
- API key authentication for machine-to-machine communication
- Session management

---

## Why better-auth?

**better-auth** is chosen for:
- TypeScript-first design
- Built-in organization/team support
- Flexible session management
- Easy integration with Next.js and NestJS
- Database adapter support (Prisma)
- Plugin architecture for extensibility

---

## Authentication Flows

### 1. User Authentication (Web Portal)

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  Client  │────▶│  Next.js │────▶│   Auth   │────▶│ Database │
│ Browser  │◀────│   Web    │◀────│ Package  │◀────│ (Prisma) │
└──────────┘     └──────────┘     └──────────┘     └──────────┘
```

**Supported Methods:**
- Email/Password
- Magic Link (email)
- OAuth providers (Google, Microsoft - future)

### 2. API Key Authentication (Machine-to-Machine)

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│   POS    │────▶│  NestJS  │────▶│   Auth   │────▶│ Database │
│ Terminal │◀────│  Server  │◀────│ Package  │◀────│ (Prisma) │
└──────────┘     └──────────┘     └──────────┘     └──────────┘
                      │
                      ▼
              ┌──────────────┐
              │ API Key Auth │
              │  Middleware  │
              └──────────────┘
```

---

## Package Structure

```
packages/auth/
├── src/
│   ├── index.ts              # Main exports
│   ├── config.ts             # Auth configuration
│   ├── client.ts             # Client-side auth hooks
│   ├── server.ts             # Server-side auth utilities
│   ├── api-keys.ts           # API key management
│   ├── rbac.ts               # Role-based access control
│   ├── middleware/
│   │   ├── next.ts           # Next.js middleware
│   │   └── nest.ts           # NestJS guards
│   └── types.ts              # Type definitions
├── package.json
└── tsconfig.json
```

---

## better-auth Configuration

```typescript
// packages/auth/src/config.ts

import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { organization } from 'better-auth/plugins/organization';
import { prisma } from '@cvt/db';

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      // Send verification email via email service
      await sendEmail({
        to: user.email,
        template: 'email-verification',
        data: { url },
      });
    },
  },
  
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24,     // Update session daily
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minutes
    },
  },
  
  plugins: [
    organization({
      allowUserToCreateOrganization: false, // Admin-only org creation
      organizationLimit: 10,
      creatorRole: 'owner',
      memberRoles: ['owner', 'admin', 'member', 'billing'],
    }),
  ],
  
  advanced: {
    generateId: () => createId(), // Use cuid
  },
});

export type Auth = typeof auth;
```

---

## Role-Based Access Control (RBAC)

### Organization Roles

| Role | Description | Permissions |
|------|-------------|-------------|
| `OWNER` | Organization owner | Full control, can delete org |
| `ADMIN` | Administrator | Manage members, billing, services |
| `MEMBER` | Standard member | View and use services |
| `BILLING` | Billing contact | View/pay invoices only |

### Permission Matrix

```typescript
// packages/auth/src/rbac.ts

export const permissions = {
  // Organization management
  'org:read': ['owner', 'admin', 'member', 'billing'],
  'org:update': ['owner', 'admin'],
  'org:delete': ['owner'],
  
  // Member management
  'members:read': ['owner', 'admin', 'member'],
  'members:invite': ['owner', 'admin'],
  'members:remove': ['owner', 'admin'],
  'members:update-role': ['owner'],
  
  // Billing
  'billing:read': ['owner', 'admin', 'billing'],
  'billing:pay': ['owner', 'admin', 'billing'],
  'billing:manage': ['owner', 'admin'],
  
  // Services
  'services:read': ['owner', 'admin', 'member'],
  'services:manage': ['owner', 'admin'],
  
  // API Keys
  'api-keys:read': ['owner', 'admin'],
  'api-keys:create': ['owner', 'admin'],
  'api-keys:revoke': ['owner', 'admin'],
  
  // Support
  'support:read': ['owner', 'admin', 'member'],
  'support:create': ['owner', 'admin', 'member'],
} as const;

export type Permission = keyof typeof permissions;
export type Role = 'owner' | 'admin' | 'member' | 'billing';

export function hasPermission(role: Role, permission: Permission): boolean {
  return permissions[permission].includes(role);
}
```

### Admin Users

CVT internal staff have an `isAdmin` flag on their User record, granting access to:
- All organizations
- Internal admin dashboard
- System settings
- Manual overrides

```typescript
// packages/auth/src/rbac.ts

export function isSystemAdmin(user: User): boolean {
  return user.isAdmin === true;
}

export function canAccessOrganization(
  user: User,
  organizationId: string,
  membership?: OrganizationMember
): boolean {
  // System admins can access all orgs
  if (isSystemAdmin(user)) return true;
  
  // Otherwise, must be a member
  return membership?.organizationId === organizationId;
}
```

---

## API Key Authentication

### Key Generation

```typescript
// packages/auth/src/api-keys.ts

import { createHash, randomBytes } from 'crypto';

export interface GeneratedApiKey {
  key: string;        // The full key (shown once)
  keyHash: string;    // Stored in database
  keyPrefix: string;  // First 8 chars for identification
}

export function generateApiKey(): GeneratedApiKey {
  const key = `cvt_${randomBytes(32).toString('base64url')}`;
  const keyHash = createHash('sha256').update(key).digest('hex');
  const keyPrefix = key.substring(0, 12); // "cvt_" + 8 chars
  
  return { key, keyHash, keyPrefix };
}

export function hashApiKey(key: string): string {
  return createHash('sha256').update(key).digest('hex');
}
```

### Key Validation

```typescript
// packages/auth/src/api-keys.ts

import { prisma } from '@cvt/db';

export interface ValidatedApiKey {
  id: string;
  organizationId: string;
  scopes: string[];
  rateLimit: number;
}

export async function validateApiKey(
  key: string
): Promise<ValidatedApiKey | null> {
  const keyHash = hashApiKey(key);
  
  const apiKey = await prisma.apiKey.findUnique({
    where: { keyHash },
    select: {
      id: true,
      organizationId: true,
      scopes: true,
      rateLimit: true,
      isActive: true,
      expiresAt: true,
      organization: {
        select: {
          billingAccount: {
            select: { status: true },
          },
        },
      },
    },
  });
  
  if (!apiKey) return null;
  if (!apiKey.isActive) return null;
  if (apiKey.expiresAt && apiKey.expiresAt < new Date()) return null;
  
  // Check billing status
  if (apiKey.organization.billingAccount?.status === 'SUSPENDED') {
    return null; // Deny access for suspended accounts
  }
  
  // Update last used timestamp
  await prisma.apiKey.update({
    where: { id: apiKey.id },
    data: { lastUsedAt: new Date() },
  });
  
  return {
    id: apiKey.id,
    organizationId: apiKey.organizationId,
    scopes: apiKey.scopes,
    rateLimit: apiKey.rateLimit,
  };
}
```

### API Key Scopes

```typescript
export const API_SCOPES = {
  // POS operations
  'pos:read': 'Read POS data',
  'pos:write': 'Create POS transactions',
  'pos:void': 'Void POS transactions',
  
  // Usage reporting
  'usage:write': 'Report usage events',
  
  // Read-only access
  'org:read': 'Read organization info',
  'billing:read': 'Read billing information',
} as const;

export type ApiScope = keyof typeof API_SCOPES;
```

---

## Next.js Middleware

```typescript
// packages/auth/src/middleware/next.ts

import { auth } from '../config';
import { NextRequest, NextResponse } from 'next/server';

export async function authMiddleware(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });
  
  const pathname = request.nextUrl.pathname;
  
  // Public routes
  const publicRoutes = ['/', '/contact', '/about', '/login', '/register'];
  if (publicRoutes.some(route => pathname === route)) {
    return NextResponse.next();
  }
  
  // Client portal routes require authentication
  if (pathname.startsWith('/clients')) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    // Check organization access
    const orgSlug = pathname.split('/')[2];
    if (orgSlug) {
      const membership = await getOrganizationMembership(
        session.user.id,
        orgSlug
      );
      
      if (!membership && !session.user.isAdmin) {
        return NextResponse.redirect(new URL('/clients', request.url));
      }
    }
  }
  
  // Admin routes require admin flag
  if (pathname.startsWith('/admin')) {
    if (!session?.user.isAdmin) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }
  
  return NextResponse.next();
}
```

---

## NestJS Guards

```typescript
// packages/auth/src/middleware/nest.ts

import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { validateApiKey } from '../api-keys';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];
    
    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing API key');
    }
    
    const key = authHeader.substring(7);
    const validatedKey = await validateApiKey(key);
    
    if (!validatedKey) {
      throw new UnauthorizedException('Invalid API key');
    }
    
    // Attach to request for use in handlers
    request.apiKey = validatedKey;
    
    return true;
  }
}

@Injectable()
export class ScopeGuard implements CanActivate {
  constructor(private requiredScope: string) {}
  
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.apiKey;
    
    if (!apiKey?.scopes.includes(this.requiredScope)) {
      throw new UnauthorizedException(
        `Missing required scope: ${this.requiredScope}`
      );
    }
    
    return true;
  }
}
```

---

## Session Management

### Session Storage

Sessions stored in PostgreSQL via Prisma:
- `Session` model holds session data
- Indexed by token for fast lookups
- Automatic cleanup of expired sessions

### Session Flow

1. **Login**: User authenticates → Session created → Cookie set
2. **Request**: Cookie sent → Session validated → User context attached
3. **Logout**: Session deleted → Cookie cleared
4. **Expiration**: Background job cleans expired sessions

```typescript
// packages/auth/src/server.ts

import { auth } from './config';

export async function getServerSession(headers: Headers) {
  const session = await auth.api.getSession({ headers });
  
  if (!session) return null;
  
  // Enrich with organization context if in org route
  const memberships = await prisma.organizationMember.findMany({
    where: { userId: session.user.id },
    include: { organization: true },
  });
  
  return {
    ...session,
    memberships,
  };
}
```

---

## Client-Side Auth

```typescript
// packages/auth/src/client.ts

import { createAuthClient } from 'better-auth/react';
import { organizationClient } from 'better-auth/client/plugins';

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  plugins: [organizationClient()],
});

export const {
  useSession,
  signIn,
  signUp,
  signOut,
  useOrganization,
  useOrganizationList,
} = authClient;
```

---

## Security Considerations

### Password Requirements

```typescript
const passwordPolicy = {
  minLength: 12,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: false, // Optional but encouraged
};
```

### Rate Limiting

| Endpoint | Limit |
|----------|-------|
| Login attempts | 5 per 15 minutes per IP |
| Password reset | 3 per hour per email |
| API key requests | Configurable per key |

### API Key Security

- Keys shown only once at creation
- Only hash stored in database
- Prefix allows identification without exposure
- Automatic expiration support
- Rate limiting per key

### Session Security

- HTTP-only cookies
- Secure flag in production
- SameSite=Lax
- Regular rotation
- IP/User-Agent tracking

---

## Email Templates

| Template | Trigger |
|----------|---------|
| `email-verification` | User registration |
| `password-reset` | Forgot password request |
| `login-notification` | New device login |
| `organization-invite` | User invited to org |

---

## Implementation Checklist

- [ ] Set up `packages/auth` package
- [ ] Configure better-auth with Prisma adapter
- [ ] Implement organization plugin
- [ ] Create RBAC utilities
- [ ] Build API key management
- [ ] Create Next.js middleware
- [ ] Create NestJS guards
- [ ] Set up email integration
- [ ] Add rate limiting
- [ ] Write tests

---

## Next: [API Architecture](./04-api-architecture.md)
