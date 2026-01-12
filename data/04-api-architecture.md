# API Architecture (NestJS Server)

## Overview

This document defines the architecture for the NestJS backend server (`apps/server`). The server is responsible for:

- RESTful API endpoints
- Business logic execution
- Authentication/authorization
- Background job processing
- External integrations (Paynow, email)
- Webhook handling

---

## Why NestJS?

NestJS is chosen for:
- TypeScript-first with strong typing
- Modular architecture
- Dependency injection
- Built-in validation
- Excellent testing support
- Enterprise-ready patterns
- Prisma integration

---

## Project Structure

```
apps/server/
├── src/
│   ├── main.ts                    # Application entry point
│   ├── app.module.ts              # Root module
│   │
│   ├── common/                    # Shared utilities
│   │   ├── decorators/
│   │   │   ├── api-key.decorator.ts
│   │   │   ├── current-user.decorator.ts
│   │   │   └── roles.decorator.ts
│   │   ├── filters/
│   │   │   ├── http-exception.filter.ts
│   │   │   └── prisma-exception.filter.ts
│   │   ├── guards/
│   │   │   ├── api-key.guard.ts
│   │   │   ├── auth.guard.ts
│   │   │   ├── roles.guard.ts
│   │   │   └── billing-status.guard.ts
│   │   ├── interceptors/
│   │   │   ├── audit-log.interceptor.ts
│   │   │   ├── transform.interceptor.ts
│   │   │   └── timeout.interceptor.ts
│   │   ├── pipes/
│   │   │   └── validation.pipe.ts
│   │   └── middleware/
│   │       ├── logger.middleware.ts
│   │       └── rate-limit.middleware.ts
│   │
│   ├── modules/
│   │   ├── auth/                  # Authentication
│   │   │   ├── auth.module.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   └── dto/
│   │   │
│   │   ├── organizations/         # Organization management
│   │   │   ├── organizations.module.ts
│   │   │   ├── organizations.controller.ts
│   │   │   ├── organizations.service.ts
│   │   │   └── dto/
│   │   │
│   │   ├── billing/               # Billing & Invoicing
│   │   │   ├── billing.module.ts
│   │   │   ├── billing.controller.ts
│   │   │   ├── billing.service.ts
│   │   │   ├── invoice.service.ts
│   │   │   ├── invoice-generator.ts
│   │   │   └── dto/
│   │   │
│   │   ├── payments/              # Payment processing
│   │   │   ├── payments.module.ts
│   │   │   ├── payments.controller.ts
│   │   │   ├── payments.service.ts
│   │   │   ├── paynow.service.ts
│   │   │   └── dto/
│   │   │
│   │   ├── services/              # Service management
│   │   │   ├── services.module.ts
│   │   │   ├── services.controller.ts
│   │   │   ├── services.service.ts
│   │   │   └── dto/
│   │   │
│   │   ├── api-keys/              # API key management
│   │   │   ├── api-keys.module.ts
│   │   │   ├── api-keys.controller.ts
│   │   │   ├── api-keys.service.ts
│   │   │   └── dto/
│   │   │
│   │   ├── usage/                 # Usage tracking
│   │   │   ├── usage.module.ts
│   │   │   ├── usage.controller.ts
│   │   │   ├── usage.service.ts
│   │   │   └── dto/
│   │   │
│   │   ├── support/               # Support tickets
│   │   │   ├── support.module.ts
│   │   │   ├── support.controller.ts
│   │   │   ├── support.service.ts
│   │   │   └── dto/
│   │   │
│   │   ├── notifications/         # Email notifications
│   │   │   ├── notifications.module.ts
│   │   │   ├── notifications.service.ts
│   │   │   ├── email.service.ts
│   │   │   └── templates/
│   │   │
│   │   ├── admin/                 # Internal admin
│   │   │   ├── admin.module.ts
│   │   │   ├── admin.controller.ts
│   │   │   ├── admin.service.ts
│   │   │   └── dto/
│   │   │
│   │   ├── webhooks/              # Webhook handlers
│   │   │   ├── webhooks.module.ts
│   │   │   ├── webhooks.controller.ts
│   │   │   └── paynow-webhook.handler.ts
│   │   │
│   │   └── health/                # Health checks
│   │       ├── health.module.ts
│   │       └── health.controller.ts
│   │
│   ├── jobs/                      # Background jobs
│   │   ├── jobs.module.ts
│   │   ├── invoice-generation.job.ts
│   │   ├── payment-reconciliation.job.ts
│   │   ├── overdue-notifications.job.ts
│   │   └── session-cleanup.job.ts
│   │
│   └── config/                    # Configuration
│       ├── config.module.ts
│       ├── database.config.ts
│       ├── paynow.config.ts
│       └── email.config.ts
│
├── test/                          # E2E tests
├── nest-cli.json
├── package.json
└── tsconfig.json
```

---

## API Endpoints

### Authentication

