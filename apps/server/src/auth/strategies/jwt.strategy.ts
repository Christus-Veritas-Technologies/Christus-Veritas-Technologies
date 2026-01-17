import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy, StrategyOptionsWithoutRequest } from "passport-jwt";
import { Request } from "express";
import { prisma } from "@repo/db";

export interface JwtPayload {
  userId: string;
  email: string;
  isAdmin: boolean;
  emailVerified: boolean;
  iat?: number;
  exp?: number;
}

/**
 * Custom JWT extractor that checks both:
 * 1. Authorization: Bearer <token> header
 * 2. auth_token cookie
 */
const cookieExtractor = (req: Request): string | null => {
  let token: string | null = null;

  // First try to get from Authorization header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.substring(7);
  }

  // If not in header, try cookie
  if (!token && req.cookies) {
    token = req.cookies["auth_token"] || null;
  }

  return token;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor() {
    const options: StrategyOptionsWithoutRequest = {
      jwtFromRequest: cookieExtractor,
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || "dev-secret-change-in-production",
    };
    super(options);
  }

  /**
   * Validate the JWT payload
   * This is called after the token is verified
   */
  async validate(payload: JwtPayload) {
    // Verify user exists in database
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        name: true,
        isAdmin: true,
        emailVerified: true,
        onboardingCompleted: true,
        image: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException("User not found");
    }

    // Return user object to be attached to request
    return {
      userId: user.id,
      email: user.email,
      name: user.name,
      isAdmin: user.isAdmin,
      emailVerified: user.emailVerified,
      onboardingCompleted: user.onboardingCompleted,
      image: user.image,
    };
  }
}
