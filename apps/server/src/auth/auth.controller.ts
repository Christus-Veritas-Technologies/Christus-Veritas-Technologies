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
} from "@nestjs/common";
import { Response } from "express";
import { AuthService } from "./auth.service";
import { SignUpDto, SignInDto, RefreshTokenDto, ForgotPasswordDto, ResetPasswordDto, GoogleCallbackDto } from "./dto";

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
  async signOut(@Headers("authorization") authHeader: string) {
    const payload = this.authService.validateToken(authHeader);
    // Note: In a real app, you'd extract the session ID from the token
    // For now, we'll just return success
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
  async getProfile(@Headers("authorization") authHeader: string) {
    const payload = this.authService.validateToken(authHeader);
    return this.authService.getProfile(payload.userId);
  }

  // Google OAuth endpoints
  @Get("google")
  googleAuthRedirect(@Query("state") state: string, @Res() res: Response) {
    const result = this.authService.getGoogleAuthUrl(state);
    return res.redirect(result.url);
  }

  @Get("google/callback")
  async googleCallback(@Query() query: GoogleCallbackDto, @Res() res: Response) {
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
    
    if (query.error) {
      return res.redirect(`${clientUrl}/auth/signin?error=${encodeURIComponent(query.error)}`);
    }
    
    if (!query.code) {
      return res.redirect(`${clientUrl}/auth/signin?error=missing_code`);
    }
    
    try {
      const result = await this.authService.signInWithGoogle(query.code);
      
      if (!result.tokens || !result.user) {
        return res.redirect(`${clientUrl}/auth/signin?error=authentication_failed`);
      }
      
      // Redirect to a callback handler page with tokens in URL
      // The client-side page will store them in cookies
      const callbackUrl = new URL('/auth/google/callback', clientUrl);
      callbackUrl.searchParams.set('access_token', result.tokens.accessToken);
      callbackUrl.searchParams.set('refresh_token', result.tokens.refreshToken);
      callbackUrl.searchParams.set('is_admin', result.user.isAdmin.toString());
      
      return res.redirect(callbackUrl.toString());
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Authentication failed';
      return res.redirect(`${clientUrl}/auth/signin?error=${encodeURIComponent(errorMessage)}`);
    }
  }

  @Post("google/unlink")
  @HttpCode(HttpStatus.OK)
  async unlinkGoogle(@Headers("authorization") authHeader: string) {
    const payload = this.authService.validateToken(authHeader);
    return this.authService.unlinkGoogle(payload.userId);
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
  async completeOnboarding(
    @Headers("authorization") authHeader: string,
    @Body() dto: { name?: string; phoneNumber?: string }
  ) {
    const payload = this.authService.validateToken(authHeader);
    return this.authService.completeOnboarding(payload.userId, dto);
  }
}