```
POST   /auth/login                 # User login
POST   /auth/register              # User registration
POST   /auth/logout                # User logout
POST   /auth/forgot-password       # Request password reset
POST   /auth/reset-password        # Reset password
GET    /auth/session               # Get current session
POST   /auth/verify-email          # Verify email address
```

### Organizations

```
GET    /organizations              # List user's organizations
POST   /organizations              # Create organization (admin only)
GET    /organizations/:slug        # Get organization details
PATCH  /organizations/:slug        # Update organization
DELETE /organizations/:slug        # Delete organization (owner only)

GET    /organizations/:slug/members        # List members
POST   /organizations/:slug/members        # Invite member
PATCH  /organizations/:slug/members/:id    # Update member role
DELETE /organizations/:slug/members/:id    # Remove member
```

### Billing

```
GET    /organizations/:slug/billing           # Billing overview
GET    /organizations/:slug/invoices          # List invoices
GET    /organizations/:slug/invoices/:id      # Get invoice details
GET    /organizations/:slug/invoices/:id/pdf  # Download invoice PDF

POST   /organizations/:slug/payments          # Initiate payment
GET    /organizations/:slug/payments          # Payment history
GET    /organizations/:slug/payments/:id      # Payment details
```

### Services

```
GET    /organizations/:slug/services          # List services
GET    /organizations/:slug/services/:id      # Service details
```

### API Keys

```
GET    /organizations/:slug/api-keys          # List API keys
POST   /organizations/:slug/api-keys          # Create API key
DELETE /organizations/:slug/api-keys/:id      # Revoke API key
```

### Usage (API Key Authenticated)

```
POST   /usage/events               # Report usage event
GET    /usage/summary              # Get usage summary
```

### Support

```
GET    /organizations/:slug/support           # List tickets
POST   /organizations/:slug/support           # Create ticket
GET    /organizations/:slug/support/:id       # Get ticket
POST   /organizations/:slug/support/:id/messages  # Add message
```

### Public (Payment Links)

```
GET    /pay/:token                 # Get invoice for payment
POST   /pay/:token                 # Initiate payment
```

### Webhooks

```
POST   /webhooks/paynow            # Paynow callback
```

### Admin

```
GET    /admin/organizations        # List all organizations
GET    /admin/organizations/:id    # Get any organization
PATCH  /admin/organizations/:id    # Update any organization

GET    /admin/billing/accounts     # All billing accounts
POST   /admin/billing/credits      # Issue credit
PATCH  /admin/billing/accounts/:id # Update billing status

GET    /admin/invoices             # All invoices
POST   /admin/invoices/:id/void    # Void invoice

GET    /admin/payments             # All payments
POST   /admin/payments/manual      # Record manual payment

GET    /admin/usage                # Usage reports
GET    /admin/audit-log            # Audit log
```

### Health

```
GET    /health                     # Health check
GET    /health/ready               # Readiness check
```

---

## Module Details

### Auth Module

```typescript
// src/modules/auth/auth.module.ts

import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
```

### Billing Module

```typescript
// src/modules/billing/billing.module.ts

import { Module } from '@nestjs/common';
import { BillingController } from './billing.controller';
import { BillingService } from './billing.service';
import { InvoiceService } from './invoice.service';
import { InvoiceGenerator } from './invoice-generator';
import { PaymentsModule } from '../payments/payments.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [PaymentsModule, NotificationsModule],
  controllers: [BillingController],
  providers: [BillingService, InvoiceService, InvoiceGenerator],
  exports: [BillingService, InvoiceService],
})
export class BillingModule {}
```

---

## Guards

### Auth Guard

```typescript
// src/common/guards/auth.guard.ts

import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { auth } from '@cvt/auth';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    
    const session = await auth.api.getSession({
      headers: new Headers(request.headers),
    });
    
    if (!session) {
      return false;
    }
    
    request.user = session.user;
    request.session = session;
    
    return true;
  }
}
```

### API Key Guard

```typescript
// src/common/guards/api-key.guard.ts

import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { validateApiKey } from '@cvt/auth';

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
      throw new UnauthorizedException('Invalid or expired API key');
    }
    
    request.apiKey = validatedKey;
    return true;
  }
}
```

### Billing Status Guard

```typescript
// src/common/guards/billing-status.guard.ts

import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '@cvt/db';

@Injectable()
export class BillingStatusGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}
  
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const organizationId = request.apiKey?.organizationId;
    
    if (!organizationId) return false;
    
    const billingAccount = await this.prisma.billingAccount.findUnique({
      where: { organizationId },
      select: { status: true },
    });
    
    if (billingAccount?.status === 'SUSPENDED') {
      throw new ForbiddenException(
        'Service suspended due to billing issues. Please contact support.'
      );
    }
    
    return true;
  }
}
```

---

## Interceptors

### Audit Log Interceptor

