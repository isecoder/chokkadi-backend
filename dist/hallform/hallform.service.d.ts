import { PrismaService } from '../prisma/prisma.service';
import { CreateHallFormDto } from './dto/create-hallform.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { BaseService } from 'src/common/utils/base.service';
export declare class HallFormService extends BaseService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createHallForm(createHallFormDto: CreateHallFormDto): Promise<{
        bookingId: string;
        date: string;
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
    getHallFormsByParams(filter: any): Promise<{
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
    disableHallAvailability(hallId: number, date: string, reason: string, adminId: number): Promise<{
        createdAt: Date;
        createdBy: number | null;
        id: number;
        hall_id: number;
        date: Date;
        reason: string | null;
        is_booked: boolean;
    }>;
    confirmReserve(hallFormId: number, date: Date): Promise<any>;
    enableHallAvailability(hallId: number, date: string, adminId: number): Promise<{
        createdAt: Date;
        createdBy: number | null;
        id: number;
        hall_id: number;
        date: Date;
        reason: string | null;
        is_booked: boolean;
    }>;
    generateBookingId(numericId: number): Promise<string>;
    createManualHallForm(createHallFormDto: CreateHallFormDto): Promise<{
        bookingId: string;
        date: string;
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
