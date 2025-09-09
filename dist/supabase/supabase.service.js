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
exports.SupabaseService = void 0;
const common_1 = require("@nestjs/common");
const supabase_js_1 = require("@supabase/supabase-js");
const prisma_service_1 = require("../prisma/prisma.service");
const uuid_1 = require("uuid");
let SupabaseService = class SupabaseService {
    constructor(prisma) {
        this.prisma = prisma;
        this.bucket = 'shrirama_image';
        this.supabase = (0, supabase_js_1.createClient)(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
    }
    async uploadToSupabase(fileBuffer, userId) {
        const fileName = `${(0, uuid_1.v4)()}.webp`;
        const filePath = `images/${fileName}`;
        const altText = this.generateAltText(fileName);
        const compressedBuffer = await this.compressImage(fileBuffer);
        console.log('Compressed Buffer Size:', compressedBuffer.length);
        const { error } = await this.supabase.storage
            .from(this.bucket)
            .upload(filePath, compressedBuffer, {
            contentType: 'image/webp',
            upsert: true,
        });
        if (error) {
            throw new common_1.HttpException({
                statusCode: error.statusCode || 400,
                message: error.message || 'Failed to upload image to Supabase',
                details: error,
            }, error.statusCode || 400);
        }
        console.log('File uploaded to Supabase:', filePath);
        return this.prisma.images.create({
            data: {
                file_path: filePath,
                alt_text: altText,
                created_by: userId,
                created_at: new Date(),
            },
        });
    }
    async updateImage(imageId, fileBuffer, userId) {
        const fileName = `${(0, uuid_1.v4)()}.webp`;
        const filePath = `images/${fileName}`;
        const altText = this.generateAltText(fileName);
        const compressedBuffer = await this.compressImage(fileBuffer);
        const { error } = await this.supabase.storage
            .from(this.bucket)
            .upload(filePath, compressedBuffer, {
            contentType: 'image/webp',
            upsert: true,
        });
        if (error) {
            throw new common_1.BadRequestException('Failed to upload image to Supabase');
        }
        return this.prisma.images.update({
            where: { image_id: imageId },
            data: {
                file_path: filePath,
                alt_text: altText,
                modified_by: userId,
                modified_at: new Date(),
            },
        });
    }
    async compressImage(fileBuffer) {
        const gm = (await Promise.resolve().then(() => require('gm'))).subClass({ imageMagick: true });
        return new Promise((resolve, reject) => {
            gm(fileBuffer)
                .setFormat('webp')
                .quality(80)
                .toBuffer((err, buffer) => {
                if (err) {
                    return reject(new Error(`Image processing failed: ${err.message}`));
                }
                resolve(buffer);
            });
        });
    }
    generateAltText(fileName) {
        const nameWithoutExtension = fileName.replace(/\.[^/.]+$/, '');
        return nameWithoutExtension.replace(/[_-]/g, ' ');
    }
    getPublicUrl(filePath) {
        return `${process.env.SUPABASE_URL}/storage/v1/object/public/${this.bucket}/${filePath}`;
    }
    async getImagesBatch(limit, page) {
        const skip = (page - 1) * limit;
        return this.prisma.images.findMany({
            skip,
            take: limit,
        });
    }
    async deleteImage(imageId) {
        const imageRecord = await this.prisma.images.findUnique({
            where: { image_id: imageId },
        });
        if (!imageRecord) {
            throw new common_1.NotFoundException('Image not found');
        }
        const { error } = await this.supabase.storage
            .from(this.bucket)
            .remove([imageRecord.file_path]);
        if (error) {
            throw new common_1.BadRequestException('Failed to delete image from Supabase');
        }
        await this.prisma.images.delete({
            where: { image_id: imageId },
        });
        return { message: 'Image deleted successfully' };
    }
};
exports.SupabaseService = SupabaseService;
exports.SupabaseService = SupabaseService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SupabaseService);
//# sourceMappingURL=supabase.service.js.map