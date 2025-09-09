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
exports.HallFormService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const base_service_1 = require("../common/utils/base.service");
let HallFormService = class HallFormService extends base_service_1.BaseService {
    constructor(prisma) {
        super();
        this.prisma = prisma;
    }
    async createHallForm(createHallFormDto) {
        const { mobileNumber, date, hallId, name, reason, mobileNumberConfirmation, } = createHallFormDto;
        if (mobileNumber !== mobileNumberConfirmation) {
            throw new common_1.BadRequestException('Mobile number confirmation does not match.');
        }
        const parsedDate = new Date(date);
        parsedDate.setUTCHours(0, 0, 0, 0);
        if (isNaN(parsedDate.getTime())) {
            throw new common_1.BadRequestException('Invalid date format. Please use ISO format.');
        }
        const hall = await this.prisma.halls.findUnique({
            where: { hall_id: hallId },
        });
        if (!hall) {
            throw new common_1.NotFoundException(`Hall with ID ${hallId} not found.`);
        }
        const startOfDay = new Date(parsedDate);
        const endOfDay = new Date(parsedDate);
        endOfDay.setUTCHours(23, 59, 59, 999);
        const existingBooking = await this.prisma.hallAvailability.findFirst({
            where: {
                hall_id: hallId,
                date: { gte: startOfDay, lte: endOfDay },
                is_booked: true,
            },
        });
        if (existingBooking) {
            throw new common_1.BadRequestException('The hall is already unavailable for the selected date.');
        }
        const createdHallForm = await this.prisma.hallForm.create({
            data: {
                name,
                mobileNumber,
                mobileNumberConfirmation,
                date: parsedDate,
                hall: {
                    connect: { hall_id: hallId },
                },
                reason,
            },
        });
        await this.prisma.hallAvailability.create({
            data: {
                hall_id: hallId,
                date: startOfDay,
                is_booked: false,
                reason: 'On hold',
            },
        });
        const bookingId = `DES${createdHallForm.id}`;
        return {
            bookingId,
            date: parsedDate.toISOString().split('T')[0],
        };
    }
    async getAllHallForms() {
        const hallForms = await this.prisma.hallForm.findMany({
            include: {
                hall: {
                    select: {
                        name: true,
                        description: true,
                        name_kannada: true,
                        description_kannada: true,
                        available: true,
                        hallAvailability: true,
                        HallImages: true,
                    },
                },
            },
        });
        return hallForms.map((form) => ({
            ...form,
            date: new Date(form.date).toISOString().split('T')[0],
            hall: {
                ...form.hall,
                hallAvailability: form.hall.hallAvailability.map((availability) => ({
                    ...availability,
                    date: new Date(availability.date).toISOString().split('T')[0],
                })),
            },
        }));
    }
    async getHallFormsByParams(filter) {
        const hallForms = await this.prisma.hallForm.findMany({
            where: {
                OR: [
                    { id: filter.id },
                    { name: { contains: filter.name } },
                    { mobileNumber: filter.phoneNumber },
                    { date: filter.date ? new Date(filter.date) : undefined },
                ],
            },
            include: {
                hall: { select: { name: true } },
            },
        });
        return hallForms.map((form) => ({
            ...form,
            date: new Date(form.date).toISOString().split('T')[0],
        }));
    }
    async deleteAllHallForms() {
        return this.prisma.hallForm.deleteMany();
    }
    async deleteHallFormById(id) {
        const booking = await this.prisma.hallForm.findUnique({ where: { id } });
        if (!booking) {
            throw new common_1.NotFoundException(`Hall Form with ID ${id} not found.`);
        }
        await this.prisma.hallAvailability.deleteMany({
            where: { hall_id: booking.hallId, date: booking.date },
        });
        return this.prisma.hallForm.delete({ where: { id } });
    }
    async disableHallAvailability(hallId, date, reason, adminId) {
        const parsedDate = new Date(date);
        parsedDate.setUTCHours(0, 0, 0, 0);
        if (isNaN(parsedDate.getTime())) {
            throw new common_1.BadRequestException('Invalid date format. Please use ISO format.');
        }
        const startOfDay = new Date(parsedDate);
        const existingBooking = await this.prisma.hallAvailability.findFirst({
            where: { hall_id: hallId, date: startOfDay, is_booked: true },
        });
        if (existingBooking) {
            throw new common_1.BadRequestException('The hall is already booked for the selected date.');
        }
        return this.prisma.hallAvailability.create({
            data: {
                hall_id: hallId,
                date: startOfDay,
                is_booked: false,
                reason,
                createdBy: adminId,
            },
        });
    }
    async confirmReserve(hallFormId, date) {
        const parsedDate = new Date(date);
        parsedDate.setUTCHours(0, 0, 0, 0);
        if (isNaN(parsedDate.getTime())) {
            throw new common_1.BadRequestException('Invalid date format. Please use ISO format.');
        }
        return await this.prisma.$transaction(async (prisma) => {
            const hallForm = await prisma.hallForm.findUnique({
                where: { id: hallFormId },
            });
            if (!hallForm ||
                new Date(hallForm.date).getTime() !== parsedDate.getTime()) {
                throw new common_1.NotFoundException('No hall form found for the specified ID and date.');
            }
            const availability = await prisma.hallAvailability.findFirst({
                where: {
                    hall_id: hallForm.hallId,
                    date: parsedDate,
                    is_booked: false,
                },
            });
            if (!availability) {
                throw new common_1.BadRequestException('The hall is either already booked or not available for the selected date.');
            }
            await prisma.hallAvailability.update({
                where: { id: availability.id },
                data: {
                    is_booked: true,
                    reason: `Booked for ${hallForm.reason}`,
                },
            });
            const bookingId = `DES${hallForm.id}`;
            return {
                bookingId,
                hallForm,
            };
        });
    }
    async enableHallAvailability(hallId, date, adminId) {
        const parsedDate = new Date(date);
        parsedDate.setUTCHours(0, 0, 0, 0);
        if (isNaN(parsedDate.getTime())) {
            throw new common_1.BadRequestException('Invalid date format. Please use ISO format.');
        }
        const startOfDay = new Date(parsedDate);
        const disabledHall = await this.prisma.hallAvailability.findFirst({
            where: { hall_id: hallId, date: startOfDay, is_booked: false },
        });
        if (!disabledHall) {
            throw new common_1.BadRequestException('The hall is not disabled for the selected date.');
        }
        return this.prisma.hallAvailability.update({
            where: { id: disabledHall.id },
            data: {
                is_booked: true,
                reason: `Enabled by Admin ID: ${adminId}`,
            },
        });
    }
    async generateBookingId(numericId) {
        return `DES${numericId}`;
    }
    async createManualHallForm(createHallFormDto) {
        const { mobileNumber, date, hallId, name, reason, mobileNumberConfirmation, } = createHallFormDto;
        if (mobileNumber !== mobileNumberConfirmation) {
            throw new common_1.BadRequestException('Mobile number confirmation does not match.');
        }
        const parsedDate = new Date(date);
        parsedDate.setUTCHours(0, 0, 0, 0);
        if (isNaN(parsedDate.getTime())) {
            throw new common_1.BadRequestException('Invalid date format. Please use ISO format.');
        }
        const hall = await this.prisma.halls.findUnique({
            where: { hall_id: hallId },
        });
        if (!hall) {
            throw new common_1.NotFoundException(`Hall with ID ${hallId} not found.`);
        }
        const startOfDay = new Date(parsedDate);
        const endOfDay = new Date(parsedDate);
        endOfDay.setUTCHours(23, 59, 59, 999);
        const existingBooking = await this.prisma.hallAvailability.findFirst({
            where: {
                hall_id: hallId,
                date: { gte: startOfDay, lte: endOfDay },
                is_booked: true,
            },
        });
        if (existingBooking) {
            throw new common_1.BadRequestException('The hall is already unavailable for the selected date.');
        }
        const createdHallForm = await this.prisma.hallForm.create({
            data: {
                name,
                mobileNumber,
                mobileNumberConfirmation,
                date: parsedDate,
                hall: {
                    connect: { hall_id: hallId },
                },
                reason,
            },
        });
        await this.prisma.hallAvailability.create({
            data: {
                hall_id: hallId,
                date: startOfDay,
                is_booked: true,
                reason: createdHallForm.reason,
            },
        });
        const bookingId = `DES${createdHallForm.id}`;
        return {
            bookingId,
            date: parsedDate.toISOString().split('T')[0],
        };
    }
    async updatePaymentDetails(id, updatePaymentDto) {
        const hallForm = await this.prisma.hallForm.findUnique({ where: { id } });
        if (!hallForm) {
            throw new common_1.NotFoundException(`HallForm with ID ${id} not found`);
        }
        return this.prisma.hallForm.update({
            where: { id },
            data: { paymentDetails: updatePaymentDto.paymentDetails },
        });
    }
};
exports.HallFormService = HallFormService;
exports.HallFormService = HallFormService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], HallFormService);
//# sourceMappingURL=hallform.service.js.map