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
      body: `Hare Raama!\nYour OTP for booking the hall at Shrirama Temple Chokkadi is ${otp}. Please do not share this OTP with anyone. It is valid for the next 5 minutes.\n\nThank you,\nShrirama Temple Chokkadi`,
      from: this.sender,
      to: mobileNumber,
    });
    return otp;
  }

  async verifyOtp(inputOtp: string, storedOtp: string): Promise<boolean> {
    return inputOtp === storedOtp;
  }

  async sendReserveRequest(details: {
    fullName: string;
    purpose: string;
    mobileNumber: string;
    bookingDate: string | Date;
    bookingId: string;
  }): Promise<void> {
    const { fullName, purpose, mobileNumber, bookingDate, bookingId } = details;
    const formattedDate = new Date(bookingDate).toLocaleDateString('en-GB');
    await this.twilioClient.messages.create({
      body: `Hare Raama!\nA new hall reservation request has been received. Please review and confirm the booking with the user.\n\nBooking ID: ${bookingId}\n\nUser Details:\nName: ${fullName}\nPurpose: ${purpose}\nMobile: ${mobileNumber}\nBooking Date: ${formattedDate}\n\nKindly contact the user or verify their details to confirm the booking at your earliest convenience.`,
      from: this.sender,
      to: process.env.TEMPLE_CONTACT_NUMBER, // Admin or management contact number
    });
  }

  async sendReserveUnderReview(details: {
    fullName: string;
    purpose: string;
    mobileNumber: string;
    bookingDate: Date;
    contactNumber: string;
    bookingId: string;
  }): Promise<void> {
    const {
      fullName,
      purpose,
      mobileNumber,
      bookingDate,
      contactNumber,
      bookingId,
    } = details;

    const formattedDate = new Date(bookingDate).toLocaleDateString('en-GB');

    await this.twilioClient.messages.create({
      body: `Hare Raama!\nThank you for reserving the hall at Shrirama Temple Chokkadi.\nYour request is under review. Please contact the temple authority at ${contactNumber} for confirmation within 26 hours to finalize your booking.\n\nBooking Id: ${bookingId}\n\nDetails provided by you in the form:\n    Name: ${fullName}\n    Purpose: ${purpose}\n    Mobile: ${mobileNumber}\n    Booking Date: ${formattedDate}\n\nTo confirm the booking, please make the necessary payment and contact the temple authority. Failure to confirm within the given time may result in cancellation of the reservation.\n\nThank you,\nShrirama Temple Chokkadi`,
      from: this.sender,
      to: mobileNumber,
    });
  }

  async sendReserveConfirmation(details: {
    fullName: string;
    purpose: string;
    mobileNumber: string;
    bookingDate: Date;
    bookingId: string;
  }): Promise<void> {
    const { fullName, purpose, mobileNumber, bookingDate, bookingId } = details;
    const formattedDate = new Date(bookingDate).toLocaleDateString('en-GB');
    await this.twilioClient.messages.create({
      body: `Hare Raama!\nYour hall reservation at Shrirama Temple Chokkadi has been confirmed.\nDetails:\n\nBooking ID: ${bookingId}\nName: ${fullName}\nPurpose: ${purpose}\nMobile: ${mobileNumber}\nBooking Date: ${formattedDate}\n\nThank you for choosing Shrirama Temple Chokkadi. We look forward to hosting your event!`,
      from: this.sender,
      to: mobileNumber,
    });
  }
}
