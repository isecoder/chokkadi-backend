import { OtpService } from './otp.service';
import { OtpStoreService } from './otp-store.service';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
export declare class OtpController {
    private readonly otpService;
    private readonly otpStoreService;
    constructor(otpService: OtpService, otpStoreService: OtpStoreService);
    sendOtp(body: SendOtpDto): Promise<{
        message: string;
        mobileNumber: string;
    }>;
    verifyOtp(body: VerifyOtpDto): Promise<{
        statusCode: number;
        message: string;
        data: {
            mobileNumber: string;
            isVerified: boolean;
        };
    }>;
}
