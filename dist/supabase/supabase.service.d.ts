import { PrismaService } from '../prisma/prisma.service';
export declare class SupabaseService {
    private prisma;
    private supabase;
    private bucket;
    constructor(prisma: PrismaService);
    uploadToSupabase(fileBuffer: Buffer, userId: number): Promise<{
        image_id: number;
        alt_text: string | null;
        file_path: string;
        created_by: number;
        created_at: Date;
        modified_by: number | null;
        modified_at: Date;
    }>;
    updateImage(imageId: number, fileBuffer: Buffer, userId: number): Promise<{
        image_id: number;
        alt_text: string | null;
        file_path: string;
        created_by: number;
        created_at: Date;
        modified_by: number | null;
        modified_at: Date;
    }>;
    private compressImage;
    private generateAltText;
    getPublicUrl(filePath: string): string;
    getImagesBatch(limit: number, page: number): Promise<{
        image_id: number;
        alt_text: string | null;
        file_path: string;
        created_by: number;
        created_at: Date;
        modified_by: number | null;
        modified_at: Date;
    }[]>;
    deleteImage(imageId: number): Promise<{
        message: string;
    }>;
}
