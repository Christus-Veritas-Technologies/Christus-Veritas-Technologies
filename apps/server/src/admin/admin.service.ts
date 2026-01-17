import { Injectable } from '@nestjs/common';
import { prisma } from '@repo/db';
import { PaymentStatus, OrderStatus, ProjectStatus, ClientServiceStatus } from '@repo/db';

@Injectable()
export class AdminService {
  // ==================== DASHBOARD STATS ====================

  async getDashboardStats() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    // Get all counts in parallel
    const [
      totalUsers,
      newUsersThisMonth,
      newUsersLastMonth,
      totalOrders,
      ordersThisMonth,
      ordersLastMonth,
      completedPayments,
      paymentsThisMonth,
      paymentsLastMonth,
      activeServices,
      totalProjects,
      pendingProjects,
    ] = await Promise.all([
      // Users
      prisma.user.count(),
      prisma.user.count({
        where: { createdAt: { gte: startOfMonth } },
      }),
      prisma.user.count({
        where: { createdAt: { gte: startOfLastMonth, lte: endOfLastMonth } },
      }),
      // Orders
      prisma.order.count(),
      prisma.order.count({
        where: { createdAt: { gte: startOfMonth } },
      }),
      prisma.order.count({
        where: { createdAt: { gte: startOfLastMonth, lte: endOfLastMonth } },
      }),
      // Payments
      prisma.payment.count({
        where: { status: PaymentStatus.PAID },
      }),
      prisma.payment.count({
        where: { createdAt: { gte: startOfMonth }, status: PaymentStatus.PAID },
      }),
      prisma.payment.count({
        where: { createdAt: { gte: startOfLastMonth, lte: endOfLastMonth }, status: PaymentStatus.PAID },
      }),
      // Services
      prisma.clientService.count({
        where: { status: ClientServiceStatus.ACTIVE },
      }),
      // Projects
      prisma.project.count(),
      prisma.project.count({
        where: { status: { in: [ProjectStatus.PENDING, ProjectStatus.QUOTED] } },
      }),
    ]);

    // Calculate revenue
    const [totalRevenue, revenueThisMonth, revenueLastMonth] = await Promise.all([
      prisma.payment.aggregate({
        _sum: { amount: true },
        where: { status: PaymentStatus.PAID },
      }),
      prisma.payment.aggregate({
        _sum: { amount: true },
        where: { status: PaymentStatus.PAID, createdAt: { gte: startOfMonth } },
      }),
      prisma.payment.aggregate({
        _sum: { amount: true },
        where: { status: PaymentStatus.PAID, createdAt: { gte: startOfLastMonth, lte: endOfLastMonth } },
      }),
    ]);

    // Calculate growth percentages
    const userGrowth = newUsersLastMonth > 0 
      ? ((newUsersThisMonth - newUsersLastMonth) / newUsersLastMonth) * 100 
      : 100;
    const orderGrowth = ordersLastMonth > 0 
      ? ((ordersThisMonth - ordersLastMonth) / ordersLastMonth) * 100 
      : 100;
    const paymentGrowth = paymentsLastMonth > 0 
      ? ((paymentsThisMonth - paymentsLastMonth) / paymentsLastMonth) * 100 
      : 100;
    const revenueGrowth = (revenueLastMonth._sum.amount || 0) > 0 
      ? (((revenueThisMonth._sum.amount || 0) - (revenueLastMonth._sum.amount || 0)) / (revenueLastMonth._sum.amount || 1)) * 100 
      : 100;

