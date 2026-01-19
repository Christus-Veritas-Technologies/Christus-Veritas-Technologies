import { Injectable, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import { prisma, PaymentStatus, ClientServiceStatus, PaymentMethod } from '@repo/db';
import { PaynowService, createPaynowService } from '@repo/payments';
import { InitiatePaymentDto, PaymentItemType, PaynowCallbackDto } from './dto/payment.dto';
import { EmailService } from '../email/email.service';

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

  constructor(private readonly emailService: EmailService) {
    this.paynow = createPaynowService();
  }

  /**
   * Initiate a payment for a service, product, or package
   */
  async initiatePayment(userId: string, dto: InitiatePaymentDto): Promise<PaymentResult> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Get item details based on type
    let itemName: string;
    let itemDescription: string;

    switch (dto.itemType) {
      case PaymentItemType.SERVICE: {
        const service = await prisma.clientService.findUnique({
          where: { id: dto.itemId },
          include: { serviceDefinition: true },
        });
        if (!service) {
          throw new NotFoundException('Service not found');
        }
        itemName = service.serviceDefinition.name;
        itemDescription = `${service.serviceDefinition.name} - Service subscription`;
        break;
      }

      case PaymentItemType.PRODUCT: {
        const product = await prisma.product.findUnique({
          where: { id: dto.itemId },
        });
        if (!product) {
          throw new NotFoundException('Product not found');
        }
        itemName = product.name;
        itemDescription = `${product.name} - ${product.description || 'Product purchase'}`;
        break;
      }

      case PaymentItemType.PACKAGE: {
        const pkg = await prisma.package.findUnique({
          where: { id: dto.itemId },
          include: {
            variants: {
              where: { isDefault: true },
              take: 1,
            },
          },
        });
        if (!pkg) {
          throw new NotFoundException('Package not found');
        }
        itemName = pkg.name;
        itemDescription = `${pkg.name} - ${pkg.description || 'Package purchase'}`;
        break;
      }

      default:
        throw new BadRequestException('Invalid item type');
    }

    // Generate unique reference
    const reference = `CVT-${Date.now()}-${userId.slice(-6)}`;

    // Create pending payment record
    const payment = await prisma.payment.create({
      data: {
        billingAccountId: null, // User may not have billing account yet
        amount: Math.round(dto.amount * 100), // Store in cents
        currency: 'USD',
        method: PaymentMethod.PAYNOW_VISA, // Default, can be changed based on actual payment method
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

    // Initiate Paynow payment with custom return URL that includes payment parameters
    const baseReturnUrl = process.env.PAYNOW_RETURN_URL || 'http://localhost:3000/payment/complete';
    const customReturnUrl = `${baseReturnUrl}?paymentId=${payment.id}`;

    const paynowResult = await this.paynow.createPayment({
      reference,
      email: user.email,
      amount: dto.amount,
      method: PaymentMethod.PAYNOW_VISA, // Web-based transaction
      additionalInfo: itemDescription,
      returnUrl: customReturnUrl,
    } as any);

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

    // Provision based on item type
    if (order.itemType === PaymentItemType.SERVICE) {
      await this.provisionService(order.userId, order.itemId, order.quantity);
    } else if (order.itemType === PaymentItemType.PRODUCT) {
      await this.handleProductPurchase(order.userId, order.itemId, order.quantity);
    } else if (order.itemType === PaymentItemType.PACKAGE) {
      await this.handlePackagePurchase(order.userId, order.itemId);
    }

    // Send payment receipt email
    await this.sendPaymentReceipt(order.userId, payment.id, order);

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
    // The serviceId here is the ClientService ID that was already created
    // We just need to mark it as paid
    const clientService = await prisma.clientService.findUnique({
      where: { id: serviceId },
      include: { serviceDefinition: true },
    });

    if (!clientService) {
      this.logger.warn(`Client service not found: ${serviceId}`);
      return;
    }

    // Mark one-off payment as completed
    await prisma.clientService.update({
      where: { id: serviceId },
      data: {
        oneOffPricePaid: true,
        status: ClientServiceStatus.ACTIVE,
      },
    });

    this.logger.log(`Service ${clientService.serviceDefinition.name} payment completed for user ${userId}`);
  }

  /**
   * Handle product purchase after successful payment
   */
  private async handleProductPurchase(userId: string, productId: string, quantity: number): Promise<void> {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      this.logger.warn(`Product not found: ${productId}`);
      return;
    }

    // Create a notification for the product purchase
    await prisma.notification.create({
      data: {
        userId,
        type: 'PAYMENT',
        title: 'Product Purchased',
        message: `Your purchase of ${quantity}x ${product.name} has been completed successfully.`,
      },
    });

    this.logger.log(`Product ${product.name} purchased by user ${userId}, quantity: ${quantity}`);
  }

  /**
   * Handle package purchase after successful payment
   */
  private async handlePackagePurchase(userId: string, packageId: string): Promise<void> {
    const pkg = await prisma.package.findUnique({
      where: { id: packageId },
      include: {
        variants: {
          where: { isDefault: true },
          take: 1,
          include: {
            items: {
              include: {
                product: true,
              },
            },
          },
        },
      },
    });

    if (!pkg || !pkg.variants[0]) {
      this.logger.warn(`Package not found: ${packageId}`);
      return;
    }

    const variant = pkg.variants[0];

    // Create notification for package purchase
    await prisma.notification.create({
      data: {
        userId,
        type: 'PAYMENT',
        title: 'Package Purchased',
        message: `Your purchase of ${pkg.name} has been completed successfully. You will receive your items shortly.`,
      },
    });

    this.logger.log(`Package ${pkg.name} purchased by user ${userId}`);
  }

  /**
   * Send payment receipt email
   */
  private async sendPaymentReceipt(userId: string, paymentId: string, order: any): Promise<void> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        this.logger.warn(`User not found for payment receipt: ${userId}`);
        return;
      }

      const payment = await prisma.payment.findUnique({
        where: { id: paymentId },
      });

      if (!payment) {
        return;
      }

      const amount = (payment.amount / 100).toFixed(2);
      const itemTypeLabel = order.itemType.toLowerCase();

      await this.emailService.sendEmail({
        to: user.email,
        subject: `Payment Receipt - ${order.reference}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Payment Successful</h2>
            <p>Dear ${user.name},</p>
            <p>Your payment has been processed successfully.</p>
            
            <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0;">Payment Details</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0;"><strong>Reference:</strong></td>
                  <td style="padding: 8px 0; text-align: right;">${order.reference}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0;"><strong>Type:</strong></td>
                  <td style="padding: 8px 0; text-align: right;">${itemTypeLabel}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0;"><strong>Quantity:</strong></td>
                  <td style="padding: 8px 0; text-align: right;">${order.quantity}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-top: 2px solid #ddd;"><strong>Amount:</strong></td>
                  <td style="padding: 8px 0; text-align: right; border-top: 2px solid #ddd;"><strong>$${amount}</strong></td>
                </tr>
              </table>
            </div>

            <p>Thank you for your purchase!</p>
            
            <p style="color: #666; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
              If you have any questions, please contact us at support@christusveritastechnologies.com
            </p>
          </div>
        `,
      });

      this.logger.log(`Payment receipt sent to ${user.email} for order ${order.reference}`);
    } catch (error) {
      this.logger.error(`Failed to send payment receipt: ${error}`);
      // Don't throw - email failure shouldn't break the payment flow
    }
  }

  /**
   * Get user's payment history
   */
  async getPaymentHistory(userId: string) {
    // For now, return all payments created for this user
    // In the future, can be expanded to use billing accounts
    return prisma.payment.findMany({
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
