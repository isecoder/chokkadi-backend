// src/common/utils/otp.module.ts
import { Module } from '@nestjs/common';
import { OtpService } from './otp.service';
import { OtpController } from './otp.controller';
import { OtpStoreService } from './otp-store.service';

@Module({
  controllers: [OtpController], // Register the OTP controller
  providers: [OtpService, OtpStoreService],
  exports: [OtpService, OtpStoreService], // Export OtpService to make it available in other modules
})
export class OtpModule {}
