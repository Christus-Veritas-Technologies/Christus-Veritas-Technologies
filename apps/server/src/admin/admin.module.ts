import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { PackageController } from './package.controller';
import { PackageService } from './package.service';
import { AuthModule } from '../auth';

@Module({
  imports: [AuthModule],
  controllers: [AdminController, PackageController],
  providers: [AdminService, PackageService],
  exports: [AdminService, PackageService],
})
export class AdminModule {}
