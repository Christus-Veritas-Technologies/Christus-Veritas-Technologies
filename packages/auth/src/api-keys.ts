import { createHash, randomBytes } from "crypto";
import { prisma } from "@repo/db";

/**
 * API Key generation and validation
 */

export interface GeneratedApiKey {
  /** The full key (shown once to user) */
  key: string;
  /** Hashed key (stored in database) */
  keyHash: string;
  /** First 12 chars for identification */
  keyPrefix: string;
}

export interface ValidatedApiKey {
  id: string;
  organizationId: string;
  scopes: string[];
  rateLimit: number;
}

/**
 * Generate a new API key
 */
export function generateApiKey(): GeneratedApiKey {
  const key = `cvt_${randomBytes(32).toString("base64url")}`;
  const keyHash = createHash("sha256").update(key).digest("hex");
  const keyPrefix = key.substring(0, 12); // "cvt_" + 8 chars

  return { key, keyHash, keyPrefix };
}

/**
 * Hash an API key for comparison
 */
export function hashApiKey(key: string): string {
  return createHash("sha256").update(key).digest("hex");
}

/**
 * Validate an API key and return its details
 */
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

  // Check billing status - deny if suspended
  if (apiKey.organization.billingAccount?.status === "SUSPENDED") {
    return null;
  }

  // Update last used timestamp (fire and forget)
  prisma.apiKey
    .update({
      where: { id: apiKey.id },
      data: { lastUsedAt: new Date() },
    })
    .catch(() => {
      // Ignore errors updating last used
    });

  return {
    id: apiKey.id,
    organizationId: apiKey.organizationId,
    scopes: apiKey.scopes,
    rateLimit: apiKey.rateLimit,
  };
}

/**
 * Available API scopes
 */
export const API_SCOPES = {
  "pos:read": "Read POS data",
  "pos:write": "Create POS transactions",
  "pos:void": "Void POS transactions",
  "usage:write": "Report usage events",
  "org:read": "Read organization info",
  "billing:read": "Read billing information",
} as const;

export type ApiScope = keyof typeof API_SCOPES;

/**
 * Check if an API key has a specific scope
 */
export function hasScope(scopes: string[], requiredScope: ApiScope): boolean {
  return scopes.includes(requiredScope);
}
