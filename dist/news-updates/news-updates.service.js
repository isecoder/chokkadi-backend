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
exports.NewsUpdatesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const supabase_service_1 = require("../supabase/supabase.service");
let NewsUpdatesService = class NewsUpdatesService {
    constructor(prisma, supabaseService) {
        this.prisma = prisma;
        this.supabaseService = supabaseService;
    }
    async createNewsUpdate(data) {
        const { title, content, title_kannada, content_kannada, created_by, imageIds, } = data;
        const newsUpdate = await this.prisma.newsUpdates.create({
            data: {
                title,
                content,
                title_kannada,
                content_kannada,
                created_by,
                NewsImages: {
                    create: imageIds.map((id) => ({ image_id: id })),
                },
            },
            include: {
                NewsImages: {
                    include: {
                        Images: true,
                    },
                },
            },
        });
        newsUpdate.NewsImages = await Promise.all(newsUpdate.NewsImages.map(async (newsImage) => {
            const image = newsImage.Images;
            return {
                ...newsImage,
                Images: {
                    ...image,
                    public_url: this.supabaseService.getPublicUrl(image.file_path),
                },
            };
        }));
        return newsUpdate;
    }
    async updateNewsUpdate(newsId, data) {
        const news = await this.prisma.newsUpdates.findUnique({
            where: { news_id: newsId },
        });
        if (!news) {
            throw new common_1.NotFoundException('News update not found');
        }
        const { title, content, title_kannada, content_kannada, imageIds } = data;
        const updatedNewsUpdate = await this.prisma.newsUpdates.update({
            where: { news_id: newsId },
            data: {
                title,
                content,
                title_kannada,
                content_kannada,
                updated_at: new Date(),
                NewsImages: imageIds
                    ? {
                        deleteMany: {},
                        create: imageIds.map((id) => ({ image_id: id })),
                    }
                    : undefined,
            },
            include: {
                NewsImages: {
                    include: {
                        Images: true,
                    },
                },
            },
        });
        updatedNewsUpdate.NewsImages = await Promise.all(updatedNewsUpdate.NewsImages.map(async (newsImage) => {
            const image = newsImage.Images;
            return {
                ...newsImage,
                Images: {
                    ...image,
                    public_url: this.supabaseService.getPublicUrl(image.file_path),
                },
            };
        }));
        return updatedNewsUpdate;
    }
    async deleteNewsUpdate(newsId) {
        const news = await this.prisma.newsUpdates.findUnique({
            where: { news_id: newsId },
            include: {
                NewsImages: {
                    include: {
                        Images: true,
                    },
                },
            },
        });
        if (!news) {
            throw new common_1.NotFoundException('News update not found');
        }
        const imageIds = news.NewsImages?.map((newsImage) => newsImage.Images?.image_id);
        await this.prisma.newsImages.deleteMany({
            where: { news_id: newsId },
        });
        const deletedNews = await this.prisma.newsUpdates.delete({
            where: { news_id: newsId },
        });
        if (imageIds && imageIds.length > 0) {
            for (const imageId of imageIds) {
                if (imageId) {
                    await this.supabaseService.deleteImage(imageId);
                }
            }
        }
        return {
            message: 'News update and associated images deleted successfully',
            deletedNews,
        };
    }
    async getNewsUpdateById(newsId) {
        const news = await this.prisma.newsUpdates.findUnique({
            where: { news_id: newsId },
            include: {
                NewsImages: {
                    include: {
                        Images: true,
                    },
                },
            },
        });
        if (!news) {
            throw new common_1.NotFoundException('News update not found');
        }
        news.NewsImages = await Promise.all(news.NewsImages.map(async (newsImage) => {
            const image = newsImage.Images;
            return {
                ...newsImage,
                Images: {
                    ...image,
                    public_url: this.supabaseService.getPublicUrl(image.file_path),
                },
            };
        }));
        return news;
    }
    async getAllNewsUpdates() {
        const newsUpdates = await this.prisma.newsUpdates.findMany({
            include: {
                NewsImages: {
                    include: {
                        Images: true,
                    },
                },
            },
        });
        const updatedNewsUpdates = await Promise.all(newsUpdates.map(async (newsUpdate) => {
            const updatedNewsImages = await Promise.all(newsUpdate.NewsImages.map(async (newsImage) => {
                const image = newsImage.Images;
                return {
                    ...newsImage,
                    Images: {
                        ...image,
                        public_url: this.supabaseService.getPublicUrl(image.file_path),
                    },
                };
            }));
            return {
                ...newsUpdate,
                NewsImages: updatedNewsImages,
            };
        }));
        return updatedNewsUpdates;
    }
};
exports.NewsUpdatesService = NewsUpdatesService;
exports.NewsUpdatesService = NewsUpdatesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        supabase_service_1.SupabaseService])
], NewsUpdatesService);
//# sourceMappingURL=news-updates.service.js.map