import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth";
import { EmailModule } from "./email/email.module";
import { InvitationModule } from "./invitation/invitation.module";
import { ServiceModule } from "./services/service.module";
import { ClientModule } from "./clients/client.module";
import { MarketplaceModule } from "./marketplace/marketplace.module";
import { AppConfigService } from "./config";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    AuthModule,
    EmailModule,
    InvitationModule,
    ServiceModule,
    ClientModule,
    MarketplaceModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppConfigService],
})
export class AppModule {}
