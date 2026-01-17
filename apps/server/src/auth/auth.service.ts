import { Injectable, UnauthorizedException } from "@nestjs/common";
import {
  signUp,
  signIn,
  signOut,
  refreshTokens,
  requestPasswordReset,
  resetPassword,
  getUserById,
  verifyAccessToken,
  extractBearerToken,
  getGoogleAuthUrl,
  signInWithGoogle,
  unlinkGoogleAccount,
  isGoogleOAuthConfigured,
  requestEmailVerification,
  verifyEmail,
  type SignUpInput,
  type SignInInput,
} from "@repo/auth";
import { EmailService } from "../email/email.service";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService {
  constructor(
    private emailService: EmailService,
    private configService: ConfigService,
  ) {}

  async signUp(input: SignUpInput) {
    const result = await signUp(input);
    if (!result.success) {
      throw new UnauthorizedException(result.error);
    }

    // Send verification email after successful signup
    if (result.user) {
      await this.sendVerificationEmail(result.user.email, result.user.name);
    }

    return result;
  }

  async signIn(input: SignInInput) {
    const result = await signIn(input);
    if (!result.success) {
      throw new UnauthorizedException(result.error);
    }
    return result;
  }

  async signOut(sessionId: string) {
    await signOut(sessionId);
    return { success: true };
  }

  async refreshTokens(refreshToken: string) {
    const result = await refreshTokens(refreshToken);
    if (!result.success) {
      throw new UnauthorizedException(result.error);
    }
    return result;
  }

  async requestPasswordReset(email: string) {
    const result = await requestPasswordReset(email);
    // In production, send email with reset link
    // For now, return success without exposing the token
    return { success: true, message: "If the email exists, a reset link has been sent" };
  }

  async resetPassword(token: string, newPassword: string) {
    const result = await resetPassword(token, newPassword);
    if (!result.success) {
      throw new UnauthorizedException(result.error);
    }
    return result;
  }

  async getProfile(userId: string) {
    const user = await getUserById(userId);
    if (!user) {
      throw new UnauthorizedException("User not found");
    }
    return user;
  }

  validateToken(authHeader?: string) {
    const token = extractBearerToken(authHeader);
    if (!token) {
      throw new UnauthorizedException("No token provided");
    }

    const payload = verifyAccessToken(token);
    if (!payload) {
      throw new UnauthorizedException("Invalid token");
    }

    return payload;
  }

  // Google OAuth methods
  getGoogleAuthUrl(state?: string) {
    if (!isGoogleOAuthConfigured()) {
      throw new UnauthorizedException("Google OAuth is not configured");
    }
    return { url: getGoogleAuthUrl(state) };
  }

  async signInWithGoogle(code: string) {
    if (!isGoogleOAuthConfigured()) {
      throw new UnauthorizedException("Google OAuth is not configured");
    }
    const result = await signInWithGoogle(code);
    if (!result.success) {
      throw new UnauthorizedException(result.error);
    }
    return result;
  }

  async unlinkGoogle(userId: string) {
    const result = await unlinkGoogleAccount(userId);
    if (!result.success) {
      throw new UnauthorizedException(result.error);
    }
    return result;
  }

  isGoogleConfigured() {
    return { configured: isGoogleOAuthConfigured() };
  }

  // Email verification methods
  async sendVerificationEmail(email: string, name?: string | null) {
    const result = await requestEmailVerification(email);
    if (!result.success || !result.verificationToken) {
      return { success: false };
    }

    const baseUrl = this.configService.get<string>('CLIENT_URL') || 'http://localhost:3000';
    const verificationLink = `${baseUrl}/auth/verify-email?token=${result.verificationToken}`;

    await this.emailService.sendVerificationEmail({
      to: email,
      name: name || 'there',
      verificationLink,
    });

    return { success: true };
  }

  async verifyEmail(token: string) {
    const result = await verifyEmail(token);
    if (!result.success) {
      throw new UnauthorizedException(result.error);
    }
    return result;
  }

  async resendVerificationEmail(email: string) {
    return this.sendVerificationEmail(email);
  }

  async completeOnboarding(userId: string, data: { name?: string; phoneNumber?: string; businessName?: string; businessAddress?: string }) {
    const { completeOnboarding: complete } = await import("@repo/auth");
    const result = await complete(userId, data);
    if (!result.success) {
      throw new UnauthorizedException(result.error);
    }
    return result;
  }
}
