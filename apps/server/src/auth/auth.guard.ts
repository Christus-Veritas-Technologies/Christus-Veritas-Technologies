import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { verifyAccessToken, extractBearerToken } from '@repo/auth';

/**
 * JWT Auth Guard using the auth package directly
 * This is kept for backward compatibility with existing controllers
 * 
 * For new code, prefer using JwtAuthGuard from ./guards/jwt-auth.guard.ts
 */
@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;
    
    // Also check for cookie-based auth
    const cookieToken = request.cookies?.auth_token;
    
    const token = extractBearerToken(authHeader) || cookieToken;
    
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    const payload = verifyAccessToken(token);
    if (!payload) {
      throw new UnauthorizedException('Invalid token');
    }

    // Attach user info to request (using userId format for compatibility)
    (request as any).user = {
      userId: payload.userId,
      email: payload.email,
      isAdmin: payload.isAdmin,
      emailVerified: payload.emailVerified,
    };
    
    return true;
  }
}
