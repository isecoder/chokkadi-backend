import { SupabaseService } from './supabase.service';
export declare class ImageController {
    private supabaseService;
    constructor(supabaseService: SupabaseService);
    uploadImage(file: any, req: any): Promise<{
        image_id: number;
        alt_text: string | null;
        file_path: string;
        created_by: number;
        created_at: Date;
        modified_by: number | null;
        modified_at: Date;
    }>;
    updateImage(imageId: number, file: any, req: any): Promise<{
        image_id: number;
        alt_text: string | null;
        file_path: string;
        created_by: number;
        created_at: Date;
        modified_by: number | null;
        modified_at: Date;
    }>;
    deleteImage(imageId: number, req: any): Promise<{
        message: string;
    }>;
    getImageBatch(limit?: string, page?: string): Promise<{
        images: {
            public_url: string;
            image_id: number;
            alt_text: string | null;
            file_path: string;
            created_by: number;
            created_at: Date;
            modified_by: number | null;
            modified_at: Date;
        }[];
    }>;
}
