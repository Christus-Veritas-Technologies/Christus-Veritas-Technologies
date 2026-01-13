import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { prisma } from '@repo/db';
import { CreateProjectDto } from './dto/create-project.dto';
import { QuoteProjectDto } from './dto/quote-project.dto';
import { ProjectAction } from './dto/respond-to-quote.dto';
import { AdminProjectAction } from './dto/update-project-status.dto';

@Injectable()
export class ProjectsService {
  // Get all projects for a user
  async getUserProjects(userId: string) {
    return prisma.project.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        quotedBy: {
          select: { id: true, name: true },
        },
      },
    });
  }

  // Get a single project for a user
  async getUserProject(userId: string, projectId: string) {
    const project = await prisma.project.findFirst({
      where: { id: projectId, userId },
      include: {
        quotedBy: {
          select: { id: true, name: true },
        },
        messages: {
          where: { isInternal: false },
          orderBy: { createdAt: 'asc' },
          include: {
            user: {
              select: { id: true, name: true, isAdmin: true },
            },
          },
        },
      },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }

  // Create a new project request
  async createProject(userId: string, dto: CreateProjectDto) {
    return prisma.project.create({
      data: {
        userId,
        title: dto.title,
        description: dto.description,
        requirements: dto.requirements,
        timeline: dto.timeline,
        budget: dto.budget,
        status: 'PENDING',
      },
    });
  }

  // Get project stats for dashboard
  async getUserProjectStats(userId: string) {
    const projects = await prisma.project.findMany({
      where: { userId },
      select: { status: true },
    });

    const stats = {
      total: projects.length,
      pending: projects.filter(p => p.status === 'PENDING').length,
      quoted: projects.filter(p => p.status === 'QUOTED').length,
      inProgress: projects.filter(p => p.status === 'IN_PROGRESS' || p.status === 'ACCEPTED').length,
      completed: projects.filter(p => p.status === 'COMPLETED').length,
      declined: projects.filter(p => p.status === 'DECLINED' || p.status === 'CANCELLED').length,
    };

    return stats;
  }

  // ==================== ADMIN METHODS ====================

  // Get all projects (admin)
  async getAllProjects(status?: string) {
    const where = status ? { status: status as any } : {};
    
    return prisma.project.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        quotedBy: {
          select: { id: true, name: true },
        },
      },
    });
  }

  // Get a single project (admin)
  async getProject(projectId: string) {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        quotedBy: {
          select: { id: true, name: true },
        },
        messages: {
          orderBy: { createdAt: 'asc' },
          include: {
            user: {
              select: { id: true, name: true, isAdmin: true },
            },
          },
        },
      },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }

  // Quote a project (admin)
  async quoteProject(adminId: string, projectId: string, dto: QuoteProjectDto) {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (project.status !== 'PENDING') {
      throw new BadRequestException('Can only quote pending projects');
    }

    return prisma.project.update({
      where: { id: projectId },
      data: {
        quotedPrice: dto.quotedPrice,
        quotedTimeline: dto.quotedTimeline,
        quoteNotes: dto.quoteNotes,
        quotedById: adminId,
        quotedAt: new Date(),
        status: 'QUOTED',
      },
    });
  }

  // User responds to quote
  async respondToQuote(userId: string, projectId: string, action: ProjectAction, declineReason?: string) {
    const project = await prisma.project.findFirst({
      where: { id: projectId, userId },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (project.status !== 'QUOTED') {
      throw new BadRequestException('Can only respond to quoted projects');
    }

    if (action === ProjectAction.ACCEPT) {
      return prisma.project.update({
        where: { id: projectId },
        data: {
          userAcceptedAt: new Date(),
          status: 'ACCEPTED',
        },
      });
    } else {
      return prisma.project.update({
        where: { id: projectId },
        data: {
          userDeclinedAt: new Date(),
          declineReason,
          status: 'DECLINED',
        },
      });
    }
  }

  // Admin updates project status
  async updateProjectStatus(
    adminId: string,
    projectId: string,
    action: AdminProjectAction,
    reason?: string,
    deliverables?: string,
  ) {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    switch (action) {
      case AdminProjectAction.START:
        if (project.status !== 'ACCEPTED') {
          throw new BadRequestException('Can only start accepted projects');
        }
        return prisma.project.update({
          where: { id: projectId },
          data: {
            startedAt: new Date(),
            status: 'IN_PROGRESS',
          },
        });

      case AdminProjectAction.HOLD:
        if (project.status !== 'IN_PROGRESS') {
          throw new BadRequestException('Can only hold in-progress projects');
        }
        return prisma.project.update({
          where: { id: projectId },
          data: {
            status: 'ON_HOLD',
          },
        });

      case AdminProjectAction.COMPLETE:
        if (!['IN_PROGRESS', 'ON_HOLD'].includes(project.status)) {
          throw new BadRequestException('Can only complete in-progress or on-hold projects');
        }
        return prisma.project.update({
          where: { id: projectId },
          data: {
            completedAt: new Date(),
            deliverables,
            status: 'COMPLETED',
          },
        });

      case AdminProjectAction.CANCEL:
        if (['COMPLETED', 'CANCELLED'].includes(project.status)) {
          throw new BadRequestException('Project is already completed or cancelled');
        }
        return prisma.project.update({
          where: { id: projectId },
          data: {
            cancelledAt: new Date(),
            cancelReason: reason,
            status: 'CANCELLED',
          },
        });

      default:
        throw new BadRequestException('Invalid action');
    }
  }

  // Add a message to a project
  async addMessage(userId: string, projectId: string, message: string, isInternal: boolean = false) {
    // Verify project exists and user has access
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    // Check if user is the project owner or an admin
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.isAdmin && project.userId !== userId) {
      throw new ForbiddenException('You do not have access to this project');
    }

    // Only admins can add internal messages
    if (isInternal && !user.isAdmin) {
      throw new ForbiddenException('Only admins can add internal notes');
    }

    return prisma.projectMessage.create({
      data: {
        projectId,
        userId,
        message,
        isInternal,
      },
      include: {
        user: {
          select: { id: true, name: true, isAdmin: true },
        },
      },
    });
  }
}