```typescript
// src/common/interceptors/audit-log.interceptor.ts

import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { PrismaService } from '@cvt/db';

@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
  constructor(private prisma: PrismaService) {}
  
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, user, apiKey } = request;
    
    // Only audit mutating operations
    if (!['POST', 'PATCH', 'PUT', 'DELETE'].includes(method)) {
      return next.handle();
    }
    
    return next.handle().pipe(
      tap(async (response) => {
        await this.prisma.auditLog.create({
          data: {
            actorId: user?.id ?? apiKey?.id,
            actorType: user ? 'user' : apiKey ? 'api_key' : 'system',
            action: `${method} ${url}`,
            entityType: this.extractEntityType(url),
            entityId: response?.id ?? 'unknown',
            metadata: { responseStatus: 'success' },
            ipAddress: request.ip,
            userAgent: request.headers['user-agent'],
          },
        });
      }),
    );
  }
  
  private extractEntityType(url: string): string {
    const parts = url.split('/').filter(Boolean);
    return parts[parts.length - 2] ?? parts[parts.length - 1] ?? 'unknown';
  }
}
```

---

## Background Jobs

Using Bull queues for reliable job processing:

### Job Types

| Job | Schedule | Description |
|-----|----------|-------------|
| `invoice-generation` | 1st of month, 00:00 | Generate monthly invoices |
| `payment-reconciliation` | Every 15 minutes | Check pending payments |
| `overdue-notifications` | Daily, 09:00 | Send overdue reminders |
| `session-cleanup` | Daily, 03:00 | Remove expired sessions |
| `billing-status-update` | Daily, 00:00 | Update overdue/suspended status |

### Invoice Generation Job

```typescript
// src/jobs/invoice-generation.job.ts

import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InvoiceService } from '../modules/billing/invoice.service';

@Injectable()
export class InvoiceGenerationJob {
  constructor(private invoiceService: InvoiceService) {}
  
  @Cron('0 0 1 * *') // 1st of every month at midnight
  async generateMonthlyInvoices() {
    const organizations = await this.prisma.organization.findMany({
      where: {
        billingAccount: {
          status: { not: 'SUSPENDED' },
        },
        services: {
          some: { status: 'ACTIVE' },
        },
      },
      include: {
        billingAccount: true,
        services: { where: { status: 'ACTIVE' } },
      },
    });
    
    for (const org of organizations) {
      await this.invoiceService.generateMonthlyInvoice(org);
    }
  }
}
```

---

## Error Handling

### HTTP Exception Filter

```typescript
// src/common/filters/http-exception.filter.ts

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    
    const message =
      exception instanceof HttpException
        ? exception.message
        : 'Internal server error';
    
    response.status(status).json({
      success: false,
      error: {
        statusCode: status,
        message,
        timestamp: new Date().toISOString(),
        path: request.url,
      },
    });
  }
}
```

---

## Validation

### DTO Example

```typescript
// src/modules/organizations/dto/create-organization.dto.ts

import { IsString, IsEmail, IsOptional, MinLength, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateOrganizationDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;
  
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  @Transform(({ value }) => value.toLowerCase().replace(/\s+/g, '-'))
  slug: string;
  
  @IsEmail()
  email: string;
  
  @IsOptional()
  @IsString()
  phone?: string;
  
  @IsOptional()
  @IsString()
  address?: string;
  
  @IsOptional()
  @IsString()
  city?: string;
  
  @IsString()
  country: string = 'Zimbabwe';
}
```

---

## Response Format

### Success Response

```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100
  }
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "statusCode": 400,
    "message": "Validation failed",
    "errors": [
      { "field": "email", "message": "Invalid email format" }
    ],
    "timestamp": "2026-01-12T10:00:00.000Z",
    "path": "/api/organizations"
  }
}
```

---

## Configuration

### Environment Variables

```env
# Server
PORT=3001
NODE_ENV=production

# Database
DATABASE_URL=postgresql://...

# Auth
AUTH_SECRET=...
AUTH_URL=https://api.cvt.co.zw

# Paynow
PAYNOW_INTEGRATION_ID=...
PAYNOW_INTEGRATION_KEY=...
PAYNOW_RESULT_URL=https://api.cvt.co.zw/webhooks/paynow
PAYNOW_RETURN_URL=https://cvt.co.zw/payment/complete

# Email
SMTP_HOST=...
SMTP_PORT=587
SMTP_USER=...
SMTP_PASS=...
EMAIL_FROM=noreply@cvt.co.zw
```

---

## Testing Strategy

### Unit Tests
- Services with mocked dependencies
- Guards and interceptors
- Utility functions

### Integration Tests
- Module-level testing
- Database operations with test database

### E2E Tests
- Full API endpoint testing
- Authentication flows
- Payment flows

---

## Deployment

### Docker

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY . .
RUN npm ci
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package.json .
CMD ["node", "dist/main"]
```

### Health Checks

```typescript
// src/modules/health/health.controller.ts

@Controller('health')
export class HealthController {
  @Get()
  check() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }
  
  @Get('ready')
  async ready() {
    // Check database connection
    await this.prisma.$queryRaw`SELECT 1`;
    return { status: 'ready' };
  }
}
```

---

## Next: [Billing System](./05-billing-system.md)
