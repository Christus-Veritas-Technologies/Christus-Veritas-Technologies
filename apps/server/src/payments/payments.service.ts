import { Injectable, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import { prisma, PaymentStatus, ClientServiceStatus } from '@repo/db';
import { PaynowService, createPaynowService } from '@repo/payments';
import { InitiatePaymentDto, PaymentItemType, PaynowCallbackDto } from './dto/payment.dto';

interface PaymentResult {
  success: boolean;
  redirectUrl?: string;
  pollUrl?: string;
  paymentId?: string;
  error?: string;
}

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  private paynow: PaynowService;

  constructor() {
    this.paynow = createPaynowService();
  }

  /**
   * Initiate a payment for a service or product
   */
  async initiatePayment(userId: string, dto: InitiatePaymentDto): Promise<PaymentResult> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { billingAccount: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Get item details based on type
    let itemName: string;
    let itemDescription: string;

    if (dto.itemType === PaymentItemType.SERVICE) {
      const service = await prisma.marketplaceService.findUnique({
        where: { id: dto.itemId },
      });
      if (!service) {
        throw new NotFoundException('Service not found');
      }
      itemName = service.name;
      itemDescription = `${service.name} - ${service.description || 'Service subscription'}`;
    } else {
      const product = await prisma.product.findUnique({
        where: { id: dto.itemId },
      });
      if (!product) {
        throw new NotFoundException('Product not found');
      }
      itemName = product.name;
      itemDescription = `${product.name} - ${product.description || 'Product purchase'}`;
    }

    // Generate unique reference
    const reference = `CVT-${Date.now()}-${userId.slice(-6)}`;

    // Create pending payment record
    const payment = await prisma.payment.create({
      data: {
        billingAccountId: user.billingAccount?.id || '',
        amount: Math.round(dto.amount * 100), // Store in cents
        currency: 'USD',
        method: 'PAYNOW_VISA', // Default, can be changed based on actual payment method
        status: PaymentStatus.PENDING,
        externalId: reference,
      },
    });

    // Create order record to track the item being purchased
    await prisma.order.create({
      data: {
        userId,
        itemType: dto.itemType,
        itemId: dto.itemId,
        quantity: dto.quantity || 1,
        amount: Math.round(dto.amount * 100),
        paymentId: payment.id,
        reference,
        status: 'PENDING',
      },
    });

    // Initiate Paynow payment
    const paynowResult = await this.paynow.createPayment({
      reference,
      email: user.email,
      amount: dto.amount,
      method: 'WEB', // Web-based transaction
      additionalInfo: itemDescription,
    });

    if (!paynowResult.success) {
      // Update payment status to failed
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: PaymentStatus.FAILED,
          errorMessage: paynowResult.error,
          failedAt: new Date(),
        },
      });

      return {
        success: false,
        error: paynowResult.error || 'Failed to initiate payment',
      };
    }

    // Store poll URL for status checking
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        externalStatus: paynowResult.pollUrl,
      },
    });

    this.logger.log(`Payment initiated: ${reference} - Redirect: ${paynowResult.redirectUrl}`);

    return {
      success: true,
      redirectUrl: paynowResult.redirectUrl,
      pollUrl: paynowResult.pollUrl,
      paymentId: payment.id,
    };
  }

  /**
   * Handle Paynow callback (webhook)
   */
  async handlePaynowCallback(data: PaynowCallbackDto): Promise<void> {
    this.logger.log(`Received Paynow callback: ${JSON.stringify(data)}`);

    const reference = data.reference;
    if (!reference) {
      this.logger.warn('Callback received without reference');
      return;
    }

    // Find the payment by reference
    const payment = await prisma.payment.findFirst({
      where: { externalId: reference },
    });

    if (!payment) {
      this.logger.warn(`Payment not found for reference: ${reference}`);
      return;
    }

    // Update payment based on status
    const status = data.status?.toLowerCase();

    if (status === 'paid' || status === 'awaiting delivery' || status === 'delivered') {
      await this.markPaymentSuccess(payment.id, data.paynowreference);
    } else if (status === 'failed' || status === 'cancelled') {
      await this.markPaymentFailed(payment.id, `Payment ${status}`);
    }
  }

  /**
   * Check payment status by poll URL
   */
  async checkPaymentStatus(pollUrl: string): Promise<{
    status: string;
    paid: boolean;
    amount?: number;
    reference?: string;
  }> {
    const statusResult = await this.paynow.checkStatus(pollUrl);

    return {
      status: statusResult.status,
      paid: PaynowService.isSuccessStatus(statusResult.status),
      amount: statusResult.amount,
      reference: statusResult.reference,
    };
  }

  /**
   * Mark payment as successful and provision the service
   */
  private async markPaymentSuccess(paymentId: string, paynowReference?: string): Promise<void> {
    const payment = await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: PaymentStatus.PAID,
        externalId: paynowReference || undefined,
        completedAt: new Date(),
      },
    });

    // Find the associated order
    const order = await prisma.order.findFirst({
      where: { paymentId: payment.id },
    });

    if (!order) {
      this.logger.warn(`No order found for payment: ${paymentId}`);
      return;
    }

    // Update order status
    await prisma.order.update({
      where: { id: order.id },
      data: { status: 'COMPLETED' },
    });

    // Provision the service if it's a service purchase
    if (order.itemType === PaymentItemType.SERVICE) {
      await this.provisionService(order.userId, order.itemId, order.quantity);
    }

    this.logger.log(`Payment ${paymentId} marked as successful, order ${order.id} completed`);
  }

  /**
   * Mark payment as failed
   */
  private async markPaymentFailed(paymentId: string, errorMessage: string): Promise<void> {
    await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: PaymentStatus.FAILED,
        errorMessage,
        failedAt: new Date(),
      },
    });

    // Update associated order
    const order = await prisma.order.findFirst({
      where: { paymentId },
    });

    if (order) {
      await prisma.order.update({
        where: { id: order.id },
        data: { status: 'FAILED' },
      });
    }

    this.logger.log(`Payment ${paymentId} marked as failed: ${errorMessage}`);
  }

  /**
   * Provision a service for a user after successful payment
   */
  private async provisionService(userId: string, serviceId: string, units: number): Promise<void> {
    // Get the service definition from marketplace service
    const marketplaceService = await prisma.marketplaceService.findUnique({
      where: { id: serviceId },
    });

    if (!marketplaceService) {
      this.logger.warn(`Marketplace service not found: ${serviceId}`);
      return;
    }

    // Find or create the corresponding service definition
    let serviceDefinition = await prisma.serviceDefinition.findFirst({
      where: { name: marketplaceService.name },
    });

    if (!serviceDefinition) {
      serviceDefinition = await prisma.serviceDefinition.create({
        data: {
          name: marketplaceService.name,
          description: marketplaceService.description,
          oneOffPrice: marketplaceService.price,
          recurringPrice: marketplaceService.price,
          billingCycleDays: 30,
        },
      });
    }

    // Create client service
    await prisma.clientService.create({
      data: {
        userId,
        serviceDefinitionId: serviceDefinition.id,
        units,
        status: ClientServiceStatus.ACTIVE,
        oneOffPricePaid: true,
        enableRecurring: true,
        nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    this.logger.log(`Service ${marketplaceService.name} provisioned for user ${userId}`);
  }

  /**
   * Get user's payment history
   */
  async getPaymentHistory(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { billingAccount: true },
    });

    if (!user?.billingAccount) {
      return [];
    }

    return prisma.payment.findMany({
      where: { billingAccountId: user.billingAccount.id },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  /**
   * Get payment by ID
   */
  async getPayment(paymentId: string) {
    return prisma.payment.findUnique({
      where: { id: paymentId },
    });
  }
}
