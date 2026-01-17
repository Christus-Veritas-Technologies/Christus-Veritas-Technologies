import { Injectable, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

/**
 * JWT Authentication Guard using PassportJS
 * 
 * This guard validates JWT tokens from either:
 * - Authorization: Bearer <token> header
 * - auth_token cookie
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  canActivate(context: ExecutionContext) {
    // Call the default canActivate from passport
    return super.canActivate(context);
  }

  handleRequest<TUser = any>(err: any, user: TUser, info: any): TUser {
    // Handle passport errors
    if (err || !user) {
      throw err || new UnauthorizedException("Invalid or expired token");
    }
    return user;
  }
}
