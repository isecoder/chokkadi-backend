import { PrismaService } from '../prisma/prisma.service';
import { SupabaseService } from '../supabase/supabase.service';
export declare class NewsUpdatesService {
    private prisma;
    private supabaseService;
    constructor(prisma: PrismaService, supabaseService: SupabaseService);
    createNewsUpdate(data: {
        title: string;
        content: string;
        title_kannada?: string;
        content_kannada?: string;
        created_by: number;
        imageIds: number[];
    }): Promise<{
        NewsImages: ({
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
            news_id: number;
        })[];
    } & {
        created_by: number | null;
        created_at: Date;
        title: string;
        content: string;
        title_kannada: string;
        content_kannada: string;
        news_id: number;
        updated_at: Date;
    }>;
    updateNewsUpdate(newsId: number, data: {
        title?: string;
        content?: string;
        title_kannada?: string;
        content_kannada?: string;
        updated_by: number;
        imageIds?: number[];
    }): Promise<{
        NewsImages: ({
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
            news_id: number;
        })[];
    } & {
        created_by: number | null;
        created_at: Date;
        title: string;
        content: string;
        title_kannada: string;
        content_kannada: string;
        news_id: number;
        updated_at: Date;
    }>;
    deleteNewsUpdate(newsId: number): Promise<{
        message: string;
        deletedNews: {
            created_by: number | null;
            created_at: Date;
            title: string;
            content: string;
            title_kannada: string;
            content_kannada: string;
            news_id: number;
            updated_at: Date;
        };
    }>;
    getNewsUpdateById(newsId: number): Promise<{
        NewsImages: ({
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
            news_id: number;
        })[];
    } & {
        created_by: number | null;
        created_at: Date;
        title: string;
        content: string;
        title_kannada: string;
        content_kannada: string;
        news_id: number;
        updated_at: Date;
    }>;
    getAllNewsUpdates(): Promise<{
        NewsImages: {
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
            news_id: number;
        }[];
        created_by: number | null;
        created_at: Date;
        title: string;
        content: string;
        title_kannada: string;
        content_kannada: string;
        news_id: number;
        updated_at: Date;
    }[]>;
}
