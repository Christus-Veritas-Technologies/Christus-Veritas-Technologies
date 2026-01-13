import type { PaymentMethod } from "@repo/db";

/**
 * Payment request for initiating a payment
 */
export interface PaymentRequest {
  /** Unique reference for this payment (usually payment ID) */
  reference: string;
  /** Amount in dollars (not cents) */
  amount: number;
  /** Customer email */
  email: string;
  /** Payment method */
  method: PaymentMethod;
  /** Phone number (required for mobile money) */
  phone?: string;
  /** Additional info to display */
  additionalInfo?: string;
}

/**
 * Response from payment initiation
 */
export interface PaymentInitiationResponse {
  success: boolean;
  /** URL to redirect user for payment */
  redirectUrl?: string;
  /** URL to poll for status updates */
  pollUrl?: string;
  /** Error message if failed */
  error?: string;
  /** Instructions for mobile money */
  instructions?: string;
}

/**
 * Payment status from provider
 */
export interface PaymentStatusResponse {
  /** Payment status */
  status: PaynowStatus;
  /** Amount paid */
  amount: number;
  /** Our reference */
  reference: string;
  /** Provider's reference */
  providerReference?: string;
}

/**
 * Paynow payment statuses
 */
export type PaynowStatus =
  | "Created"
  | "Sent"
  | "Pending"
  | "Paid"
  | "Awaiting Delivery"
  | "Delivered"
  | "Failed"
  | "Cancelled"
  | "Disputed"
  | "Refunded";

/**
 * Webhook payload from Paynow
 */
export interface PaynowWebhookPayload {
  reference: string;
  paynowreference: string;
  amount: string;
  status: string;
  pollurl: string;
  hash: string;
}

/**
 * Supported mobile money providers
 */
export type MobileMoneyProvider = "ecocash" | "onemoney" | "innbucks";

/**
 * Payment configuration
 */
export interface PaynowConfig {
  integrationId: string;
  integrationKey: string;
  resultUrl: string;
  returnUrl: string;
}
