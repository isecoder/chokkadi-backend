"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GalleryService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const supabase_service_1 = require("../supabase/supabase.service");
let GalleryService = class GalleryService {
    constructor(prisma, supabaseService) {
        this.prisma = prisma;
        this.supabaseService = supabaseService;
    }
    async createGallery(title, imageId) {
        if (!imageId) {
            throw new common_1.BadRequestException('Image ID must be provided.');
        }
        const image = await this.prisma.images.findUnique({
            where: { image_id: imageId },
        });
        if (!image) {
            throw new common_1.NotFoundException('Image not found.');
        }
        return this.prisma.gallery.create({
            data: {
                title,
                image_id: imageId,
            },
            include: {
                Images: true,
            },
        });
    }
    async updateGallery(galleryId, title, imageId) {
        const gallery = await this.prisma.gallery.findUnique({
            where: { gallery_id: galleryId },
        });
        if (!gallery) {
            throw new common_1.NotFoundException('Gallery not found.');
        }
        const image = await this.prisma.images.findUnique({
            where: { image_id: imageId },
        });
        if (!image) {
            throw new common_1.NotFoundException('Image not found.');
        }
        return this.prisma.gallery.update({
            where: { gallery_id: galleryId },
            data: {
                title,
                image_id: imageId,
            },
            include: {
                Images: true,
            },
        });
    }
    async deleteGallery(galleryId) {
        const gallery = await this.prisma.gallery.findUnique({
            where: { gallery_id: galleryId },
            include: {
                Images: true,
            },
        });
        if (!gallery) {
            throw new common_1.NotFoundException('Gallery not found.');
        }
        const imageId = gallery.Images?.image_id;
        const deletedGallery = await this.prisma.gallery.delete({
            where: { gallery_id: galleryId },
        });
        if (imageId) {
            await this.supabaseService.deleteImage(imageId);
        }
        return deletedGallery;
    }
    async getGalleryById(galleryId) {
        const gallery = await this.prisma.gallery.findUnique({
            where: { gallery_id: galleryId },
            include: { Images: true },
        });
        if (!gallery) {
            throw new common_1.NotFoundException('Gallery not found.');
        }
        return gallery;
    }
    async getAllGalleries() {
        return this.prisma.gallery.findMany({
            include: { Images: true },
        });
    }
};
exports.GalleryService = GalleryService;
exports.GalleryService = GalleryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        supabase_service_1.SupabaseService])
], GalleryService);
//# sourceMappingURL=gallery.service.js.map