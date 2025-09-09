import { GalleryService } from './gallery.service';
import { GalleryDto } from './dto/gallery.dto';
import { SupabaseService } from '../supabase/supabase.service';
export declare class GalleryController {
    private readonly galleryService;
    private readonly supabaseService;
    constructor(galleryService: GalleryService, supabaseService: SupabaseService);
    createGallery(title: string, imageId: number): Promise<{
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
        title: string;
        gallery_id: number;
    }>;
    updateGallery(galleryId: number, title: string, imageId: number): Promise<{
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
        title: string;
        gallery_id: number;
    }>;
    deleteGallery(galleryId: number): Promise<{
        image_id: number;
        title: string;
        gallery_id: number;
    }>;
    getGalleryById(galleryId: number): Promise<GalleryDto>;
    getAllGalleries(): Promise<GalleryDto[]>;
}
