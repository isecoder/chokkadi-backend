import { HallsService } from './halls.service';
import { HallFormService } from 'src/hallform/hallform.service';
import { CreateHallDto } from './dto/create-hall.dto';
import { UpdateHallDto } from './dto/update-hall.dto';
export declare class HallsController {
    private readonly hallsService;
    private readonly hallFormService;
    constructor(hallsService: HallsService, hallFormService: HallFormService);
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
    createHall(createHallDto: CreateHallDto, session: {
        user?: any;
    }): Promise<{
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
    getHallById(id: number): Promise<{
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
    updateHall(id: number, updateHallDto: UpdateHallDto, session: {
        user?: any;
    }): Promise<{
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
    deleteHall(id: number): Promise<{
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
    disableHallAvailability(disableDto: {
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
    enableHallAvailability(enableDto: {
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
}
