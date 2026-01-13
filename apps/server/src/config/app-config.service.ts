import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  get port(): number {
    return Number(this.configService.get<number>('PORT')) || 3001;
  }

  get corsOrigin(): string {
    return this.configService.get<string>('CORS_ORIGIN') || 'http://localhost:3000';
  }

  get databaseUrl(): string {
    return this.configService.get<string>('DATABASE_URL') || '';
  }

  get jwtSecret(): string {
    return this.configService.get<string>('JWT_SECRET') || 'fallback-secret';
  }

  get jwtExpiresIn(): string {
    return this.configService.get<string>('JWT_EXPIRES_IN') || '7d';
  }

  get jwtRefreshExpiresIn(): string {
    return this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') || '30d';
  }

  get nodeEnv(): string {
    return this.configService.get<string>('NODE_ENV') || 'development';
  }

  get googleClientId(): string {
    return this.configService.get<string>('GOOGLE_CLIENT_ID') || '';
  }

  get googleClientSecret(): string {
    return this.configService.get<string>('GOOGLE_CLIENT_SECRET') || '';
  }

  get googleRedirectUri(): string {
    return this.configService.get<string>('GOOGLE_REDIRECT_URI') || '';
  }

  // Validate that all required environment variables are set
  validateConfig(): void {
    const required = [
      'DATABASE_URL',
      'JWT_SECRET',
      'GOOGLE_CLIENT_ID',
      'GOOGLE_CLIENT_SECRET',
    ];

    const missing = required.filter(key => !this.configService.get<string>(key));
    
    if (missing.length > 0) {
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }
  }
}