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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpController = void 0;
const common_1 = require("@nestjs/common");
const otp_service_1 = require("./otp.service");
const otp_store_service_1 = require("./otp-store.service");
const send_otp_dto_1 = require("./dto/send-otp.dto");
const verify_otp_dto_1 = require("./dto/verify-otp.dto");
let OtpController = class OtpController {
    constructor(otpService, otpStoreService) {
        this.otpService = otpService;
        this.otpStoreService = otpStoreService;
    }
    async sendOtp(body) {
        const { mobileNumber } = body;
        const otp = await this.otpService.sendOtp(mobileNumber);
        this.otpStoreService.setOtp(mobileNumber, { otp, isVerified: false });
        return { message: 'OTP sent successfully', mobileNumber };
    }
    async verifyOtp(body) {
        const { mobileNumber, otp } = body;
        const otpEntry = this.otpStoreService.getOtp(mobileNumber);
        if (!otpEntry || otpEntry.otp !== otp) {
            throw new common_1.BadRequestException('Invalid or expired OTP');
        }
        otpEntry.isVerified = true;
        this.otpStoreService.setOtp(mobileNumber, otpEntry);
        return {
            statusCode: 201,
            message: 'Resource created successfully',
            data: { mobileNumber, isVerified: otpEntry.isVerified },
        };
    }
};
exports.OtpController = OtpController;
__decorate([
    (0, common_1.Post)('send'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [send_otp_dto_1.SendOtpDto]),
    __metadata("design:returntype", Promise)
], OtpController.prototype, "sendOtp", null);
__decorate([
    (0, common_1.Post)('verify'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [verify_otp_dto_1.VerifyOtpDto]),
    __metadata("design:returntype", Promise)
], OtpController.prototype, "verifyOtp", null);
exports.OtpController = OtpController = __decorate([
    (0, common_1.Controller)('otp'),
    __metadata("design:paramtypes", [otp_service_1.OtpService,
        otp_store_service_1.OtpStoreService])
], OtpController);
//# sourceMappingURL=otp.controller.js.map