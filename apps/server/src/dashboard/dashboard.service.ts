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
    // For now, return mock notifications
    // In a real app, this would fetch from a notifications table
    const projects = await prisma.project.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      take: 3,
      select: {
        id: true,
        title: true,
        status: true,
        quotedAt: true,
        updatedAt: true,
      },
    });

    const notifications = [];

    for (const project of projects) {
      if (project.status === 'QUOTED' && project.quotedAt) {
        notifications.push({
          id: `quote-${project.id}`,
          type: 'quote',
          title: 'Quote Ready',
          message: `Quote ready for "${project.title}"`,
          date: project.quotedAt,
          read: false,
        });
      }
    }

    return notifications;
  }
}
