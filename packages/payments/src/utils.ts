import type { PaymentMethod } from "@repo/db";
import { createHash } from "crypto";
import type { MobileMoneyProvider, PaynowWebhookPayload } from "./types";

/**
 * Check if a payment method is mobile money
 */
export function isMobileMoneyMethod(method: PaymentMethod): boolean {
  return ["PAYNOW_ECOCASH", "PAYNOW_ONEMONEY", "PAYNOW_INNBUCKS"].includes(
    method
  );
}

/**
 * Get the Paynow mobile provider code
 */
export function getMobileProviderCode(
  method: PaymentMethod
): MobileMoneyProvider {
  const codes: Record<string, MobileMoneyProvider> = {
    PAYNOW_ECOCASH: "ecocash",
    PAYNOW_ONEMONEY: "onemoney",
    PAYNOW_INNBUCKS: "innbucks",
  };

  const code = codes[method];
  if (!code) {
    throw new Error(`Invalid mobile money method: ${method}`);
  }

  return code;
}

/**
 * Format payment method for display
 */
export function formatPaymentMethod(method: PaymentMethod): string {
  const names: Record<PaymentMethod, string> = {
    PAYNOW_ECOCASH: "EcoCash",
    PAYNOW_ONEMONEY: "OneMoney",
    PAYNOW_INNBUCKS: "InnBucks",
    PAYNOW_VISA: "Visa",
    PAYNOW_MASTERCARD: "Mastercard",
    BANK_TRANSFER: "Bank Transfer",
    CASH: "Cash",
    CREDIT: "Account Credit",
  };

  return names[method] || method;
}

/**
 * Convert cents to dollars
 */
export function centsToDollars(cents: number): number {
  return cents / 100;
}

/**
 * Convert dollars to cents
 */
export function dollarsToCents(dollars: number): number {
  return Math.round(dollars * 100);
}

/**
 * Verify Paynow webhook hash
 */
export function verifyPaynowHash(
  payload: PaynowWebhookPayload,
  integrationKey: string
): boolean {
  const { hash, ...rest } = payload;

  // Sort keys and concatenate values
  const dataToHash = Object.entries(rest)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, value]) => value)
    .join("");

  const expectedHash = createHash("sha512")
    .update(dataToHash + integrationKey)
    .digest("hex")
    .toUpperCase();

  return hash === expectedHash;
}

/**
 * Validate Zimbabwe phone number format
 */
export function validateZimbabwePhone(phone: string): boolean {
  // Remove any spaces or dashes
  const cleaned = phone.replace(/[\s-]/g, "");

  // Check for valid formats:
  // 07XXXXXXXX (10 digits starting with 07)
  // +2637XXXXXXXX (13 chars with country code)
  // 2637XXXXXXXX (12 digits with country code without +)
  const patterns = [/^07[1-9]\d{7}$/, /^\+2637[1-9]\d{7}$/, /^2637[1-9]\d{7}$/];

  return patterns.some((pattern) => pattern.test(cleaned));
}

/**
 * Normalize phone number to Paynow format (07XXXXXXXX)
 */
export function normalizePhone(phone: string): string {
  const cleaned = phone.replace(/[\s-+]/g, "");

  if (cleaned.startsWith("263")) {
    return "0" + cleaned.slice(3);
  }

  return cleaned;
}
