import { Injectable } from "@nestjs/common";
import {
  verifyApiKey,
  verifyApiKeyForService,
  createUserApiKey,
  listUserApiKeys,
  revokeUserApiKey,
  verifyAccessToken,
  extractBearerToken,
} from "@repo/auth";
import { prisma } from "@repo/db";

@Injectable()
export class ApiKeysService {
  /**
   * Verify an API key and return services with payment status
   */
  async verifyApiKey(apiKey: string) {
    return verifyApiKey(apiKey);
  }

  /**
   * Verify an API key for a specific service
   */
  async verifyApiKeyForService(apiKey: string, serviceId: string) {
    return verifyApiKeyForService(apiKey, serviceId);
  }

  /**
   * Get user ID from session cookies
   */
  async getUserIdFromCookies(cookies: string | undefined): Promise<string | null> {
    if (!cookies) return null;

    // Parse session token from cookies
    const sessionMatch = cookies.match(/session=([^;]+)/);
    if (!sessionMatch) return null;

    const sessionToken = sessionMatch[1];

    // Look up the session
    const session = await prisma.session.findUnique({
      where: { token: sessionToken },
      select: { 
        userId: true, 
        expiresAt: true,
      },
    });

    if (!session) return null;
    if (session.expiresAt < new Date()) return null;

    return session.userId;
  }

  /**
   * List API keys for a user
   */
  async listUserApiKeys(userId: string) {
    return listUserApiKeys(userId);
  }

  /**
   * Create a new API key for a user
   */
  async createApiKey(userId: string, name: string) {
    return createUserApiKey({
      userId,
      name,
      scopes: ["services:read", "pos:read"],
    });
  }

  /**
   * Revoke/delete an API key
   */
  async revokeApiKey(userId: string, apiKeyId: string) {
    return revokeUserApiKey(userId, apiKeyId);
  }
}
