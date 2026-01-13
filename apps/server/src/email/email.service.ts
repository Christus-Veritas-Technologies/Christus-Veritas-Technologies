import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.initializeTransporter();
  }

  private initializeTransporter() {
    const host = this.configService.get<string>('SMTP_HOST');
    const port = this.configService.get<number>('SMTP_PORT') || 587;
    const user = this.configService.get<string>('SMTP_USER');
    const pass = this.configService.get<string>('SMTP_PASS');

    if (!host || !user || !pass) {
      this.logger.warn('SMTP configuration incomplete. Email sending will be disabled.');
      return;
    }

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: {
        user,
        pass,
      },
    });

    this.logger.log('Email transporter initialized');
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    if (!this.transporter) {
      this.logger.warn(`Email not sent to ${options.to}: SMTP not configured`);
      // Log email content in dev mode
      this.logger.debug(`Email content: ${options.subject}\n${options.text || options.html}`);
      return false;
    }

    try {
      const fromName = this.configService.get<string>('SMTP_FROM_NAME') || 'Christus Veritas Technologies';
      const fromEmail = this.configService.get<string>('SMTP_FROM_EMAIL') || 'noreply@cvt.co.zw';

      await this.transporter.sendMail({
        from: `"${fromName}" <${fromEmail}>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
      });

      this.logger.log(`Email sent to ${options.to}: ${options.subject}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send email to ${options.to}:`, error);
      return false;
    }
  }

  async sendInvitationEmail(params: {
    to: string;
    name: string;
    role: 'ADMIN' | 'CLIENT';
    email: string;
    tempPassword: string;
    inviteLink: string;
  }): Promise<boolean> {
    const { to, name, role, email, tempPassword, inviteLink } = params;

    const roleText = role === 'ADMIN' ? 'Administrator' : 'Client';
    const portalName = role === 'ADMIN' ? 'Ultimate Dashboard' : 'Client Portal';

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to CVT</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <div style="background: linear-gradient(135deg, #7C3AED 0%, #4169E1 100%); padding: 40px; border-radius: 16px 16px 0 0; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to CVT</h1>
      <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0; font-size: 16px;">Christus Veritas Technologies</p>
    </div>
    
    <div style="background: white; padding: 40px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
      <h2 style="color: #1a1a1a; margin: 0 0 20px; font-size: 22px;">Hello ${name},</h2>
      
      <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
        You've been invited to join the CVT ${portalName} as a <strong>${roleText}</strong>.
      </p>
      
      <div style="background: #f8f9fa; border-radius: 12px; padding: 24px; margin: 24px 0;">
        <h3 style="color: #1a1a1a; margin: 0 0 16px; font-size: 16px;">Your Login Credentials</h3>
        <p style="color: #4a4a4a; font-size: 14px; margin: 0 0 8px;">
          <strong>Email:</strong> ${email}
        </p>
        <p style="color: #4a4a4a; font-size: 14px; margin: 0;">
          <strong>Temporary Password:</strong> <code style="background: #e9ecef; padding: 2px 8px; border-radius: 4px; font-family: monospace;">${tempPassword}</code>
        </p>
      </div>
      
      <p style="color: #dc3545; font-size: 14px; margin: 0 0 24px;">
        ⚠️ Please change your password after your first login for security.
      </p>
      
      <div style="text-align: center; margin: 32px 0;">
        <a href="${inviteLink}" style="display: inline-block; background: linear-gradient(135deg, #7C3AED 0%, #4169E1 100%); color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">
          Access ${portalName}
        </a>
      </div>
      
      <p style="color: #6c757d; font-size: 14px; line-height: 1.6; margin: 24px 0 0;">
        If you didn't expect this invitation, please ignore this email or contact our support team.
      </p>
    </div>
    
    <div style="text-align: center; padding: 24px;">
      <p style="color: #6c757d; font-size: 12px; margin: 0;">
        © ${new Date().getFullYear()} Christus Veritas Technologies. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
    `;

    const text = `
Welcome to CVT - Christus Veritas Technologies

Hello ${name},

You've been invited to join the CVT ${portalName} as a ${roleText}.

Your Login Credentials:
- Email: ${email}
- Temporary Password: ${tempPassword}

Please change your password after your first login for security.

Access the portal: ${inviteLink}

If you didn't expect this invitation, please ignore this email.

© ${new Date().getFullYear()} Christus Veritas Technologies
    `;

    return this.sendEmail({
      to,
      subject: `You're invited to CVT ${portalName}`,
      html,
      text,
    });
  }

  async sendVerificationEmail(params: {
    to: string;
    name: string;
    verificationLink: string;
  }): Promise<boolean> {
    const { to, name, verificationLink } = params;

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <div style="background: linear-gradient(135deg, #7C3AED 0%, #4169E1 100%); padding: 40px; border-radius: 16px 16px 0 0; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 28px;">Verify Your Email</h1>
      <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0; font-size: 16px;">Christus Veritas Technologies</p>
    </div>
    
    <div style="background: white; padding: 40px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
      <h2 style="color: #1a1a1a; margin: 0 0 20px; font-size: 22px;">Hello ${name || 'there'},</h2>
      
      <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
        Thank you for signing up! Please verify your email address to complete your registration and access the portal.
      </p>
      
      <div style="text-align: center; margin: 32px 0;">
        <a href="${verificationLink}" style="display: inline-block; background: linear-gradient(135deg, #7C3AED 0%, #4169E1 100%); color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">
          Verify My Email
        </a>
      </div>
      
      <p style="color: #6c757d; font-size: 14px; line-height: 1.6; margin: 24px 0 0;">
        This link will expire in 24 hours. If you didn't create an account with us, please ignore this email.
      </p>
      
      <p style="color: #6c757d; font-size: 12px; line-height: 1.6; margin: 20px 0 0;">
        If the button doesn't work, copy and paste this link into your browser:<br>
        <a href="${verificationLink}" style="color: #7C3AED; word-break: break-all;">${verificationLink}</a>
      </p>
    </div>
    
    <div style="text-align: center; padding: 24px;">
      <p style="color: #6c757d; font-size: 12px; margin: 0;">
        © ${new Date().getFullYear()} Christus Veritas Technologies. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
    `;

    const text = `
Verify Your Email - Christus Veritas Technologies

Hello ${name || 'there'},

Thank you for signing up! Please verify your email address to complete your registration.

Click this link to verify: ${verificationLink}

This link will expire in 24 hours.

If you didn't create an account with us, please ignore this email.

© ${new Date().getFullYear()} Christus Veritas Technologies
    `;

    return this.sendEmail({
      to,
      subject: 'Verify your email - Christus Veritas Technologies',
      html,
      text,
    });
  }
}
