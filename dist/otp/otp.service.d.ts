export declare class OtpService {
    private twilioClient;
    private sender;
    constructor();
    sendOtp(mobileNumber: string): Promise<string>;
    verifyOtp(inputOtp: string, storedOtp: string): Promise<boolean>;
    sendReserveRequest(details: {
        fullName: string;
        purpose: string;
        mobileNumber: string;
        bookingDate: string | Date;
        bookingId: string;
    }): Promise<void>;
    sendReserveUnderReview(details: {
        fullName: string;
        purpose: string;
        mobileNumber: string;
        bookingDate: Date;
        bookingId: string;
    }): Promise<void>;
    sendReserveConfirmation(details: {
        fullName: string;
        purpose: string;
        mobileNumber: string;
        bookingDate: Date;
        bookingId: string;
    }): Promise<void>;
}
