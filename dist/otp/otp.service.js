"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpService = void 0;
const common_1 = require("@nestjs/common");
const Twilio = require("twilio");
let OtpService = class OtpService {
    constructor() {
        this.twilioClient = Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
        this.sender = process.env.TWILIO_PHONE_NUMBER;
    }
    async sendOtp(mobileNumber) {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        await this.twilioClient.messages.create({
            body: `Hare Raama!\nYour OTP for booking the hall at Shrirama Temple Chokkadi is ${otp}. Please do not share this OTP with anyone. It is valid for the next 5 minutes.\n\nThank you,\nShrirama Temple Chokkadi`,
            from: this.sender,
            to: mobileNumber,
        });
        return otp;
    }
    async verifyOtp(inputOtp, storedOtp) {
        return inputOtp === storedOtp;
    }
    async sendReserveRequest(details) {
        const { fullName, purpose, mobileNumber, bookingDate, bookingId } = details;
        const formattedDate = new Date(bookingDate).toLocaleDateString('en-GB');
        const recipients = [
            process.env.TEMPLE_CONTACT_NUMBER,
            process.env.TEMPLE_BACKUP,
        ];
        const messageBody = `Hare Raama!\nA new hall reservation request has been received. Please review and confirm the booking with the user.\n\nBooking ID: ${bookingId}\n\nUser Details:\nName: ${fullName}\nPurpose: ${purpose}\nMobile: ${mobileNumber}\nBooking Date: ${formattedDate}\n\nKindly contact the user or verify their details to confirm the booking at your earliest convenience.`;
        const sendMessages = recipients.map((recipient) => this.twilioClient.messages.create({
            body: messageBody,
            from: this.sender,
            to: recipient,
        }));
        await Promise.all(sendMessages);
    }
    async sendReserveUnderReview(details) {
        const { fullName, purpose, mobileNumber, bookingDate, bookingId } = details;
        const formattedDate = new Date(bookingDate).toLocaleDateString('en-GB');
        await this.twilioClient.messages.create({
            body: `Hare Raama!\nThank you for reserving the hall at Shrirama Temple Chokkadi.\nYour request is under review. Please contact the temple authority at one of the following numbers: +91 94486 25254, +91 70196 16082, 08257 200585, or +91 97412 51613 for confirmation within 26 hours to finalize your booking.\n\nBooking Id: ${bookingId}\n\nDetails provided by you in the form:\n    Name: ${fullName}\n    Purpose: ${purpose}\n    Mobile: ${mobileNumber}\n    Booking Date: ${formattedDate}\n\nTo confirm the booking, please make the necessary payment and contact the temple authority. Failure to confirm within the given time may result in cancellation of the reservation.\n\nThank you,\nShrirama Temple Chokkadi`,
            from: this.sender,
            to: mobileNumber,
        });
    }
    async sendReserveConfirmation(details) {
        const { fullName, purpose, mobileNumber, bookingDate, bookingId } = details;
        const formattedDate = new Date(bookingDate).toLocaleDateString('en-GB');
        await this.twilioClient.messages.create({
            body: `Hare Raama!\nYour hall reservation at Shrirama Temple Chokkadi has been confirmed.\nDetails:\n\nBooking ID: ${bookingId}\nName: ${fullName}\nPurpose: ${purpose}\nMobile: ${mobileNumber}\nBooking Date: ${formattedDate}\n\nThank you for choosing Shrirama Temple Chokkadi. We look forward to hosting your event!`,
            from: this.sender,
            to: mobileNumber,
        });
    }
};
exports.OtpService = OtpService;
exports.OtpService = OtpService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], OtpService);
//# sourceMappingURL=otp.service.js.map