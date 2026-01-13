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
  Headers,
} from "@nestjs/common";
import { ApiKeysService } from "./api-keys.service";
import {
  VerifyApiKeyDto,
  VerifyApiKeyForServiceDto,
  CreateApiKeyDto,
  DeleteApiKeyDto,
} from "./api-keys.dto";

@Controller("api-keys")
export class ApiKeysController {
  constructor(private readonly apiKeysService: ApiKeysService) {}

  /**
   * Verify an API key and return services with payment status
   * This is a public endpoint for external apps to validate API keys
   */
  @Post("verify")
  @HttpCode(HttpStatus.OK)
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
  async listMyApiKeys(@Headers("cookie") cookies: string) {
    const userId = await this.apiKeysService.getUserIdFromCookies(cookies);
    
    if (!userId) {
      throw new UnauthorizedException("Not authenticated");
    }

    return this.apiKeysService.listUserApiKeys(userId);
  }

  /**
   * Create a new API key for the authenticated user
   */
  @Post("create")
  async createApiKey(
    @Headers("cookie") cookies: string,
    @Body() dto: CreateApiKeyDto
  ) {
    const userId = await this.apiKeysService.getUserIdFromCookies(cookies);
    
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
  async deleteApiKey(
    @Headers("cookie") cookies: string,
    @Param("id") apiKeyId: string,
    @Body() dto: DeleteApiKeyDto
  ) {
    const userId = await this.apiKeysService.getUserIdFromCookies(cookies);
    
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
