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
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SignUpDto, SignInDto, RefreshTokenDto, ForgotPasswordDto, ResetPasswordDto, GoogleCallbackDto } from "./dto";

@Controller("auth")
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
  getGoogleAuthUrl(@Query("state") state?: string) {
    return this.authService.getGoogleAuthUrl(state);
  }

  @Get("google/callback")
  async googleCallback(@Query() query: GoogleCallbackDto) {
    if (query.error) {
      return {
        success: false,
        error: query.error,
        errorDescription: query.error_description,
      };
    }
    return this.authService.signInWithGoogle(query.code);
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
}
