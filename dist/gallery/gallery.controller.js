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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GalleryController = void 0;
const common_1 = require("@nestjs/common");
const gallery_service_1 = require("./gallery.service");
const supabase_service_1 = require("../supabase/supabase.service");
let GalleryController = class GalleryController {
    constructor(galleryService, supabaseService) {
        this.galleryService = galleryService;
        this.supabaseService = supabaseService;
    }
    async createGallery(title, imageId) {
        if (!title) {
            throw new common_1.BadRequestException('Title is required.');
        }
        if (!imageId) {
            throw new common_1.BadRequestException('Image ID is required.');
        }
        return this.galleryService.createGallery(title, imageId);
    }
    async updateGallery(galleryId, title, imageId) {
        if (!title) {
            throw new common_1.BadRequestException('Title is required.');
        }
        if (!imageId) {
            throw new common_1.BadRequestException('Image ID is required.');
        }
        return this.galleryService.updateGallery(galleryId, title, imageId);
    }
    async deleteGallery(galleryId) {
        return this.galleryService.deleteGallery(galleryId);
    }
    async getGalleryById(galleryId) {
        const gallery = await this.galleryService.getGalleryById(galleryId);
        if (gallery && gallery.Images) {
            gallery.Images = {
                ...gallery.Images,
                public_url: this.supabaseService.getPublicUrl(gallery.Images.file_path),
            };
        }
        return gallery;
    }
    async getAllGalleries() {
        const galleries = await this.galleryService.getAllGalleries();
        return galleries.map((gallery) => {
            if (gallery.Images) {
                gallery.Images = {
                    ...gallery.Images,
                    public_url: this.supabaseService.getPublicUrl(gallery.Images.file_path),
                };
            }
            return gallery;
        });
    }
};
exports.GalleryController = GalleryController;
__decorate([
    (0, common_1.Post)('create'),
    __param(0, (0, common_1.Body)('title')),
    __param(1, (0, common_1.Body)('imageId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], GalleryController.prototype, "createGallery", null);
__decorate([
    (0, common_1.Put)('update/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('title')),
    __param(2, (0, common_1.Body)('imageId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, Number]),
    __metadata("design:returntype", Promise)
], GalleryController.prototype, "updateGallery", null);
__decorate([
    (0, common_1.Delete)('delete/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], GalleryController.prototype, "deleteGallery", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], GalleryController.prototype, "getGalleryById", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GalleryController.prototype, "getAllGalleries", null);
exports.GalleryController = GalleryController = __decorate([
    (0, common_1.Controller)('gallery'),
    __metadata("design:paramtypes", [gallery_service_1.GalleryService,
        supabase_service_1.SupabaseService])
], GalleryController);
//# sourceMappingURL=gallery.controller.js.map