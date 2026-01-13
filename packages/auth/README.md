# @cvt/auth

Authentication package for Christus Veritas Technologies ERP using better-auth.

## Features

- Email/password authentication
- Session management
- Organization-based multi-tenancy
- Role-based access control (RBAC)
- API key authentication for machine-to-machine

## Usage

### Server-side (Next.js API routes, NestJS)

```typescript
import { auth, getServerSession } from "@cvt/auth/server";

// Get current session
const session = await getServerSession(request.headers);
```

### Client-side (React)

```typescript
import { authClient } from "@cvt/auth/client";

// Sign in
await authClient.signIn.email({
  email: "user@example.com",
  password: "password",
});

// Get session
const session = await authClient.getSession();
```

### API Key Validation

```typescript
import { validateApiKey } from "@cvt/auth/api-keys";

const apiKey = await validateApiKey("cvt_xxx...");
if (!apiKey) {
  throw new Error("Invalid API key");
}
```

### RBAC

```typescript
import { hasPermission, requirePermission } from "@cvt/auth/rbac";

// Check permission
if (hasPermission(member.role, "billing:read")) {
  // User can view billing
}

// Require permission (throws if not allowed)
requirePermission(member.role, "members:invite");
```

## Roles

| Role | Description |
|------|-------------|
| `OWNER` | Full control, can delete organization |
| `ADMIN` | Can manage billing, services, members |
| `MEMBER` | Can view and use services |
| `BILLING` | Can only view/pay invoices |
