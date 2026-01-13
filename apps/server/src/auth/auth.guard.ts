import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { verifyAccessToken, extractBearerToken } from '@repo/auth';

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

    // Attach user info to request
    (request as any).user = payload;
    
    return true;
  }
}
