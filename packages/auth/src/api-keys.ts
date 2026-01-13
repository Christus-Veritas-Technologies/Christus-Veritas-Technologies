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
  if (apiKey.organization?.billingAccount?.status === "SUSPENDED") {
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
    organizationId: apiKey.organizationId ?? "",
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
  "services:read": "Read services information",
} as const;

export type ApiScope = keyof typeof API_SCOPES;

/**
 * Check if an API key has a specific scope
 */
export function hasScope(scopes: string[], requiredScope: ApiScope): boolean {
  return scopes.includes(requiredScope);
}

// ============================================
// VERIFY API KEY FUNCTIONALITY
// ============================================

export interface ServiceInfo {
  id: string;
  name: string;
  description: string | null;
  units: number;
  status: string;
  paid: boolean;
  latestInvoiceId: string | null;
  latestInvoiceStatus: string | null;
  nextBillingDate: Date | null;
  dateJoined: Date;
  recurringPrice: number;
  customRecurringPrice: number | null;
}

export interface VerifyApiKeyResult {
  valid: boolean;
  userId: string | null;
  organizationId: string | null;
  services: ServiceInfo[];
}

export interface VerifyServiceResult {
  valid: boolean;
  hasService: boolean;
  paid: boolean;
  service: ServiceInfo | null;
  message: string;
}

/**
 * Verify an API key and return the user's services with payment status
 * This checks the latest invoice for each service to determine if it's paid
 */
export async function verifyApiKey(apiKey: string): Promise<VerifyApiKeyResult> {
  const keyHash = hashApiKey(apiKey);

  // Find the API key
  const key = await prisma.apiKey.findUnique({
    where: { keyHash },
    select: {
      id: true,
      isActive: true,
      expiresAt: true,
      userId: true,
      organizationId: true,
      user: {
        select: {
          id: true,
          clientServices: {
            where: { status: "ACTIVE" },
            include: {
              serviceDefinition: true,
            },
          },
        },
      },
      organization: {
        select: {
          billingAccount: {
            select: { 
              id: true,
              status: true,
            },
          },
        },
      },
    },
  });

  if (!key) {
    return { valid: false, userId: null, organizationId: null, services: [] };
  }

  if (!key.isActive) {
    return { valid: false, userId: null, organizationId: null, services: [] };
  }

  if (key.expiresAt && key.expiresAt < new Date()) {
    return { valid: false, userId: null, organizationId: null, services: [] };
  }

  // Update last used timestamp
  prisma.apiKey
    .update({
      where: { id: key.id },
      data: { lastUsedAt: new Date() },
    })
    .catch(() => {});

  // If no user linked, return valid but no services
  if (!key.userId || !key.user) {
    return {
      valid: true,
      userId: null,
      organizationId: key.organizationId,
      services: [],
    };
  }

  const billingAccountId = key.organization?.billingAccount?.id;

  // Get services with payment status
  const services: ServiceInfo[] = await Promise.all(
    key.user.clientServices.map(async (cs) => {
      // Find the latest invoice that includes this service
      let latestInvoice = null;
      let paid = true; // Default to paid if no invoice exists yet

      if (billingAccountId) {
        latestInvoice = await prisma.invoice.findFirst({
          where: {
            billingAccountId,
            lineItems: {
              some: {
                description: { contains: cs.serviceDefinition.name },
              },
            },
          },
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            status: true,
          },
        });

        if (latestInvoice) {
          paid = latestInvoice.status === "PAID";
        } else {
          // No invoice yet - check if one-off is paid or if within first billing cycle
          paid = cs.oneOffPricePaid || !cs.serviceDefinition.oneOffPrice;
        }
      }

      return {
        id: cs.id,
        name: cs.serviceDefinition.name,
        description: cs.serviceDefinition.description,
        units: cs.units,
        status: cs.status,
        paid,
        latestInvoiceId: latestInvoice?.id ?? null,
        latestInvoiceStatus: latestInvoice?.status ?? null,
        nextBillingDate: cs.nextBillingDate,
        dateJoined: cs.dateJoined,
        recurringPrice: cs.serviceDefinition.recurringPrice,
        customRecurringPrice: cs.customRecurringPrice,
      };
    })
  );

  return {
    valid: true,
    userId: key.userId,
    organizationId: key.organizationId,
    services,
  };
}

