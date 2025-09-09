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
exports.HallsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const base_service_1 = require("../common/utils/base.service");
const supabase_service_1 = require("../supabase/supabase.service");
let HallsService = class HallsService extends base_service_1.BaseService {
    constructor(prisma, supabaseService) {
        super();
        this.prisma = prisma;
        this.supabaseService = supabaseService;
    }
    async createHall(createHallDto) {
        const { name, description, name_kannada, description_kannada, available, imageIds, } = createHallDto;
        if (!imageIds || imageIds.length === 0) {
            throw new common_1.BadRequestException('At least one image must be associated with the hall.');
        }
        return await this.prisma.halls.create({
            data: {
                name,
                description,
                name_kannada,
                description_kannada,
                available: available ?? true,
                HallImages: {
                    create: imageIds.map((id) => ({ image_id: id })),
                },
            },
            include: {
                HallImages: {
                    include: {
                        Images: true,
                    },
                },
            },
        });
    }
    async getAllHalls() {
        const halls = await this.prisma.halls.findMany({
            include: {
                HallImages: {
                    include: {
                        Images: true,
                    },
                },
            },
        });
        return halls.map((hall) => ({
            ...hall,
            HallImages: hall.HallImages.map((hallImage) => ({
                ...hallImage,
                Images: {
                    ...hallImage.Images,
                    public_url: this.supabaseService.getPublicUrl(hallImage.Images.file_path),
                },
            })),
        }));
    }
    async getHallById(hallId) {
        const hall = await this.handleDatabaseOperation(this.prisma.halls.findUnique({
            where: { hall_id: hallId },
            include: {
                HallImages: {
                    include: {
                        Images: true,
                    },
                },
            },
        }), hallId, 'Hall');
        return {
            ...hall,
            HallImages: hall.HallImages.map((hallImage) => ({
                ...hallImage,
                Images: {
                    ...hallImage.Images,
                    public_url: this.supabaseService.getPublicUrl(hallImage.Images.file_path),
                },
            })),
        };
    }
    async updateHall(hallId, updateHallDto) {
        await this.handleDatabaseOperation(this.prisma.halls.findUnique({
            where: { hall_id: hallId },
        }), hallId, 'Hall');
        const { name, description, name_kannada, description_kannada, available, imageIds, } = updateHallDto;
        const updatedHall = await this.prisma.halls.update({
            where: { hall_id: hallId },
            data: {
                name,
                description,
                name_kannada,
                description_kannada,
                available,
                HallImages: imageIds
                    ? {
                        deleteMany: {},
                        create: imageIds.map((id) => ({ image_id: id })),
                    }
                    : undefined,
            },
            include: {
                HallImages: {
                    include: {
                        Images: true,
                    },
                },
            },
        });
        return {
            ...updatedHall,
            HallImages: updatedHall.HallImages.map((hallImage) => ({
                ...hallImage,
                Images: {
                    ...hallImage.Images,
                    public_url: this.supabaseService.getPublicUrl(hallImage.Images.file_path),
                },
            })),
        };
    }
    async deleteHall(hallId) {
        const hall = await this.prisma.halls.findUnique({
            where: { hall_id: hallId },
            include: {
                HallImages: {
                    include: {
                        Images: true,
                    },
                },
            },
        });
        if (!hall) {
            throw new common_1.NotFoundException('Hall not found.');
        }
        const imageIds = hall.HallImages?.map((hallImage) => hallImage.Images?.image_id);
        await this.prisma.hallImages.deleteMany({
            where: { hall_id: hallId },
        });
        const deletedHall = await this.prisma.halls.delete({
            where: { hall_id: hallId },
        });
        if (imageIds && imageIds.length > 0) {
            for (const imageId of imageIds) {
                if (imageId) {
                    await this.supabaseService.deleteImage(imageId);
                }
            }
        }
        return {
            message: 'Hall, associated images, and HallImages rows deleted successfully',
            deletedHall,
        };
    }
    async deleteAllHalls() {
        await this.prisma.halls.deleteMany();
        return { message: 'All Halls deleted successfully' };
    }
    async getAllHallAvailability() {
        return this.prisma.hallAvailability.findMany({
            include: {
                hall: true,
                createdByUser: true,
            },
        });
    }
    async getHallAvailability(hallId, date) {
        if (!hallId || !date) {
            throw new common_1.BadRequestException('Hall ID and date are required');
        }
        return this.prisma.hallAvailability.findMany({
            where: {
                hall_id: hallId,
                date: new Date(date).toISOString(),
            },
            include: {
                hall: true,
                createdByUser: true,
            },
        });
    }
};
exports.HallsService = HallsService;
exports.HallsService = HallsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        supabase_service_1.SupabaseService])
], HallsService);
//# sourceMappingURL=halls.service.js.map