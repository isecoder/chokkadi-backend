import { HallFormService } from './hallform.service';
import { CreateHallFormDto } from './dto/create-hallform.dto';
import { ConfirmReserveDto } from './dto/confirm-reserve.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
export declare class HallFormController {
    private readonly hallFormService;
    constructor(hallFormService: HallFormService);
    submitHallForm(body: {
        mobileNumber: string;
        formDetails: CreateHallFormDto;
    }): Promise<{
        message: string;
        bookingId: string;
        date: string;
        formDetails: CreateHallFormDto;
    }>;
    confirmReserve(hallFormId: number, body: ConfirmReserveDto): Promise<{
        message: string;
        bookingId: any;
    }>;
    getAllHallForms(): Promise<{
        date: string;
        hall: {
            hallAvailability: {
                date: string;
                createdAt: Date;
                createdBy: number | null;
                id: number;
                hall_id: number;
                reason: string | null;
                is_booked: boolean;
            }[];
            name: string;
            HallImages: {
                image_id: number;
                id: number;
                hall_id: number;
            }[];
            description: string;
            name_kannada: string;
            description_kannada: string;
            available: boolean;
        };
        name: string;
        createdAt: Date;
        id: number;
        reason: string;
        mobileNumber: string;
        mobileNumberConfirmation: string;
        hallId: number;
        paymentDetails: string | null;
        modifiedAt: Date | null;
    }[]>;
    getHallFormsByParams(query: {
        id?: number;
        name?: string;
        phoneNumber?: string;
        date?: string;
    }): Promise<{
        date: string;
        hall: {
            name: string;
        };
        name: string;
        createdAt: Date;
        id: number;
        reason: string;
        mobileNumber: string;
        mobileNumberConfirmation: string;
        hallId: number;
        paymentDetails: string | null;
        modifiedAt: Date | null;
    }[]>;
    deleteAllHallForms(): Promise<import("@prisma/client").Prisma.BatchPayload>;
    deleteHallFormById(id: number): Promise<{
        name: string;
        createdAt: Date;
        id: number;
        date: Date;
        reason: string;
        mobileNumber: string;
        mobileNumberConfirmation: string;
        hallId: number;
        paymentDetails: string | null;
        modifiedAt: Date | null;
    }>;
    disableHallAvailability(body: {
        hallId: number;
        date: string;
        reason: string;
        adminId: number;
    }): Promise<{
        createdAt: Date;
        createdBy: number | null;
        id: number;
        hall_id: number;
        date: Date;
        reason: string | null;
        is_booked: boolean;
    }>;
    enableHallAvailability(body: {
        hallId: number;
        date: string;
        adminId: number;
    }): Promise<{
        createdAt: Date;
        createdBy: number | null;
        id: number;
        hall_id: number;
        date: Date;
        reason: string | null;
        is_booked: boolean;
    }>;
    submitHallFormWithoutOtp(body: {
        formDetails: CreateHallFormDto;
    }): Promise<{
        message: string;
        bookingId: string;
        date: string;
        formDetails: CreateHallFormDto;
    }>;
    updatePaymentDetails(id: number, updatePaymentDto: UpdatePaymentDto): Promise<{
        name: string;
        createdAt: Date;
        id: number;
        date: Date;
        reason: string;
        mobileNumber: string;
        mobileNumberConfirmation: string;
        hallId: number;
        paymentDetails: string | null;
        modifiedAt: Date | null;
    }>;
}
