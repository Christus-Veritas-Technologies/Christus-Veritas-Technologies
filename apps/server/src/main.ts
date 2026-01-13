import { config } from "dotenv";
// Load environment variables first
config();

import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module";
import { AppConfigService } from "./config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Get config service and validate environment variables
  const configService = app.get(AppConfigService);
  configService.validateConfig();
  console.log('✅ Environment variables validated');

  // Enable validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  // Enable CORS
  app.enableCors({
    origin: configService.corsOrigin,
    credentials: true,
  });

  // Global prefix
  app.setGlobalPrefix("api");

  const port = configService.port;
  await app.listen(port);
  console.log(`🚀 Server running on http://localhost:${port}/api`);
}
bootstrap();
