import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Headers,
  HttpCode,
  HttpStatus,
  Redirect,
  Res,
  Req,
  UseGuards,
} from "@nestjs/common";
import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { SignUpDto, SignInDto, RefreshTokenDto, ForgotPasswordDto, ResetPasswordDto, GoogleCallbackDto } from "./dto";
import { GoogleAuthGuard } from "./guards/google-auth.guard";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("signup")
  async signUp(@Body() dto: SignUpDto) {
    return this.authService.signUp(dto);
  }

  @Post("signin")
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() dto: SignInDto) {
    return this.authService.signIn(dto);
  }

  @Post("signout")
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async signOut(@Req() req: Request) {
    return { success: true, message: "Signed out successfully" };
  }

  @Post("refresh")
  @HttpCode(HttpStatus.OK)
  async refreshTokens(@Body() dto: RefreshTokenDto) {
    return this.authService.refreshTokens(dto.refreshToken);
  }

  @Post("forgot-password")
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.requestPasswordReset(dto.email);
  }

  @Post("reset-password")
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto.token, dto.password);
  }

  @Get("me")
  @UseGuards(JwtAuthGuard)
  async getProfile(@Req() req: Request) {
    const user = (req as any).user;
    return this.authService.getProfile(user.userId);
  }

  // Google OAuth endpoints using PassportJS
  @Get("google")
  @UseGuards(GoogleAuthGuard)
  async googleAuth() {
    // Guard initiates the OAuth flow, this is never reached
  }

  @Get("google/callback")
  @UseGuards(GoogleAuthGuard)
  async googleCallback(@Req() req: Request, @Res() res: Response) {
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
    
    try {
      const user = req.user as any;
      
      if (!user || !user.tokens) {
        return res.redirect(`${clientUrl}/auth/signin?error=authentication_failed`);
      }
      
      // Redirect to callback page with tokens
      const callbackUrl = new URL('/auth/google/callback', clientUrl);
      callbackUrl.searchParams.set('access_token', user.tokens.accessToken);
      callbackUrl.searchParams.set('refresh_token', user.tokens.refreshToken);
      callbackUrl.searchParams.set('is_admin', user.isAdmin?.toString() || 'false');
      callbackUrl.searchParams.set('onboarding_completed', user.onboardingCompleted?.toString() || 'false');
      
      return res.redirect(callbackUrl.toString());
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Authentication failed';
      return res.redirect(`${clientUrl}/auth/signin?error=${encodeURIComponent(errorMessage)}`);
    }
  }

  @Post("google/unlink")
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async unlinkGoogle(@Req() req: Request) {
    const user = (req as any).user;
    return this.authService.unlinkGoogle(user.userId);
  }

  @Get("google/status")
  getGoogleStatus() {
    return this.authService.isGoogleConfigured();
  }

  // Email verification endpoints
  @Post("verify-email")
  @HttpCode(HttpStatus.OK)
  async verifyEmail(@Body() dto: { token: string }) {
    return this.authService.verifyEmail(dto.token);
  }

  @Post("resend-verification")
  @HttpCode(HttpStatus.OK)
  async resendVerification(@Body() dto: { email: string }) {
    return this.authService.resendVerificationEmail(dto.email);
  }

  @Post("complete-onboarding")
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async completeOnboarding(
    @Req() req: Request,
    @Body() dto: { name?: string; phoneNumber?: string }
  ) {
    const user = (req as any).user;
    return this.authService.completeOnboarding(user.userId, dto);
  }
}
