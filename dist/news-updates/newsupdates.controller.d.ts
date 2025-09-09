import { NewsUpdatesService } from './news-updates.service';
import { CreateNewsUpdateDto } from './dto/create-news-update.dto';
import { UpdateNewsUpdateDto } from './dto/update-news-update.dto';
export declare class NewsUpdatesController {
    private newsUpdatesService;
    constructor(newsUpdatesService: NewsUpdatesService);
    createNewsUpdate(createNewsUpdateDto: CreateNewsUpdateDto, req: any): Promise<{
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
    updateNewsUpdate(newsId: number, updateNewsUpdateDto: UpdateNewsUpdateDto, req: any): Promise<{
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
