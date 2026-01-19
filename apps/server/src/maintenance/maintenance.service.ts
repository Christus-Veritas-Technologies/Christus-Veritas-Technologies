import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { prisma } from '@repo/db';
import { addMonths, startOfMonth, endOfMonth, isBefore, addDays } from 'date-fns';

@Injectable()
export class MaintenanceService {
  // Create or update maintenance contract for a project
  async createOrUpdateMaintenance(projectId: string, monthlyFee: number, startDate?: Date) {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const now = new Date();
    const periodStart = startDate || startOfMonth(now);
    const periodEnd = endOfMonth(periodStart);

    const existingMaintenance = await prisma.maintenance.findUnique({
      where: { projectId },
    });

    if (existingMaintenance) {
      return prisma.maintenance.update({
        where: { projectId },
        data: {
          monthlyFee,
          isActive: true,
          updatedAt: now,
        },
        include: {
          project: {
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

    return prisma.maintenance.create({
      data: {
        projectId,
        monthlyFee,
        isActive: true,
        currentPeriodStart: periodStart,
        currentPeriodEnd: periodEnd,
        isPaidForCurrentMonth: false,
      },
      include: {
        project: {
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

  // Get all active maintenance contracts (Admin)
  async getAllMaintenance(includeInactive = false) {
    const where = includeInactive ? {} : { isActive: true };

    return prisma.maintenance.findMany({
      where,
      include: {
        project: {
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
      orderBy: [
        { isPaidForCurrentMonth: 'asc' }, // Unpaid first
        { currentPeriodEnd: 'asc' }, // Soonest due first
      ],
    });
  }

  // Get maintenance for a specific user (Client)
  async getUserMaintenance(userId: string) {
    return prisma.maintenance.findMany({
      where: {
        project: {
          userId,
        },
        isActive: true,
      },
      include: {
        project: true,
      },
      orderBy: {
        currentPeriodEnd: 'asc',
      },
    });
  }

  // Get a single maintenance record
  async getMaintenance(maintenanceId: string) {
    const maintenance = await prisma.maintenance.findUnique({
      where: { id: maintenanceId },
      include: {
        project: {
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

    if (!maintenance) {
      throw new NotFoundException('Maintenance contract not found');
    }

    return maintenance;
  }

  // Mark cash payment as received (Admin only)
  async confirmCashPayment(maintenanceId: string, adminId: string) {
    const maintenance = await this.getMaintenance(maintenanceId);

    if (!maintenance.paidInCash) {
      throw new BadRequestException('Payment was not marked as cash');
    }

    if (maintenance.cashConfirmed) {
      throw new BadRequestException('Cash payment already confirmed');
    }

    const updated = await prisma.maintenance.update({
      where: { id: maintenanceId },
      data: {
        cashConfirmed: true,
        cashConfirmedAt: new Date(),
        cashConfirmedBy: adminId,
        isPaidForCurrentMonth: true,
        paidAt: new Date(),
      },
      include: {
        project: {
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

    return updated;
  }

  // Mark as paid (cash pending confirmation)
  async markPaidInCash(maintenanceId: string, userId: string) {
    const maintenance = await this.getMaintenance(maintenanceId);

    // Verify user owns this project
    if (maintenance.project.userId !== userId) {
      throw new BadRequestException('Unauthorized');
    }

    return prisma.maintenance.update({
      where: { id: maintenanceId },
      data: {
        paidInCash: true,
        cashConfirmed: false,
      },
      include: {
        project: true,
      },
    });
  }

  // Mark as paid via Paynow
  async markPaidViaPaynow(maintenanceId: string, userId: string) {
    const maintenance = await this.getMaintenance(maintenanceId);

    // Verify user owns this project
    if (maintenance.project.userId !== userId) {
      throw new BadRequestException('Unauthorized');
    }

    return prisma.maintenance.update({
      where: { id: maintenanceId },
      data: {
        paidInCash: false,
        cashConfirmed: false,
        isPaidForCurrentMonth: true,
        paidAt: new Date(),
      },
      include: {
        project: true,
      },
    });
  }

  // Advance to next billing period
  async advanceToNextPeriod(maintenanceId: string) {
    const maintenance = await this.getMaintenance(maintenanceId);

    const nextPeriodStart = addMonths(maintenance.currentPeriodStart, 1);
    const nextPeriodEnd = endOfMonth(nextPeriodStart);

    return prisma.maintenance.update({
      where: { id: maintenanceId },
      data: {
        currentPeriodStart: nextPeriodStart,
        currentPeriodEnd: nextPeriodEnd,
        isPaidForCurrentMonth: false,
        paidInCash: false,
        cashConfirmed: false,
        cashConfirmedAt: null,
        cashConfirmedBy: null,
        paidAt: null,
        reminderCount: 0,
        lastReminderSent: null,
      },
      include: {
        project: {
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

  // Get overdue maintenance contracts
  async getOverdueMaintenance() {
    const now = new Date();

    return prisma.maintenance.findMany({
      where: {
        isActive: true,
        isPaidForCurrentMonth: false,
        currentPeriodEnd: {
          lt: now,
        },
      },
      include: {
        project: {
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
      orderBy: {
        currentPeriodEnd: 'asc',
      },
    });
  }

  // Get maintenance contracts due soon (within X days)
  async getMaintenanceDueSoon(daysThreshold = 7) {
    const now = new Date();
    const threshold = addDays(now, daysThreshold);

    return prisma.maintenance.findMany({
      where: {
        isActive: true,
        isPaidForCurrentMonth: false,
        currentPeriodEnd: {
          gte: now,
          lte: threshold,
        },
      },
      include: {
        project: {
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
      orderBy: {
        currentPeriodEnd: 'asc',
      },
    });
  }

  // Update reminder sent
  async updateReminderSent(maintenanceId: string) {
    const maintenance = await this.getMaintenance(maintenanceId);

    return prisma.maintenance.update({
      where: { id: maintenanceId },
      data: {
        lastReminderSent: new Date(),
        reminderCount: maintenance.reminderCount + 1,
      },
    });
  }

  // Deactivate maintenance contract
  async deactivateMaintenance(maintenanceId: string, endDate?: Date) {
    return prisma.maintenance.update({
      where: { id: maintenanceId },
      data: {
        isActive: false,
        endDate: endDate || new Date(),
      },
      include: {
        project: {
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

  // Add notes
  async addNotes(maintenanceId: string, notes: string) {
    return prisma.maintenance.update({
      where: { id: maintenanceId },
      data: { notes },
      include: {
        project: {
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
}
