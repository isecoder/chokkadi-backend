// otp.service.ts
import { Injectable } from '@nestjs/common';
import * as Twilio from 'twilio';

@Injectable()
export class OtpService {
  private twilioClient: Twilio.Twilio;
  private sender: string;

  constructor() {
    this.twilioClient = Twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN,
    );
    this.sender = process.env.TWILIO_PHONE_NUMBER; // Replace with your Twilio phone number
  }

  async sendOtp(mobileNumber: string): Promise<string> {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await this.twilioClient.messages.create({
      body: `Your OTP is ${otp}`,
      from: this.sender,
      to: mobileNumber,
    });
    return otp;
  }

  async verifyOtp(inputOtp: string, storedOtp: string): Promise<boolean> {
    return inputOtp === storedOtp;
  }
}
