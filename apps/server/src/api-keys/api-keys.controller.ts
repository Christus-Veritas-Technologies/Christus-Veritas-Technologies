import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
  BadRequestException,
  UseGuards,
  Req,
} from "@nestjs/common";
import { Request } from "express";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiParam,
} from "@nestjs/swagger";
import { AuthGuard } from "../auth/auth.guard";
import { ApiKeysService } from "./api-keys.service";
import {
  VerifyApiKeyDto,
  VerifyApiKeyForServiceDto,
  CreateApiKeyDto,
  DeleteApiKeyDto,
} from "./api-keys.dto";

@ApiTags('API Keys')
@Controller('api/api-keys')
export class ApiKeysController {
  constructor(private readonly apiKeysService: ApiKeysService) {}

  /**
   * Verify an API key and return services with payment status
   * This is a public endpoint for external apps to validate API keys
   */
  @Post("verify")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Verify API Key',
    description: `
**Public Endpoint** - No authentication required.

Verifies an API key and returns comprehensive user data and services with their payment status.

### Usage Example

\`\`\`javascript
const response = await fetch('https://api.cvt.co.zw/api/api-keys/verify', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ apiKey: 'cvt_your_api_key_here' })
});

const data = await response.json();
if (data.valid) {
  console.log('User:', data.user);
  console.log('Services:', data.services);
}
\`\`\`

### Response Fields

- \`valid\`: Whether the API key is active and not expired
- \`userId\`: The user ID associated with this API key
- \`organizationId\`: The organization ID (if applicable)
- \`user\`: Complete user data object (all fields except password):
  - \`id\`: User ID
  - \`email\`: User email address (IMPORTANT for account creation)
  - \`name\`: User's full name
  - \`phoneNumber\`: User's phone number
  - \`emailVerified\`: Email verification timestamp
  - \`image\`: User profile image URL
  - \`businessName\`: Business name associated with account
  - \`businessAddress\`: Business address
  - \`onboardingCompleted\`: Whether user completed onboarding
  - \`createdAt\`: Account creation timestamp
  - \`updatedAt\`: Last update timestamp
  - \`isAdmin\`: Whether user is CVT admin
- \`organization\`: Complete organization data:
  - \`id\`: Organization ID
  - \`name\`: Organization name
  - \`slug\`: Organization URL slug
  - \`email\`: Organization email
  - \`phone\`: Organization phone number
  - \`address\`: Organization address
  - \`city\`: Organization city
  - \`country\`: Organization country
  - \`createdAt\`: Organization creation timestamp
  - \`updatedAt\`: Last update timestamp
- \`services\`: Array of services with payment status
    `,
  })
  @ApiBody({
    type: VerifyApiKeyDto,
    description: 'The API key to verify',
  })
  @ApiResponse({
    status: 200,
    description: 'API key verification result',
    schema: {
      type: 'object',
      properties: {
        valid: { type: 'boolean', example: true },
        userId: { type: 'string', example: 'clx1234567890' },
        organizationId: { type: 'string', example: 'clx0987654321', nullable: true },
        user: {
          type: 'object',
          nullable: true,
          description: 'Complete user data (all fields except password)',
          properties: {
            id: { type: 'string', example: 'clx1234567890' },
            email: { type: 'string', example: 'user@example.com' },
            name: { type: 'string', example: 'John Doe', nullable: true },
            phoneNumber: { type: 'string', example: '+263771234567', nullable: true },
            emailVerified: { type: 'string', format: 'date-time', nullable: true },
            image: { type: 'string', format: 'uri', nullable: true },
            businessName: { type: 'string', example: 'Acme Corp', nullable: true },
            businessAddress: { type: 'string', example: '123 Main St', nullable: true },
            onboardingCompleted: { type: 'boolean', example: true },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
            isAdmin: { type: 'boolean', example: false },
          },
        },
        organization: {
          type: 'object',
          nullable: true,
          description: 'Complete organization data',
          properties: {
            id: { type: 'string', example: 'clx0987654321' },
            name: { type: 'string', example: 'Acme Corporation' },
            slug: { type: 'string', example: 'acme-corporation' },
            email: { type: 'string', example: 'org@example.com' },
            phone: { type: 'string', example: '+263771234567', nullable: true },
            address: { type: 'string', example: '123 Business St', nullable: true },
            city: { type: 'string', example: 'Harare', nullable: true },
            country: { type: 'string', example: 'Zimbabwe' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        services: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', example: 'clxservice123' },
              name: { type: 'string', example: 'POS System' },
              description: { type: 'string', example: 'Point of Sale System', nullable: true },
              units: { type: 'number', example: 1 },
              status: { type: 'string', example: 'ACTIVE' },
              paid: { type: 'boolean', example: true },
              latestInvoiceId: { type: 'string', example: 'clxinv123', nullable: true },
              latestInvoiceStatus: { type: 'string', example: 'PAID', nullable: true },
              nextBillingDate: { type: 'string', format: 'date-time', nullable: true },
              dateJoined: { type: 'string', format: 'date-time' },
              recurringPrice: { type: 'number', example: 1500, description: 'Price in cents' },
              customRecurringPrice: { type: 'number', example: null, nullable: true },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid or expired API key',
  })
  async verifyApiKey(@Body() dto: VerifyApiKeyDto) {
    const result = await this.apiKeysService.verifyApiKey(dto.apiKey);

    if (!result.valid) {
      throw new UnauthorizedException("Invalid or expired API key");
    }

    return result;
  }

  /**
   * Verify an API key for a specific service
   * Returns whether the user has the service and if it's paid
   */
  @Post("verify-service")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Verify API Key for Specific Service',
    description: `
**Public Endpoint** - No authentication required.

Verifies an API key and checks if the user has access to a specific service.
Use this to gate features in your application based on service subscription.

### Usage Example

\`\`\`javascript
const response = await fetch('https://api.cvt.co.zw/api/api-keys/verify-service', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    apiKey: 'cvt_your_api_key_here',
    serviceId: 'service_id_from_cvt'
  })
});

const data = await response.json();
if (data.valid && data.hasService && data.paid) {
  // User has the service and it's paid - grant access
  enableFeature();
} else if (!data.paid) {
  // Service exists but payment is due
  showPaymentReminder();
}
\`\`\`

### Response Fields

- \`valid\`: Whether the API key itself is valid
- \`hasService\`: Whether the user is subscribed to the specified service
- \`paid\`: Whether the latest invoice for this service is paid
- \`service\`: Full service details (null if user doesn't have the service)
- \`message\`: Human-readable status message
    `,
  })
  @ApiBody({
    type: VerifyApiKeyForServiceDto,
    description: 'The API key and service ID to verify',
  })
  @ApiResponse({
    status: 200,
    description: 'Service verification result',
    schema: {
      type: 'object',
      properties: {
        valid: { type: 'boolean', example: true },
        hasService: { type: 'boolean', example: true },
        paid: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Service is active and paid' },
        service: {
          type: 'object',
          nullable: true,
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            description: { type: 'string', nullable: true },
            units: { type: 'number' },
            status: { type: 'string' },
            paid: { type: 'boolean' },
            nextBillingDate: { type: 'string', format: 'date-time', nullable: true },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid or expired API key',
  })
  async verifyApiKeyForService(@Body() dto: VerifyApiKeyForServiceDto) {
    const result = await this.apiKeysService.verifyApiKeyForService(
      dto.apiKey,
      dto.serviceId
    );

    if (!result.valid) {
      throw new UnauthorizedException("Invalid or expired API key");
    }

    return result;
  }

  /**
   * List API keys for the authenticated user
   */
  @Get("my-keys")
  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT-Auth')
  @ApiOperation({
    summary: 'List My API Keys',
    description: 'Returns all API keys belonging to the authenticated user. Requires session cookie authentication.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of API keys',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          keyPrefix: { type: 'string', example: 'cvt_abc123...' },
          scopes: { type: 'array', items: { type: 'string' } },
          isActive: { type: 'boolean' },
          lastUsedAt: { type: 'string', format: 'date-time', nullable: true },
          createdAt: { type: 'string', format: 'date-time' },
          expiresAt: { type: 'string', format: 'date-time', nullable: true },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Not authenticated' })
  async listMyApiKeys(@Req() req: Request) {
    const userId = (req.user as any)?.userId;
    
    if (!userId) {
      throw new UnauthorizedException("Not authenticated");
    }

    return this.apiKeysService.listUserApiKeys(userId);
  }

  /**
   * Create a new API key for the authenticated user
   */
  @Post("create")
  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT-Auth')
  @ApiOperation({
    summary: 'Create API Key',
    description: `
Creates a new API key for the authenticated user.

**Important:** The full API key is only shown once in the response. Store it securely as it cannot be retrieved again.

Default scopes granted: \`services:read\`, \`pos:read\`
    `,
  })
  @ApiBody({ type: CreateApiKeyDto })
  @ApiResponse({
    status: 201,
    description: 'API key created successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        apiKey: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            key: { type: 'string', description: 'Full API key - only shown once!' },
            keyPrefix: { type: 'string' },
            scopes: { type: 'array', items: { type: 'string' } },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Not authenticated' })
  @ApiResponse({ status: 400, description: 'Invalid request or key limit reached' })
  async createApiKey(
    @Req() req: Request,
    @Body() dto: CreateApiKeyDto
  ) {
    const userId = (req.user as any)?.userId;
    
    if (!userId) {
      throw new UnauthorizedException("Not authenticated");
    }

    const result = await this.apiKeysService.createApiKey(userId, dto.name);

    if (!result.success) {
      throw new BadRequestException(result.error);
    }

    return result;
  }

  /**
   * Delete/revoke an API key
   * Requires confirmation text: "delete my cvt api key"
   */
  @Delete(":id")
  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT-Auth')
  @ApiOperation({
    summary: 'Delete API Key',
    description: `
Permanently revokes and deletes an API key.

**Requires confirmation:** Include \`"confirmationText": "delete my cvt api key"\` in the request body.

Once deleted, the API key cannot be recovered and any applications using it will stop working.
    `,
  })
  @ApiParam({ name: 'id', description: 'The ID of the API key to delete' })
  @ApiBody({ type: DeleteApiKeyDto })
  @ApiResponse({
    status: 200,
    description: 'API key deleted successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'API key deleted successfully' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid confirmation text or key not found' })
  @ApiResponse({ status: 401, description: 'Not authenticated' })
  async deleteApiKey(
    @Req() req: Request,
    @Param("id") apiKeyId: string,
    @Body() dto: DeleteApiKeyDto
  ) {
    const userId = (req.user as any)?.userId;
    
    if (!userId) {
      throw new UnauthorizedException("Not authenticated");
    }

    // Verify confirmation text
    const expectedConfirmation = "delete my cvt api key";
    if (dto.confirmationText?.toLowerCase() !== expectedConfirmation) {
      throw new BadRequestException(
        `Please type "${expectedConfirmation}" to confirm deletion`
      );
    }

    const result = await this.apiKeysService.revokeApiKey(userId, apiKeyId);

    if (!result.success) {
      throw new BadRequestException(result.error);
    }

    return { success: true, message: "API key deleted successfully" };
  }
}
