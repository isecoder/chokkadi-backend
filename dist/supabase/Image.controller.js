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
exports.ImageController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const supabase_service_1 = require("./supabase.service");
const auth_guard_1 = require("../auth/auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
let ImageController = class ImageController {
    constructor(supabaseService) {
        this.supabaseService = supabaseService;
    }
    async uploadImage(file, req) {
        if (!file) {
            throw new common_1.BadRequestException('File is required');
        }
        const userId = req.session?.user?.id;
        if (!userId) {
            throw new common_1.BadRequestException('User not authenticated');
        }
        return this.supabaseService.uploadToSupabase(file.buffer, userId);
    }
    async updateImage(imageId, file, req) {
        if (!file) {
            throw new common_1.BadRequestException('File is required');
        }
        const userId = req.session?.user?.id;
        if (!userId) {
            throw new common_1.BadRequestException('User not authenticated');
        }
        return this.supabaseService.updateImage(imageId, file.buffer, userId);
    }
    async deleteImage(imageId, req) {
        const userId = req.session?.user?.id;
        if (!userId) {
            throw new common_1.BadRequestException('User not authenticated');
        }
        return this.supabaseService.deleteImage(imageId);
    }
    async getImageBatch(limit = '10', page = '1') {
        const limitNum = parseInt(limit, 10);
        const pageNum = parseInt(page, 10);
        const images = await this.supabaseService.getImagesBatch(limitNum, pageNum);
        const imagesWithPublicUrls = images.map((image) => ({
            ...image,
            public_url: this.supabaseService.getPublicUrl(image.file_path),
        }));
        return { images: imagesWithPublicUrls };
    }
};
exports.ImageController = ImageController;
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, common_1.SetMetadata)('role', 'Admin'),
    (0, common_1.Post)('upload'),
    (0, common_1.UseGuards)(auth_guard_1.SessionAuthGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ImageController.prototype, "uploadImage", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, common_1.SetMetadata)('role', 'Admin'),
    (0, common_1.Put)('update/:imageId'),
    (0, common_1.UseGuards)(auth_guard_1.SessionAuthGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.Param)('imageId')),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], ImageController.prototype, "updateImage", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, common_1.SetMetadata)('role', 'Admin'),
    (0, common_1.Delete)(':imageId'),
    (0, common_1.UseGuards)(auth_guard_1.SessionAuthGuard),
    __param(0, (0, common_1.Param)('imageId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ImageController.prototype, "deleteImage", null);
__decorate([
    (0, common_1.Get)('batch'),
    __param(0, (0, common_1.Query)('limit')),
    __param(1, (0, common_1.Query)('page')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ImageController.prototype, "getImageBatch", null);
exports.ImageController = ImageController = __decorate([
    (0, common_1.Controller)('images'),
    __metadata("design:paramtypes", [supabase_service_1.SupabaseService])
], ImageController);
//# sourceMappingURL=Image.controller.js.map