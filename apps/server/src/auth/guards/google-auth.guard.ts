import { Injectable, ExecutionContext } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

/**
 * Google OAuth Authentication Guard using PassportJS
 * 
 * This guard initiates the Google OAuth flow
 */
@Injectable()
export class GoogleAuthGuard extends AuthGuard("google") {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const result = (await super.canActivate(context)) as boolean;
    return result;
  }
}
