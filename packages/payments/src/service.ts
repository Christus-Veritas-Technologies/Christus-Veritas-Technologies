import { prisma, type PaymentMethod, type PaymentStatus } from "@repo/db";
import { PaynowService } from "./paynow";
import type { PaymentRequest, PaymentInitiationResponse } from "./types";
import { centsToDollars, dollarsToCents } from "./utils";

/**
 * High-level payment service for managing payments
 */
export class PaymentService {
  constructor(private paynow: PaynowService) {}

  /**
   * Initiate a payment for an invoice
   */
  async initiatePayment(
    invoiceId: string,
    method: PaymentMethod,
    phone?: string
  ): Promise<{ paymentId: string; response: PaymentInitiationResponse }> {
    // Get invoice details
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: {
        billingAccount: {
          include: {
            organization: true,
          },
        },
      },
    });

    if (!invoice) {
      throw new Error("Invoice not found");
    }

    if (!["ISSUED", "OVERDUE", "PARTIAL"].includes(invoice.status)) {
      throw new Error("Invoice cannot be paid in current status");
    }

    if (invoice.amountDue <= 0) {
      throw new Error("Invoice has no amount due");
    }

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        billingAccountId: invoice.billingAccountId,
        invoiceId: invoice.id,
        amount: invoice.amountDue,
        method,
        status: "PENDING",
      },
    });

    // Initiate with Paynow
    const request: PaymentRequest = {
      reference: payment.id,
      amount: centsToDollars(invoice.amountDue),
      email: invoice.billingAccount.organization.email,
      method,
      phone,
      additionalInfo: `Payment for Invoice ${invoice.invoiceNumber}`,
    };

    const response = await this.paynow.createPayment(request);

    // Update payment with external reference
    if (response.success && response.pollUrl) {
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          externalId: response.pollUrl,
        },
      });
    } else if (!response.success) {
      // Mark as failed if initiation failed
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: "FAILED",
          failedAt: new Date(),
          errorMessage: response.error,
        },
      });
    }

    return { paymentId: payment.id, response };
  }

  /**
   * Initiate a payment via payment token (public payment link)
   */
  async initiatePaymentByToken(
    paymentToken: string,
    method: PaymentMethod,
    phone?: string
  ): Promise<{ paymentId: string; response: PaymentInitiationResponse }> {
    const invoice = await prisma.invoice.findUnique({
      where: { paymentToken },
    });

    if (!invoice) {
      throw new Error("Invalid payment link");
    }

    if (
      invoice.paymentTokenExpiresAt &&
      invoice.paymentTokenExpiresAt < new Date()
    ) {
      throw new Error("Payment link has expired");
    }

    return this.initiatePayment(invoice.id, method, phone);
  }

  /**
   * Process a successful payment
   */
  async markPaymentPaid(
    paymentId: string,
    externalReference?: string
  ): Promise<void> {
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        invoice: true,
      },
    });

    if (!payment) {
      throw new Error("Payment not found");
    }

    if (payment.status === "PAID") {
      return; // Already processed
    }

    await prisma.$transaction(async (tx) => {
      // Update payment
      await tx.payment.update({
        where: { id: paymentId },
        data: {
          status: "PAID",
          completedAt: new Date(),
          externalStatus: externalReference,
        },
      });

      // Update invoice if linked
      if (payment.invoice) {
        const newAmountPaid = payment.invoice.amountPaid + payment.amount;
        const newAmountDue = payment.invoice.total - newAmountPaid;
        const newStatus: "PAID" | "PARTIAL" =
          newAmountDue <= 0 ? "PAID" : "PARTIAL";

        await tx.invoice.update({
          where: { id: payment.invoice.id },
          data: {
            amountPaid: newAmountPaid,
            amountDue: Math.max(0, newAmountDue),
            status: newStatus,
            paidAt: newStatus === "PAID" ? new Date() : null,
          },
        });

        // If fully paid, check if we should reactivate the account
        if (newStatus === "PAID") {
          // Check for other unpaid invoices
          const unpaidInvoices = await tx.invoice.count({
            where: {
              billingAccountId: payment.billingAccountId,
              status: { in: ["ISSUED", "OVERDUE", "PARTIAL"] },
            },
          });

          // If no other unpaid invoices, reactivate account
          if (unpaidInvoices === 0) {
            await tx.billingAccount.update({
              where: { id: payment.billingAccountId },
              data: { status: "ACTIVE" },
            });
          }
        }
      }

      // Create audit log
      await tx.auditLog.create({
        data: {
          actorType: "system",
          action: "payment.completed",
          entityType: "Payment",
          entityId: paymentId,
          metadata: {
            amount: payment.amount,
            invoiceId: payment.invoiceId,
          },
        },
      });
    });
  }

  /**
   * Mark a payment as failed
   */
  async markPaymentFailed(paymentId: string, reason: string): Promise<void> {
    await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: "FAILED",
        failedAt: new Date(),
        externalStatus: reason,
        errorMessage: reason,
      },
    });
  }

  /**
   * Reconcile a pending payment by checking its status
   */
  async reconcilePayment(paymentId: string): Promise<PaymentStatus> {
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
    });

    if (!payment) {
      throw new Error("Payment not found");
    }

    if (payment.status !== "PENDING") {
      return payment.status;
    }

    if (!payment.externalId) {
      throw new Error("Payment has no external reference to check");
    }

    const status = await this.paynow.checkStatus(payment.externalId);

    if (PaynowService.isSuccessStatus(status.status)) {
      await this.markPaymentPaid(paymentId, status.status);
      return "PAID";
    } else if (PaynowService.isFailedStatus(status.status)) {
      await this.markPaymentFailed(paymentId, status.status);
      return "FAILED";
    }

    // Still pending
    return "PENDING";
  }

  /**
   * Record a manual payment (cash, bank transfer)
   */
  async recordManualPayment(
    billingAccountId: string,
    invoiceId: string | null,
    amount: number,
    method: PaymentMethod,
    reference?: string
  ): Promise<string> {
    const payment = await prisma.payment.create({
      data: {
        billingAccountId,
        invoiceId,
        amount,
        method,
        status: "PAID",
        completedAt: new Date(),
        externalId: reference,
      },
    });

    // If linked to invoice, update it
    if (invoiceId) {
      await this.markPaymentPaid(payment.id);
    }

    return payment.id;
  }

  /**
   * Get pending payments for reconciliation
   */
  async getPendingPayments(olderThanMinutes: number = 5) {
    const threshold = new Date(Date.now() - olderThanMinutes * 60 * 1000);

    return prisma.payment.findMany({
      where: {
        status: "PENDING",
        initiatedAt: { lt: threshold },
        externalId: { not: null },
      },
      include: {
        invoice: true,
        billingAccount: {
          include: { organization: true },
        },
      },
    });
  }
}

/**
 * Create a payment service instance
 */
export function createPaymentService(paynow?: PaynowService): PaymentService {
  const paynowService = paynow || new PaynowService({
    integrationId: process.env.PAYNOW_INTEGRATION_ID || "",
    integrationKey: process.env.PAYNOW_INTEGRATION_KEY || "",
    resultUrl: process.env.PAYNOW_RESULT_URL || "",
    returnUrl: process.env.PAYNOW_RETURN_URL || "",
  });

  return new PaymentService(paynowService);
}
