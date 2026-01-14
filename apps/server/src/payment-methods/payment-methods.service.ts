import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaClient, SavedPaymentMethodType } from '@repo/db';

const prisma = new PrismaClient();

export interface CreateCardPaymentMethodDto {
  cardLast4: string;
  cardBrand: 'VISA' | 'MASTERCARD';
  cardExpMonth: number;
  cardExpYear: number;
  cardHolderName: string;
  nickname?: string;
  isDefault?: boolean;
}

export interface CreateMobileMoneyPaymentMethodDto {
  mobileNumber: string;
  mobileProvider: 'ECOCASH' | 'ONEMONEY' | 'INNBUCKS';
  nickname?: string;
  isDefault?: boolean;
}

@Injectable()
export class PaymentMethodsService {
  async getPaymentMethods(userId: string) {
    return prisma.savedPaymentMethod.findMany({
      where: { userId },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    });
  }

  async createCardPaymentMethod(userId: string, dto: CreateCardPaymentMethodDto) {
    // Validate card last 4 digits
    if (!/^\d{4}$/.test(dto.cardLast4)) {
      throw new BadRequestException('Card last 4 digits must be exactly 4 numbers');
    }

    // Validate expiry
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    if (dto.cardExpYear < currentYear || (dto.cardExpYear === currentYear && dto.cardExpMonth < currentMonth)) {
      throw new BadRequestException('Card has expired');
    }

    // If this should be default, unset other defaults
    if (dto.isDefault) {
      await prisma.savedPaymentMethod.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    return prisma.savedPaymentMethod.create({
      data: {
        userId,
        type: SavedPaymentMethodType.CARD,
        cardLast4: dto.cardLast4,
        cardBrand: dto.cardBrand,
        cardExpMonth: dto.cardExpMonth,
        cardExpYear: dto.cardExpYear,
        cardHolderName: dto.cardHolderName,
        nickname: dto.nickname || `${dto.cardBrand} •••• ${dto.cardLast4}`,
        isDefault: dto.isDefault || false,
      },
    });
  }

  async createMobileMoneyPaymentMethod(userId: string, dto: CreateMobileMoneyPaymentMethodDto) {
    // Validate Zimbabwe phone number (07xxxxxxxx or +2637xxxxxxxx)
    const phoneRegex = /^(\+263|0)7[0-9]{8}$/;
    if (!phoneRegex.test(dto.mobileNumber)) {
      throw new BadRequestException('Invalid Zimbabwe phone number format');
    }

    // Normalize phone number to +263 format
    let normalizedNumber = dto.mobileNumber;
    if (dto.mobileNumber.startsWith('0')) {
      normalizedNumber = '+263' + dto.mobileNumber.slice(1);
    }

    // If this should be default, unset other defaults
    if (dto.isDefault) {
      await prisma.savedPaymentMethod.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    return prisma.savedPaymentMethod.create({
      data: {
        userId,
        type: SavedPaymentMethodType.MOBILE_MONEY,
        mobileNumber: normalizedNumber,
        mobileProvider: dto.mobileProvider,
        nickname: dto.nickname || `${dto.mobileProvider} ${normalizedNumber.slice(-4)}`,
        isDefault: dto.isDefault || false,
      },
    });
  }

  async deletePaymentMethod(userId: string, paymentMethodId: string) {
    const paymentMethod = await prisma.savedPaymentMethod.findFirst({
      where: { id: paymentMethodId, userId },
    });

    if (!paymentMethod) {
      throw new NotFoundException('Payment method not found');
    }

    await prisma.savedPaymentMethod.delete({
      where: { id: paymentMethodId },
    });

    return { success: true };
  }

  async setDefaultPaymentMethod(userId: string, paymentMethodId: string) {
    const paymentMethod = await prisma.savedPaymentMethod.findFirst({
      where: { id: paymentMethodId, userId },
    });

    if (!paymentMethod) {
      throw new NotFoundException('Payment method not found');
    }

    // Unset all other defaults
    await prisma.savedPaymentMethod.updateMany({
      where: { userId, isDefault: true },
      data: { isDefault: false },
    });

    // Set this one as default
    return prisma.savedPaymentMethod.update({
      where: { id: paymentMethodId },
      data: { isDefault: true },
    });
  }
}
