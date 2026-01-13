import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { prisma } from '@repo/db';
import { hashPassword } from '@repo/auth';
import { EmailService } from '../email/email.service';
import { randomBytes } from 'crypto';
import { CreateInvitationDto } from './dto/create-invitation.dto';

export { CreateInvitationDto };

@Injectable()
export class InvitationService {
  constructor(private readonly emailService: EmailService) {}

  private generatePassword(length = 12): string {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*';
    let password = '';
    const randomValues = randomBytes(length);
    for (let i = 0; i < length; i++) {
      password += chars[randomValues[i] % chars.length];
    }
    return password;
  }

  private generateToken(): string {
    return randomBytes(32).toString('hex');
  }

  async createInvitation(dto: CreateInvitationDto) {
    const { email, name, role, provisionServiceId, provisionUnits, provisionRecurring } = dto;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      throw new BadRequestException('A user with this email already exists');
    }

    // Check for existing pending invitation
    const existingInvitation = await prisma.invitation.findFirst({
      where: {
        email: email.toLowerCase(),
        status: 'PENDING',
        expiresAt: { gt: new Date() },
      },
    });

    if (existingInvitation) {
      throw new BadRequestException('An invitation has already been sent to this email');
    }

    // Validate service if provisioning
    if (provisionServiceId) {
      const service = await prisma.serviceDefinition.findUnique({
        where: { id: provisionServiceId },
      });
      if (!service) {
        throw new BadRequestException('Service not found');
      }
    }

    // Generate credentials
    const tempPassword = this.generatePassword();
    const hashedPassword = await hashPassword(tempPassword);
    const token = this.generateToken();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    // Create invitation
    const invitation = await prisma.invitation.create({
      data: {
        email: email.toLowerCase(),
        name,
        role,
        token,
        expiresAt,
        tempPassword: hashedPassword,
        provisionServiceId,
        provisionUnits: provisionUnits || 1,
        provisionRecurring: provisionRecurring ?? true,
        sentAt: new Date(),
      },
    });

    // Determine invite link based on role
    const baseUrl = process.env.CLIENT_URL || 'http://localhost:3000';
    const inviteLink = role === 'ADMIN' 
      ? `${baseUrl}/auth/signin?invite=${token}`
      : `${baseUrl}/auth/signin?invite=${token}`;

    // Send invitation email
    await this.emailService.sendInvitationEmail({
      to: email,
      name,
      role,
      email,
      tempPassword,
      inviteLink,
    });

    return {
      success: true,
      invitation: {
        id: invitation.id,
        email: invitation.email,
        name: invitation.name,
        role: invitation.role,
        status: invitation.status,
        expiresAt: invitation.expiresAt,
      },
    };
  }

  async acceptInvitation(token: string) {
    const invitation = await prisma.invitation.findUnique({
      where: { token },
    });

    if (!invitation) {
      throw new NotFoundException('Invitation not found');
    }

    if (invitation.status !== 'PENDING') {
      throw new BadRequestException('Invitation has already been used or expired');
    }

    if (invitation.expiresAt < new Date()) {
      await prisma.invitation.update({
        where: { id: invitation.id },
        data: { status: 'EXPIRED' },
      });
      throw new BadRequestException('Invitation has expired');
    }

    // Create user account
    const user = await prisma.user.create({
      data: {
        email: invitation.email,
        name: invitation.name,
        isAdmin: invitation.role === 'ADMIN',
        accounts: {
          create: {
            providerId: 'credentials',
            accountId: invitation.email,
            password: invitation.tempPassword,
          },
        },
      },
    });

    // Provision service if specified (for clients)
    if (invitation.provisionServiceId && invitation.role === 'CLIENT') {
      const service = await prisma.serviceDefinition.findUnique({
        where: { id: invitation.provisionServiceId },
      });

      if (service) {
        const nextBillingDate = new Date();
        nextBillingDate.setDate(nextBillingDate.getDate() + service.billingCycleDays);

        await prisma.clientService.create({
          data: {
            userId: user.id,
            serviceDefinitionId: invitation.provisionServiceId,
            units: invitation.provisionUnits || 1,
            enableRecurring: invitation.provisionRecurring,
            dateJoined: new Date(),
            nextBillingDate: invitation.provisionRecurring ? nextBillingDate : null,
          },
        });
      }
    }

    // Update invitation
    await prisma.invitation.update({
      where: { id: invitation.id },
      data: {
        status: 'ACCEPTED',
        acceptedAt: new Date(),
        userId: user.id,
      },
    });

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isAdmin: user.isAdmin,
      },
    };
  }

  async getInvitations(status?: string) {
    const where = status ? { status: status as any } : {};
    
    const invitations = await prisma.invitation.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        sentAt: true,
        expiresAt: true,
        acceptedAt: true,
        provisionServiceId: true,
        provisionUnits: true,
        provisionRecurring: true,
      },
    });

    return invitations;
  }

  async resendInvitation(id: string) {
    const invitation = await prisma.invitation.findUnique({
      where: { id },
    });

    if (!invitation) {
      throw new NotFoundException('Invitation not found');
    }

    // Generate new credentials and token
    const tempPassword = this.generatePassword();
    const hashedPassword = await hashPassword(tempPassword);
    const token = this.generateToken();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    // Update invitation
    await prisma.invitation.update({
      where: { id },
      data: {
        token,
        expiresAt,
        tempPassword: hashedPassword,
        status: 'PENDING',
        sentAt: new Date(),
      },
    });

    // Send new email
    const baseUrl = process.env.CLIENT_URL || 'http://localhost:3000';
    const inviteLink = `${baseUrl}/auth/signin?invite=${token}`;

    await this.emailService.sendInvitationEmail({
      to: invitation.email,
      name: invitation.name,
      role: invitation.role as 'ADMIN' | 'CLIENT',
      email: invitation.email,
      tempPassword,
      inviteLink,
    });

    return { success: true };
  }

  async cancelInvitation(id: string) {
    const invitation = await prisma.invitation.findUnique({
      where: { id },
    });

    if (!invitation) {
      throw new NotFoundException('Invitation not found');
    }

    if (invitation.status === 'ACCEPTED') {
      throw new BadRequestException('Cannot cancel an accepted invitation');
    }

    await prisma.invitation.update({
      where: { id },
      data: { status: 'CANCELLED' },
    });

    return { success: true };
  }
}
