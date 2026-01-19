import { Injectable } from '@nestjs/common';
import { prisma, ClientServiceStatus } from '@repo/db';
import {
  CreateServiceDefinitionDto,
  UpdateServiceDefinitionDto,
  ProvisionServiceDto,
  ConfirmCashPaymentDto,
} from './dto/service.dto';

@Injectable()
export class ServiceService {
  // Service Definitions CRUD
  async createServiceDefinition(dto: CreateServiceDefinitionDto) {
    return prisma.serviceDefinition.create({
      data: {
        name: dto.name,
        description: dto.description,
        oneOffPrice: dto.oneOffPrice,
        recurringPrice: dto.recurringPrice,
        recurringPricePerUnit: dto.recurringPricePerUnit,
        billingCycleDays: dto.billingCycleDays,
      },
    });
  }

  async getServiceDefinitions(includeInactive = false) {
    return prisma.serviceDefinition.findMany({
      where: includeInactive ? {} : { isActive: true },
      include: {
        _count: {
          select: { clientServices: true },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async getServiceDefinition(id: string) {
    return prisma.serviceDefinition.findUnique({
      where: { id },
      include: {
        clientServices: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                name: true,
              },
            },
          },
        },
      },
    });
  }

  async updateServiceDefinition(id: string, dto: UpdateServiceDefinitionDto) {
    return prisma.serviceDefinition.update({
      where: { id },
      data: dto,
    });
  }

  async deleteServiceDefinition(id: string) {
    // Check if there are active client services
    const activeServices = await prisma.clientService.count({
      where: {
        serviceDefinitionId: id,
        status: ClientServiceStatus.ACTIVE,
      },
    });

    if (activeServices > 0) {
      throw new Error('Cannot delete service with active clients');
    }

    return prisma.serviceDefinition.update({
      where: { id },
      data: { isActive: false },
    });
  }

  // Client Services (Provisioning)
  async provisionService(dto: ProvisionServiceDto) {
    const serviceDef = await prisma.serviceDefinition.findUnique({
      where: { id: dto.serviceDefinitionId },
    });

    if (!serviceDef) {
      throw new Error('Service definition not found');
    }

    // Calculate next billing date
    const nextBillingDate = dto.enableRecurring
      ? new Date(Date.now() + serviceDef.billingCycleDays * 24 * 60 * 60 * 1000)
      : null;

    // Determine initial status
    const needsCashConfirmation = dto.oneOffPaidInCash || dto.currentMonthPaidInCash;
    const initialStatus = needsCashConfirmation 
      ? ClientServiceStatus.PENDING_PAYMENT 
      : ClientServiceStatus.ACTIVE;

    // Use upsert to handle both new and existing subscriptions
    return prisma.clientService.upsert({
      where: {
        userId_serviceDefinitionId: {
          userId: dto.userId,
          serviceDefinitionId: dto.serviceDefinitionId,
        },
      },
      create: {
        userId: dto.userId,
        serviceDefinitionId: dto.serviceDefinitionId,
        units: dto.units,
        enableRecurring: dto.enableRecurring,
        customRecurringPrice: dto.customRecurringPrice,
        nextBillingDate,
        status: initialStatus,
        oneOffPaidInCash: dto.oneOffPaidInCash || false,
        currentMonthPaidInCash: dto.currentMonthPaidInCash || false,
      },
      update: {
        units: dto.units,
        enableRecurring: dto.enableRecurring,
        customRecurringPrice: dto.customRecurringPrice,
        nextBillingDate,
        status: initialStatus,
        oneOffPaidInCash: dto.oneOffPaidInCash || false,
        currentMonthPaidInCash: dto.currentMonthPaidInCash || false,
      },
      include: {
        serviceDefinition: true,
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });
  }

  async getClientServices(userId?: string) {
    return prisma.clientService.findMany({
      where: userId ? { userId } : {},
      include: {
        serviceDefinition: true,
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
      orderBy: { dateJoined: 'desc' },
    });
  }

  async getClientService(id: string) {
    return prisma.clientService.findUnique({
      where: { id },
      include: {
        serviceDefinition: true,
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });
  }

  async updateClientService(
    id: string,
    data: {
      units?: number;
      enableRecurring?: boolean;
      customRecurringPrice?: number;
      oneOffPricePaid?: boolean;
      status?: ClientServiceStatus;
    },
  ) {
    return prisma.clientService.update({
      where: { id },
      data,
      include: {
        serviceDefinition: true,
      },
    });
  }

  async markOneOffPaid(id: string) {
    return prisma.clientService.update({
      where: { id },
      data: { oneOffPricePaid: true },
    });
  }

  async cancelClientService(id: string) {
    return prisma.clientService.update({
      where: { id },
      data: { status: ClientServiceStatus.CANCELLED },
    });
  }

  async pauseClientService(id: string) {
    return prisma.clientService.update({
      where: { id },
      data: { status: ClientServiceStatus.SUSPENDED },
    });
  }

  async resumeClientService(id: string) {
    const service = await prisma.clientService.findUnique({
      where: { id },
      include: { serviceDefinition: true },
    });

    if (!service) {
      throw new Error('Client service not found');
    }

    const nextBillingDate = service.enableRecurring
      ? new Date(Date.now() + service.serviceDefinition.billingCycleDays * 24 * 60 * 60 * 1000)
      : null;

    return prisma.clientService.update({
      where: { id },
      data: {
        status: ClientServiceStatus.ACTIVE,
        nextBillingDate,
      },
    });
  }

  async confirmCashPayment(dto: ConfirmCashPaymentDto, adminUserId: string) {
    const now = new Date();
    const updateData: any = {};

    if (dto.paymentType === 'oneOff') {
      updateData.oneOffCashConfirmed = true;
      updateData.oneOffCashConfirmedAt = now;
      updateData.oneOffCashConfirmedBy = adminUserId;
      updateData.oneOffPricePaid = true;
    } else if (dto.paymentType === 'currentMonth') {
      updateData.currentMonthCashConfirmed = true;
      updateData.currentMonthCashConfirmedAt = now;
    }

    // If both payments are confirmed (or not needed), activate the service
    const service = await prisma.clientService.findUnique({
      where: { id: dto.clientServiceId },
      include: { serviceDefinition: true },
    });

    if (!service) {
      throw new Error('Client service not found');
    }

    const oneOffConfirmed = !service.oneOffPaidInCash || updateData.oneOffCashConfirmed;
    const currentMonthConfirmed = !service.currentMonthPaidInCash || updateData.currentMonthCashConfirmed;

    if (oneOffConfirmed && currentMonthConfirmed) {
      updateData.status = ClientServiceStatus.ACTIVE;
    }

    return prisma.clientService.update({
      where: { id: dto.clientServiceId },
      data: updateData,
      include: {
        serviceDefinition: true,
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });
  }
}
