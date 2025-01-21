import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { OtpService } from './otp.service';
import { OtpStoreService } from './otp-store.service';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';

@Controller('otp')
export class OtpController {
  constructor(
    private readonly otpService: OtpService,
    private readonly otpStoreService: OtpStoreService,
  ) {}

  @Post('send')
  async sendOtp(@Body() body: SendOtpDto) {
    const { mobileNumber } = body;

    const otp = await this.otpService.sendOtp(mobileNumber);
    this.otpStoreService.setOtp(mobileNumber, { otp, isVerified: false });

    return { message: 'OTP sent successfully', mobileNumber };
  }

  @Post('verify')
  async verifyOtp(@Body() body: VerifyOtpDto) {
    const { mobileNumber, otp } = body;

    const otpEntry = this.otpStoreService.getOtp(mobileNumber);
    if (!otpEntry || otpEntry.otp !== otp) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    otpEntry.isVerified = true;
    this.otpStoreService.setOtp(mobileNumber, otpEntry);

    return {
      statusCode: 201,
      message: 'Resource created successfully',
      data: { mobileNumber, isVerified: otpEntry.isVerified },
    };
  }
}
