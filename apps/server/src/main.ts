import { config } from "dotenv";
// Load environment variables first
config();

import { NestFactory } from "@nestjs/core";
import { ValidationPipe, Logger } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import cookieParser from "cookie-parser";
import { AppModule } from "./app.module";
import { AppConfigService } from "./config";
import { HttpErrorLoggingInterceptor } from "./common/http-error-logging.interceptor";
import { Request, Response, NextFunction } from "express";

// Request logger middleware
function requestLogger(logger: Logger) {
  return (req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();
    const { method, originalUrl, ip } = req;

    res.on("finish", () => {
      const duration = Date.now() - start;
      const { statusCode } = res;
      const color = statusCode >= 400 ? "\x1b[31m" : statusCode >= 300 ? "\x1b[33m" : "\x1b[32m";
      const reset = "\x1b[0m";
      logger.log(
        `${color}${method}${reset} ${originalUrl} ${color}${statusCode}${reset} - ${duration}ms - ${ip}`
      );
    });

    next();
  };
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ["error", "warn", "log"],
  });
  
  // Get config service and validate environment variables
  const configService = app.get(AppConfigService);
  configService.validateConfig();
  console.log('✅ Environment variables validated');

  // Enable request logging
  const logger = new Logger("HTTP");
  app.use(requestLogger(logger));

  // Enable cookie parsing for JWT tokens in cookies
  app.use(cookieParser());

  // Enable validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  // Enable HTTP error logging interceptor
  app.useGlobalInterceptors(new HttpErrorLoggingInterceptor());

  // Enable CORS
  app.enableCors({
    origin: configService.corsOrigin,
    credentials: true,
  });

  // Swagger Documentation
  const swaggerConfig = new DocumentBuilder()
    .setTitle('CVT API')
    .setDescription(`
## Christus Veritas Technologies API Documentation

This API provides endpoints for integrating with CVT services. 

### Authentication

There are two authentication methods:

1. **JWT Token Authentication** - For user-authenticated requests (dashboard, account management)
2. **API Key Authentication** - For machine-to-machine requests (external applications)

### Public Endpoints (API Key Authentication)

The following endpoints are designed for external applications:

- \`POST /api/api-keys/verify\` - Verify an API key and get user's services
- \`POST /api/api-keys/verify-service\` - Check if a specific service is active and paid

### Getting Started

1. Log in to the CVT Client Portal
2. Navigate to API Keys section
3. Create a new API key
4. Use the key in your application to authenticate requests
    `)
    .setVersion('1.0')
    .addTag('API Keys', 'Endpoints for API key verification and management')
    .addTag('Auth', 'Authentication endpoints')
    .addTag('Dashboard', 'Dashboard and statistics endpoints')
    .addTag('Projects', 'Project management endpoints')
    .addTag('Services', 'Service management endpoints')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'JWT-Auth',
    )
    .addApiKey(
      { type: 'apiKey', name: 'X-API-Key', in: 'header' },
      'API-Key',
    )
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customSiteTitle: 'CVT API Documentation',
  });

  const port = configService.port;
  await app.listen(port);
  console.log(`🚀 Server running on http://localhost:${port}`);
  console.log(`📚 API Documentation available at http://localhost:${port}/docs`);
}
bootstrap();
