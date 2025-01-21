import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { OtpService } from './otp.service';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { CheckVerificationStatusDto } from './dto/check-verification-status.dto';

@Controller('otp')
export class OtpController {
  private otpStore: Map<string, { otp: string; isVerified: boolean }>;

  constructor(private readonly otpService: OtpService) {
    this.otpStore = new Map();
  }

  // Send OTP
  @Post('send')
  async sendOtp(@Body() body: SendOtpDto) {
    const { mobileNumber } = body;

    const otp = await this.otpService.sendOtp(mobileNumber);
    this.otpStore.set(mobileNumber, { otp, isVerified: false });

    return { message: 'OTP sent successfully', mobileNumber };
  }

  // Verify OTP
  @Post('verify')
  async verifyOtp(@Body() body: VerifyOtpDto) {
    const { mobileNumber, otp } = body;

    const otpEntry = this.otpStore.get(mobileNumber);
    if (!otpEntry || otpEntry.otp !== otp) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    otpEntry.isVerified = true;
    this.otpStore.set(mobileNumber, otpEntry);

    return { message: 'OTP verified successfully', mobileNumber };
  }

  // Check Verification Status
  @Post('status')
  async checkVerificationStatus(@Body() body: CheckVerificationStatusDto) {
    const { mobileNumber } = body;

    const otpEntry = this.otpStore.get(mobileNumber);
    const isVerified = otpEntry?.isVerified || false;

    return { mobileNumber, isVerified };
  }
}