/**
 * Verify an API key for a specific service
 * Returns whether the user has the service and if it's paid
 */
export async function verifyApiKeyForService(
  apiKey: string,
  serviceId: string
): Promise<VerifyServiceResult> {
  const result = await verifyApiKey(apiKey);

  if (!result.valid) {
    return {
      valid: false,
      hasService: false,
      paid: false,
      service: null,
      message: "Invalid or expired API key",
    };
  }

  const service = result.services.find((s) => s.id === serviceId);

  if (!service) {
    return {
      valid: true,
      hasService: false,
      paid: false,
      service: null,
      message: "Service not found for this user",
    };
  }

  if (!service.paid) {
    return {
      valid: true,
      hasService: true,
      paid: false,
      service,
      message: "Service exists but latest invoice is unpaid",
    };
  }

  return {
    valid: true,
    hasService: true,
    paid: true,
    service,
    message: "Service is active and paid",
  };
}

// ============================================
// API KEY MANAGEMENT FOR USERS
// ============================================

export interface CreateUserApiKeyInput {
  userId: string;
  name: string;
  scopes?: string[];
  expiresInDays?: number;
}

export interface CreateUserApiKeyResult {
  success: boolean;
  key?: string; // Only returned once!
  apiKey?: {
    id: string;
    name: string;
    keyPrefix: string;
    scopes: string[];
    createdAt: Date;
    expiresAt: Date | null;
  };
  error?: string;
}

/**
 * Create a new API key for a user
 */
export async function createUserApiKey(
  input: CreateUserApiKeyInput
): Promise<CreateUserApiKeyResult> {
  const { userId, name, scopes = ["services:read"], expiresInDays } = input;

  // Verify user exists
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { 
      id: true,
      memberships: {
        select: { organizationId: true },
        take: 1,
      },
    },
  });

  if (!user) {
    return { success: false, error: "User not found" };
  }

  // Generate the key
  const { key, keyHash, keyPrefix } = generateApiKey();

  // Calculate expiry
  const expiresAt = expiresInDays
    ? new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000)
    : null;

  // Create the API key
  const apiKey = await prisma.apiKey.create({
    data: {
      userId,
      organizationId: user.memberships[0]?.organizationId ?? null,
      name,
      keyHash,
      keyPrefix,
      scopes,
      expiresAt,
      isActive: true,
    },
  });

  return {
    success: true,
    key, // This is the only time the full key is returned!
    apiKey: {
      id: apiKey.id,
      name: apiKey.name,
      keyPrefix: apiKey.keyPrefix,
      scopes: apiKey.scopes,
      createdAt: apiKey.createdAt,
      expiresAt: apiKey.expiresAt,
    },
  };
}

/**
 * List API keys for a user (without the actual key values)
 */
export async function listUserApiKeys(userId: string) {
  return prisma.apiKey.findMany({
    where: { userId },
    select: {
      id: true,
      name: true,
      keyPrefix: true,
      scopes: true,
      isActive: true,
      createdAt: true,
      expiresAt: true,
      lastUsedAt: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Revoke/delete an API key
 */
export async function revokeUserApiKey(
  userId: string,
  apiKeyId: string
): Promise<{ success: boolean; error?: string }> {
  // Verify the key belongs to the user
  const apiKey = await prisma.apiKey.findFirst({
    where: {
      id: apiKeyId,
      userId,
    },
  });

  if (!apiKey) {
    return { success: false, error: "API key not found or doesn't belong to you" };
  }

  // Delete the key
  await prisma.apiKey.delete({
    where: { id: apiKeyId },
  });

  return { success: true };
}
