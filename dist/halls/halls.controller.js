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
exports.HallsController = void 0;
const common_1 = require("@nestjs/common");
const halls_service_1 = require("./halls.service");
const hallform_service_1 = require("../hallform/hallform.service");
const create_hall_dto_1 = require("./dto/create-hall.dto");
const update_hall_dto_1 = require("./dto/update-hall.dto");
const auth_guard_1 = require("../auth/auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
let HallsController = class HallsController {
    constructor(hallsService, hallFormService) {
        this.hallsService = hallsService;
        this.hallFormService = hallFormService;
    }
    async getAllHallAvailability() {
        return this.hallsService.getAllHallAvailability();
    }
    async getHallAvailability(hallId, date) {
        if (!hallId || !date) {
            throw new common_1.BadRequestException('hallId and date are required');
        }
        return this.hallsService.getHallAvailability(hallId, date);
    }
    async createHall(createHallDto, session) {
        if (!session.user) {
            throw new common_1.BadRequestException('User not authenticated');
        }
        return this.hallsService.createHall(createHallDto);
    }
    async getAllHalls() {
        return this.hallsService.getAllHalls();
    }
    async getHallById(id) {
        return this.hallsService.getHallById(id);
    }
    async updateHall(id, updateHallDto, session) {
        if (!session.user) {
            throw new common_1.BadRequestException('User not authenticated');
        }
        return this.hallsService.updateHall(id, updateHallDto);
    }
    async deleteHall(id) {
        return this.hallsService.deleteHall(id);
    }
    async deleteAllHalls() {
        return this.hallsService.deleteAllHalls();
    }
    async disableHallAvailability(disableDto) {
        const { hallId, date, reason, adminId } = disableDto;
        return this.hallFormService.disableHallAvailability(hallId, date, reason, adminId);
    }
    async enableHallAvailability(enableDto) {
        const { hallId, date, adminId } = enableDto;
        return this.hallFormService.enableHallAvailability(hallId, date, adminId);
    }
};
exports.HallsController = HallsController;
__decorate([
    (0, common_1.Get)('availability'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HallsController.prototype, "getAllHallAvailability", null);
__decorate([
    __param(0, (0, common_1.Query)('hallId')),
    __param(1, (0, common_1.Query)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], HallsController.prototype, "getHallAvailability", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.SessionAuthGuard),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, common_1.SetMetadata)('role', 'Admin'),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Session)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_hall_dto_1.CreateHallDto, Object]),
    __metadata("design:returntype", Promise)
], HallsController.prototype, "createHall", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HallsController.prototype, "getAllHalls", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], HallsController.prototype, "getHallById", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.SessionAuthGuard),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, common_1.SetMetadata)('role', 'Admin'),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Session)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_hall_dto_1.UpdateHallDto, Object]),
    __metadata("design:returntype", Promise)
], HallsController.prototype, "updateHall", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.SessionAuthGuard),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, common_1.SetMetadata)('role', 'Admin'),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], HallsController.prototype, "deleteHall", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.SessionAuthGuard),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, common_1.SetMetadata)('role', 'Admin'),
    (0, common_1.Delete)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HallsController.prototype, "deleteAllHalls", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.SessionAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.SetMetadata)('role', 'Admin'),
    (0, common_1.Post)('disable'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], HallsController.prototype, "disableHallAvailability", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.SessionAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.SetMetadata)('role', 'Admin'),
    (0, common_1.Post)('enable'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], HallsController.prototype, "enableHallAvailability", null);
exports.HallsController = HallsController = __decorate([
    (0, common_1.Controller)('halls'),
    __metadata("design:paramtypes", [halls_service_1.HallsService,
        hallform_service_1.HallFormService])
], HallsController);
//# sourceMappingURL=halls.controller.js.map