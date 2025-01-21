// src/hall-form/hall-form.module.ts
import { Module } from '@nestjs/common';
import { HallFormController } from './hallform.controller';
import { HallFormService } from './hallform.service';
import { PrismaService } from '../prisma/prisma.service';
import { OtpModule } from '../otp/otp.module'; // Import the OtpModule

@Module({
  imports: [OtpModule], // Import OtpModule to provide OtpService
  controllers: [HallFormController],
  providers: [HallFormService, PrismaService],
  exports: [HallFormService],
})
export class HallFormModule {}
