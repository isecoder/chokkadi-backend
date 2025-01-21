import { Injectable } from '@nestjs/common';

@Injectable()
export class OtpStoreService {
  private otpStore: Map<string, { otp: string; isVerified: boolean }> =
    new Map();

  setOtp(mobileNumber: string, otpData: { otp: string; isVerified: boolean }) {
    this.otpStore.set(mobileNumber, otpData);
  }

  getOtp(mobileNumber: string) {
    return this.otpStore.get(mobileNumber);
  }

  deleteOtp(mobileNumber: string) {
    this.otpStore.delete(mobileNumber);
  }

  logStore() {
    console.log('OTP Store:', this.otpStore);
  }
}
