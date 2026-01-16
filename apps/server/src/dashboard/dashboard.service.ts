import { Injectable } from '@nestjs/common';
import { prisma } from '@repo/db';

@Injectable()
export class DashboardService {
  async getUserDashboardStats(userId: string) {
    // Get user's organization membership if any
    const membership = await prisma.organizationMember.findFirst({
      where: { userId },
      include: {
        organization: {
          include: {
            billingAccount: {
              include: {
                invoices: {
                  where: {
                    status: { in: ['ISSUED', 'OVERDUE', 'PARTIAL'] }
                  },
                  orderBy: { createdAt: 'desc' },
                  take: 5,
                },
              },
            },
          },
        },
      },
    });

    // Get user info
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true },
    });

    // Get project stats
    const projects = await prisma.project.findMany({
      where: { userId },
      select: { status: true, quotedPrice: true, completedAt: true },
    });

    // Get services
    const services = await prisma.clientService.findMany({
      where: { userId },
      include: {
        serviceDefinition: true,
      },
    });

    // Calculate stats
    const activeProjects = projects.filter(p => 
      ['PENDING', 'QUOTED', 'ACCEPTED', 'IN_PROGRESS', 'ON_HOLD'].includes(p.status)
    ).length;

    const completedProjects = projects.filter(p => p.status === 'COMPLETED').length;
    
    const pendingQuotes = projects.filter(p => p.status === 'QUOTED').length;

    // Calculate total spent from completed projects
    const totalSpent = projects
      .filter(p => p.status === 'COMPLETED' && p.quotedPrice)
      .reduce((sum, p) => sum + (p.quotedPrice || 0), 0);

    // Get billing info
    const billingAccount = membership?.organization?.billingAccount;
    const currentBalance = billingAccount?.balance ? Number(billingAccount.balance) : 0;
    const accountStatus = billingAccount?.status || 'ACTIVE';

    // Get pending invoices
    const pendingInvoices = billingAccount?.invoices?.filter(i => 
      ['ISSUED', 'OVERDUE', 'PARTIAL'].includes(i.status)
    ) || [];

    // Calculate next invoice date (30 days from last invoice or now)
    const lastInvoice = billingAccount?.invoices?.[0];
    const nextInvoiceDate = lastInvoice 
      ? new Date(new Date(lastInvoice.periodEnd).getTime() + 30 * 24 * 60 * 60 * 1000)
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    return {
      user: {
        id: user?.id,
        name: user?.name,
        email: user?.email,
      },
      organization: membership?.organization ? {
        id: membership.organization.id,
        name: membership.organization.name,
      } : null,
      stats: {
        activeProjects,
        completedProjects,
        pendingQuotes,
        totalSpent,
        activeServices: services.filter(s => s.status === 'ACTIVE').length,
        pendingInvoices: pendingInvoices.length,
      },
      billing: {
        status: accountStatus,
        currentBalance: currentBalance * 100, // Convert to cents
        nextInvoiceDate: nextInvoiceDate.toISOString(),
      },
      recentInvoices: pendingInvoices.map(inv => ({
        id: inv.id,
        invoiceNumber: inv.invoiceNumber,
        total: inv.total,
        amountDue: inv.amountDue,
        status: inv.status,
        dueAt: inv.dueAt,
      })),
    };
  }

  async getRecentNotifications(userId: string) {
    // Fetch real notifications from the database
    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    return notifications.map(n => ({
      id: n.id,
      type: n.type.toLowerCase(),
      title: n.title,
      message: n.message,
      read: n.read,
      createdAt: n.createdAt.toISOString(),
      entityType: n.entityType,
      entityId: n.entityId,
    }));
  }

  // Helper method to create notifications
  async createNotification(data: {
    userId: string;
    type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR' | 'PAYMENT' | 'INVOICE' | 'PROJECT' | 'SERVICE' | 'SYSTEM';
    title: string;
    message: string;
    entityType?: string;
    entityId?: string;
  }) {
    return prisma.notification.create({
      data: {
        userId: data.userId,
        type: data.type,
        title: data.title,
        message: data.message,
        entityType: data.entityType,
        entityId: data.entityId,
      },
    });
  }

  // Mark notification as read
  async markNotificationRead(userId: string, notificationId: string) {
    return prisma.notification.updateMany({
      where: {
        id: notificationId,
        userId, // Ensure user can only mark their own notifications
      },
      data: { read: true },
    });
  }

  // Mark all notifications as read
  async markAllNotificationsRead(userId: string) {
    return prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true },
    });
  }

  async getUserInvoices(userId: string) {
    // Get user's organization to find billing account
    const membership = await prisma.organizationMember.findFirst({
      where: { userId },
      include: {
        organization: {
          include: {
            billingAccount: {
              include: {
                invoices: {
                  orderBy: { createdAt: 'desc' },
                  include: {
                    lineItems: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const invoices = membership?.organization?.billingAccount?.invoices || [];

    return invoices.map(inv => ({
      id: inv.id,
      invoiceNumber: inv.invoiceNumber,
      amount: inv.total,
      status: inv.status,
      dueDate: inv.dueAt?.toISOString(),
      paidAt: inv.paidAt?.toISOString(),
      createdAt: inv.createdAt.toISOString(),
      items: inv.lineItems.map((item: { description: string; quantity: number; unitPrice: number; total: number }) => ({
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: item.total,
      })),
    }));
  }

  async getUserPayments(userId: string) {
    // Get user's organization to find billing account
    const membership = await prisma.organizationMember.findFirst({
      where: { userId },
      include: {
        organization: {
          include: {
            billingAccount: {
              include: {
                payments: {
                  orderBy: { createdAt: 'desc' },
                  include: {
                    invoice: {
                      select: {
                        id: true,
                        invoiceNumber: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    const payments = membership?.organization?.billingAccount?.payments || [];

    return payments.map(payment => ({
      id: payment.id,
      amount: payment.amount,
      method: payment.method,
      status: payment.status,
      externalId: payment.externalId,
      createdAt: payment.createdAt.toISOString(),
      invoice: payment.invoice ? {
        id: payment.invoice.id,
        invoiceNumber: payment.invoice.invoiceNumber,
      } : null,
    }));
  }

  async getUserUsageStats(userId: string) {
    // Get user's organization membership
    const membership = await prisma.organizationMember.findFirst({
      where: { userId },
      include: {
        organization: {
          include: {
            billingAccount: {
              include: {
                invoices: {
                  where: {
                    status: 'PAID',
                    createdAt: {
                      gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                    },
                  },
                },
                payments: {
                  where: {
                    status: 'PAID',
                    createdAt: {
                      gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    // Calculate current month spending from paid invoices
    const paidInvoices = membership?.organization?.billingAccount?.invoices || [];
    const currentSpent = paidInvoices.reduce((sum, inv) => sum + inv.total, 0);

    // Default budget limit of $250 (25000 cents)
    // In the future, this could be based on subscription tier or organization settings
    const budgetLimit = 25000;

    return {
      currentSpent,    // Current month spending in cents
      budgetLimit,     // Budget limit in cents
      currency: 'USD',
    };
  }
}