    return {
      users: {
        total: totalUsers,
        thisMonth: newUsersThisMonth,
        growth: Math.round(userGrowth * 10) / 10,
      },
      orders: {
        total: totalOrders,
        thisMonth: ordersThisMonth,
        growth: Math.round(orderGrowth * 10) / 10,
      },
      payments: {
        total: completedPayments,
        thisMonth: paymentsThisMonth,
        growth: Math.round(paymentGrowth * 10) / 10,
      },
      revenue: {
        total: (totalRevenue._sum.amount || 0) / 100, // Convert from cents
        thisMonth: (revenueThisMonth._sum.amount || 0) / 100,
        growth: Math.round(revenueGrowth * 10) / 10,
      },
      services: {
        active: activeServices,
      },
      projects: {
        total: totalProjects,
        pending: pendingProjects,
      },
    };
  }

  // ==================== REVENUE ANALYTICS ====================

  async getRevenueAnalytics(period: 'week' | 'month' | 'year' = 'month') {
    const now = new Date();
    let startDate: Date;
    let groupBy: 'day' | 'week' | 'month';

    switch (period) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        groupBy = 'day';
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        groupBy = 'month';
        break;
      case 'month':
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        groupBy = 'day';
        break;
    }

    const payments = await prisma.payment.findMany({
      where: {
        status: PaymentStatus.PAID,
        completedAt: { gte: startDate },
      },
      select: {
        amount: true,
        completedAt: true,
        method: true,
      },
      orderBy: { completedAt: 'asc' },
    });

    // Group by date
    const groupedData: Record<string, { date: string; amount: number; count: number }> = {};

    payments.forEach(payment => {
      if (!payment.completedAt) return;
      
      let key: string;
      const date = payment.completedAt;
      
      if (groupBy === 'day') {
        key = date.toISOString().split('T')[0]!;
      } else if (groupBy === 'week') {
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        key = weekStart.toISOString().split('T')[0]!;
      } else {
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      }

      if (!groupedData[key]) {
        groupedData[key] = { date: key, amount: 0, count: 0 };
      }
      groupedData[key]!.amount += payment.amount / 100;
      groupedData[key]!.count += 1;
    });

    // Payment method breakdown
    const methodBreakdown: Record<string, number> = {};
    payments.forEach(payment => {
      const method = payment.method;
      methodBreakdown[method] = (methodBreakdown[method] || 0) + payment.amount / 100;
    });

    return {
      chartData: Object.values(groupedData).sort((a, b) => a.date.localeCompare(b.date)),
      methodBreakdown,
      totalRevenue: payments.reduce((sum, p) => sum + p.amount, 0) / 100,
      totalTransactions: payments.length,
    };
  }

  // ==================== USERS ====================

  async getAllUsers(options: {
    search?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  } = {}) {
    const { search, page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc' } = options;
    const skip = (page - 1) * limit;

    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { email: { contains: search, mode: 'insensitive' as const } },
            { businessName: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {};

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          name: true,
          phoneNumber: true,
          businessName: true,
          businessAddress: true,
          isAdmin: true,
          emailVerified: true,
          onboardingCompleted: true,
          image: true,
          createdAt: true,
          _count: {
            select: {
              clientServices: true,
              orders: true,
              projects: true,
            },
          },
        },
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit,
      }),
      prisma.user.count({ where }),
    ]);

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getUserDetails(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        clientServices: {
          include: {
            serviceDefinition: true,
          },
        },
        orders: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        projects: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        savedPaymentMethods: true,
        notifications: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Get payment history
    const payments = await prisma.payment.findMany({
      where: {
        billingAccount: {
          organization: {
            members: {
              some: { userId },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    return {
      ...user,
      recentPayments: payments,
    };
  }

  async updateUserAdmin(userId: string, data: { isAdmin?: boolean; name?: string }) {
    return prisma.user.update({
      where: { id: userId },
      data,
    });
  }

  // ==================== PAYMENTS ====================

  async getAllPayments(options: {
    status?: PaymentStatus;
    method?: string;
    startDate?: Date;
    endDate?: Date;
    page?: number;
    limit?: number;
  } = {}) {
    const { status, method, startDate, endDate, page = 1, limit = 20 } = options;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status) where.status = status;
    if (method) where.method = method;
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = startDate;
      if (endDate) where.createdAt.lte = endDate;
    }

    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        where,
        include: {
          invoice: {
            select: {
              invoiceNumber: true,
            },
          },
          billingAccount: {
            include: {
              organization: {
                select: {
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.payment.count({ where }),
    ]);

    return {
      payments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getPaymentDetails(paymentId: string) {
    return prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        invoice: {
          include: {
            lineItems: true,
          },
        },
        billingAccount: {
          include: {
            organization: true,
          },
        },
      },
    });
  }

  // ==================== ORDERS ====================

  async getAllOrders(options: {
    status?: OrderStatus;
    startDate?: Date;
    endDate?: Date;
    page?: number;
    limit?: number;
  } = {}) {
    const { status, startDate, endDate, page = 1, limit = 20 } = options;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status) where.status = status;
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = startDate;
      if (endDate) where.createdAt.lte = endDate;
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              businessName: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.order.count({ where }),
    ]);

    return {
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getOrderDetails(orderId: string) {
    return prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: true,
      },
    });
  }

  async updateOrderStatus(orderId: string, status: OrderStatus) {
    return prisma.order.update({
      where: { id: orderId },
      data: { status },
    });
  }

  // ==================== SERVICES ====================

  async getServiceStats() {
    const [
      totalDefinitions,
      activeDefinitions,
      totalClientServices,
      activeClientServices,
      suspendedClientServices,
    ] = await Promise.all([
      prisma.serviceDefinition.count(),
      prisma.serviceDefinition.count({ where: { isActive: true } }),
      prisma.clientService.count(),
      prisma.clientService.count({ where: { status: ClientServiceStatus.ACTIVE } }),
      prisma.clientService.count({ where: { status: ClientServiceStatus.SUSPENDED } }),
    ]);

    // Revenue by service
    const serviceRevenue = await prisma.clientService.findMany({
      where: { status: ClientServiceStatus.ACTIVE },
      include: {
        serviceDefinition: true,
      },
    });

    const revenueByService: Record<string, { name: string; count: number; monthlyRevenue: number }> = {};
    serviceRevenue.forEach(cs => {
      const id = cs.serviceDefinitionId;
      if (!revenueByService[id]) {
        revenueByService[id] = {
          name: cs.serviceDefinition.name,
          count: 0,
          monthlyRevenue: 0,
        };
      }
      revenueByService[id]!.count += 1;
      const price = cs.customRecurringPrice ?? cs.serviceDefinition.recurringPrice;
      revenueByService[id]!.monthlyRevenue += (price * cs.units) / 100;
    });

    return {
      definitions: {
        total: totalDefinitions,
        active: activeDefinitions,
      },
      clientServices: {
        total: totalClientServices,
        active: activeClientServices,
        suspended: suspendedClientServices,
      },
      revenueByService: Object.values(revenueByService),
    };
  }

  // ==================== PROJECTS ====================

  async getProjectStats() {
    const statusCounts = await prisma.project.groupBy({
      by: ['status'],
      _count: true,
    });

    const priorityCounts = await prisma.project.groupBy({
      by: ['priority'],
      _count: true,
    });

    const [totalQuotedValue, totalPaidValue] = await Promise.all([
      prisma.project.aggregate({
        _sum: { quotedPrice: true },
        where: { status: { in: [ProjectStatus.QUOTED, ProjectStatus.ACCEPTED, ProjectStatus.IN_PROGRESS, ProjectStatus.COMPLETED] } },
      }),
      prisma.project.aggregate({
        _sum: { quotedPrice: true },
        where: { status: ProjectStatus.COMPLETED },
      }),
    ]);

    return {
      byStatus: statusCounts.reduce((acc, { status, _count }) => {
        acc[status] = _count;
        return acc;
      }, {} as Record<string, number>),
      byPriority: priorityCounts.reduce((acc, { priority, _count }) => {
        acc[priority] = _count;
        return acc;
      }, {} as Record<string, number>),
      totalQuotedValue: (totalQuotedValue._sum.quotedPrice || 0) / 100,
      totalCompletedValue: (totalPaidValue._sum.quotedPrice || 0) / 100,
    };
  }

  // ==================== RECENT ACTIVITY ====================

  async getRecentActivity(limit: number = 20) {
    const [recentUsers, recentPayments, recentOrders, recentProjects] = await Promise.all([
      prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
        },
      }),
      prisma.payment.findMany({
        where: { status: PaymentStatus.PAID },
        orderBy: { completedAt: 'desc' },
        take: 5,
        select: {
          id: true,
          amount: true,
          method: true,
          completedAt: true,
        },
      }),
      prisma.order.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: {
          user: {
            select: { name: true, email: true },
          },
        },
      }),
      prisma.project.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: {
          user: {
            select: { name: true, email: true },
          },
        },
      }),
    ]);

    // Combine and sort by date
    const activities: Array<{
      type: 'user' | 'payment' | 'order' | 'project';
      id: string;
      description: string;
      date: Date;
      metadata?: any;
    }> = [
      ...recentUsers.map(u => ({
        type: 'user' as const,
        id: u.id,
        description: `New user registered: ${u.name || u.email}`,
        date: u.createdAt,
        metadata: u,
      })),
      ...recentPayments.map(p => ({
        type: 'payment' as const,
        id: p.id,
        description: `Payment received: $${(p.amount / 100).toFixed(2)} via ${p.method}`,
        date: p.completedAt || new Date(),
        metadata: p,
      })),
      ...recentOrders.map(o => ({
        type: 'order' as const,
        id: o.id,
        description: `New order from ${o.user.name || o.user.email}: ${o.itemType}`,
        date: o.createdAt,
        metadata: o,
      })),
      ...recentProjects.map(p => ({
        type: 'project' as const,
        id: p.id,
        description: `New project request: ${p.title}`,
        date: p.createdAt,
        metadata: p,
      })),
    ];

    return activities
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, limit);
  }
}
