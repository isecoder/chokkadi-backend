export declare class OtpStoreService {
    private otpStore;
    setOtp(mobileNumber: string, otpData: {
        otp: string;
        isVerified: boolean;
    }): void;
    getOtp(mobileNumber: string): {
        otp: string;
        isVerified: boolean;
    };
    deleteOtp(mobileNumber: string): void;
    logStore(): void;
}
