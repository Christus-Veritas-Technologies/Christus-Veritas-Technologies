/// <reference path="./paynow.d.ts" />
import { Paynow } from "paynow";
import type { PaymentMethod } from "@repo/db";
import type {
  PaynowConfig,
  PaymentRequest,
  PaymentInitiationResponse,
  PaymentStatusResponse,
  PaynowStatus,
} from "./types";
import { isMobileMoneyMethod, getMobileProviderCode } from "./utils";

/**
 * Paynow payment gateway service
 */
export class PaynowService {
  private paynow: Paynow;
  private config: PaynowConfig;

  constructor(config: PaynowConfig) {
    this.config = config;
    this.paynow = new Paynow(config.integrationId, config.integrationKey);
    this.paynow.resultUrl = config.resultUrl;
    this.paynow.returnUrl = config.returnUrl;
  }

  /**
   * Create a payment request
   */
  async createPayment(
    request: PaymentRequest
  ): Promise<PaymentInitiationResponse> {
    try {
      const payment = this.paynow.createPayment(request.reference, request.email);

      // Add item to payment
      payment.add(request.additionalInfo || "Invoice Payment", request.amount);

      let response;

      if (isMobileMoneyMethod(request.method)) {
        // Mobile money payment
        if (!request.phone) {
          return {
            success: false,
            error: "Phone number is required for mobile money payments",
          };
        }

        const provider = getMobileProviderCode(request.method);
        response = await this.paynow.sendMobile(
          payment,
          request.phone,
          provider
        );
      } else {
        // Web payment (card, etc.)
        console.log(`[Paynow] Sending web payment: reference=${request.reference}, amount=${request.amount}`);
        console.log(`[Paynow] Integration ID: ${this.config.integrationId}`);
        response = await this.paynow.send(payment);
      }

      if (!response.success) {
        return {
          success: false,
          error: response.error || "Payment initiation failed",
        };
      }

      return {
        success: true,
        redirectUrl: response.redirectUrl,
        pollUrl: response.pollUrl,
        instructions: response.instructions,
      };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown payment error";
      console.error(`[Paynow] Payment creation failed: ${message}`, error);
      
      // Provide helpful error message for hash mismatch
      if (message.includes('Hashes do not match')) {
        const helpMessage = `Paynow integration key mismatch. Please verify:
        1. Integration ID in .env: ${this.config.integrationId}
        2. Make sure you're using the correct Paynow credentials from https://www.paynow.co.zw
        3. Check that integration ID and key match your Paynow account
        4. If using sandbox/test mode, ensure credentials are from test environment`;
        console.error(helpMessage);
        return {
          success: false,
          error: `Payment initiation failed: ${message}. Check server logs for configuration issues.`,
        };
      }
      
      return {
        success: false,
        error: message,
      };
    }
  }

  /**
   * Check payment status by polling URL
   */
  async checkStatus(pollUrl: string): Promise<PaymentStatusResponse> {
    try {
      const status = await this.paynow.pollTransaction(pollUrl);

      return {
        status: status.status as PaynowStatus,
        amount: typeof status.amount === "number" ? status.amount : parseFloat(String(status.amount ?? "0")),
        reference: status.reference ?? "",
        providerReference: status.paynowReference,
      };
    } catch (error) {
      throw new Error(
        `Failed to check payment status: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  /**
   * Check if a status indicates a successful payment
   */
  static isSuccessStatus(status: PaynowStatus): boolean {
    return ["Paid", "Awaiting Delivery", "Delivered"].includes(status);
  }

  /**
   * Check if a status indicates a failed payment
   */
  static isFailedStatus(status: PaynowStatus): boolean {
    return ["Failed", "Cancelled", "Disputed", "Refunded"].includes(status);
  }

  /**
   * Check if a status indicates a pending payment
   */
  static isPendingStatus(status: PaynowStatus): boolean {
    return ["Created", "Sent", "Pending"].includes(status);
  }
}

/**
 * Create a Paynow service instance from environment variables
 */
export function createPaynowService(): PaynowService {
  const config: PaynowConfig = {
    integrationId: process.env.PAYNOW_INTEGRATION_ID || "",
    integrationKey: process.env.PAYNOW_INTEGRATION_KEY || "",
    resultUrl:
      process.env.PAYNOW_RESULT_URL || "http://localhost:3001/webhooks/paynow",
    returnUrl:
      process.env.PAYNOW_RETURN_URL || "http://localhost:3000/payment/complete",
  };

  if (!config.integrationId || !config.integrationKey) {
    throw new Error("Paynow integration credentials not configured");
  }

  return new PaynowService(config);
}
