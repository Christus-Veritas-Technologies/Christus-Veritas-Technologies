import { Injectable } from '@nestjs/common';
import { prisma } from '@repo/db';

@Injectable()
export class ClientService {
  async getClients(search?: string) {
    return prisma.user.findMany({
      where: {
        isAdmin: false,
        ...(search
          ? {
              OR: [
                { email: { contains: search, mode: 'insensitive' } },
                { name: { contains: search, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        clientServices: {
          include: {
            serviceDefinition: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getClient(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        clientServices: {
          include: {
            serviceDefinition: true,
          },
          orderBy: { dateJoined: 'desc' },
        },
      },
    });
  }

  async getClientStats() {
    const totalClients = await prisma.user.count({
      where: { isAdmin: false },
    });

    const activeServices = await prisma.clientService.count({
      where: { status: 'ACTIVE' },
    });

    const clientsWithActiveServices = await prisma.user.count({
      where: {
        isAdmin: false,
        clientServices: {
          some: { status: 'ACTIVE' },
        },
      },
    });

    const recentClients = await prisma.user.count({
      where: {
        isAdmin: false,
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
      },
    });

    return {
      totalClients,
      activeServices,
      clientsWithActiveServices,
      recentClients,
    };
  }

  async updateClient(id: string, data: { name?: string }) {
    return prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });
  }
}
