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
  type SignUpInput,
  type SignInInput,
} from "@repo/auth";

@Injectable()
export class AuthService {
  async signUp(input: SignUpInput) {
    const result = await signUp(input);
    if (!result.success) {
      throw new UnauthorizedException(result.error);
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
}
