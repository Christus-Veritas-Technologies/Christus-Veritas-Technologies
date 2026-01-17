import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { EmailModule } from "../email/email.module";
import { JwtStrategy, GoogleStrategy } from "./strategies";
import { JwtAuthGuard, GoogleAuthGuard } from "./guards";

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: "jwt" }),
    EmailModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, GoogleStrategy, JwtAuthGuard, GoogleAuthGuard],
  exports: [AuthService, JwtAuthGuard, GoogleAuthGuard, PassportModule],
})
export class AuthModule {}
