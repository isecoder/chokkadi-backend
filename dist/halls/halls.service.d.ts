import { PrismaService } from '../prisma/prisma.service';
import { CreateHallDto } from './dto/create-hall.dto';
import { UpdateHallDto } from './dto/update-hall.dto';
import { BaseService } from 'src/common/utils/base.service';
import { SupabaseService } from '../supabase/supabase.service';
export declare class HallsService extends BaseService {
    private readonly prisma;
    private readonly supabaseService;
    constructor(prisma: PrismaService, supabaseService: SupabaseService);
    createHall(createHallDto: CreateHallDto): Promise<{
        HallImages: ({
            Images: {
                image_id: number;
                alt_text: string | null;
                file_path: string;
                created_by: number;
                created_at: Date;
                modified_by: number | null;
                modified_at: Date;
            };
        } & {
            image_id: number;
            id: number;
            hall_id: number;
        })[];
    } & {
        name: string;
        description: string;
        name_kannada: string;
        description_kannada: string;
        available: boolean;
        hall_id: number;
    }>;
    getAllHalls(): Promise<{
        HallImages: {
            Images: {
                public_url: string;
                image_id: number;
                alt_text: string | null;
                file_path: string;
                created_by: number;
                created_at: Date;
                modified_by: number | null;
                modified_at: Date;
            };
            image_id: number;
            id: number;
            hall_id: number;
        }[];
        name: string;
        description: string;
        name_kannada: string;
        description_kannada: string;
        available: boolean;
        hall_id: number;
    }[]>;
    getHallById(hallId: number): Promise<{
        HallImages: {
            Images: {
                public_url: string;
                image_id: number;
                alt_text: string | null;
                file_path: string;
                created_by: number;
                created_at: Date;
                modified_by: number | null;
                modified_at: Date;
            };
            image_id: number;
            id: number;
            hall_id: number;
        }[];
        name: string;
        description: string;
        name_kannada: string;
        description_kannada: string;
        available: boolean;
        hall_id: number;
    }>;
    updateHall(hallId: number, updateHallDto: UpdateHallDto): Promise<{
        HallImages: {
            Images: {
                public_url: string;
                image_id: number;
                alt_text: string | null;
                file_path: string;
                created_by: number;
                created_at: Date;
                modified_by: number | null;
                modified_at: Date;
            };
            image_id: number;
            id: number;
            hall_id: number;
        }[];
        name: string;
        description: string;
        name_kannada: string;
        description_kannada: string;
        available: boolean;
        hall_id: number;
    }>;
    deleteHall(hallId: number): Promise<{
        message: string;
        deletedHall: {
            name: string;
            description: string;
            name_kannada: string;
            description_kannada: string;
            available: boolean;
            hall_id: number;
        };
    }>;
    deleteAllHalls(): Promise<{
        message: string;
    }>;
    getAllHallAvailability(): Promise<({
        hall: {
            name: string;
            description: string;
            name_kannada: string;
            description_kannada: string;
            available: boolean;
            hall_id: number;
        };
        createdByUser: {
            user_id: number;
            name: string;
            email: string;
            phone: string;
            password: string | null;
            role_id: number;
            createdAt: Date;
            auth_provider: string;
        };
    } & {
        createdAt: Date;
        createdBy: number | null;
        id: number;
        hall_id: number;
        date: Date;
        reason: string | null;
        is_booked: boolean;
    })[]>;
    getHallAvailability(hallId: number, date: string): Promise<({
        hall: {
            name: string;
            description: string;
            name_kannada: string;
            description_kannada: string;
            available: boolean;
            hall_id: number;
        };
        createdByUser: {
            user_id: number;
            name: string;
            email: string;
            phone: string;
            password: string | null;
            role_id: number;
            createdAt: Date;
            auth_provider: string;
        };
    } & {
        createdAt: Date;
        createdBy: number | null;
        id: number;
        hall_id: number;
        date: Date;
        reason: string | null;
        is_booked: boolean;
    })[]>;
}
