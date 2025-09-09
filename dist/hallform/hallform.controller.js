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
exports.HallFormController = void 0;
const common_1 = require("@nestjs/common");
const hallform_service_1 = require("./hallform.service");
const confirm_reserve_dto_1 = require("./dto/confirm-reserve.dto");
const update_payment_dto_1 = require("./dto/update-payment.dto");
const auth_guard_1 = require("../auth/auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
let HallFormController = class HallFormController {
    constructor(hallFormService) {
        this.hallFormService = hallFormService;
    }
    async submitHallForm(body) {
        const { mobileNumber, formDetails } = body;
        const { bookingId, date } = await this.hallFormService.createHallForm(formDetails);
        return {
            message: 'Hall form submitted successfully',
            bookingId,
            date,
            formDetails,
        };
    }
    async confirmReserve(hallFormId, body) {
        const { date } = body;
        if (!date) {
            throw new common_1.BadRequestException('Date is required.');
        }
        const { bookingId, hallForm } = await this.hallFormService.confirmReserve(hallFormId, date);
        return {
            message: 'Reservation confirmed successfully.',
            bookingId,
        };
    }
    async getAllHallForms() {
        return this.hallFormService.getAllHallForms();
    }
    async getHallFormsByParams(query) {
        return this.hallFormService.getHallFormsByParams(query);
    }
    async deleteAllHallForms() {
        return this.hallFormService.deleteAllHallForms();
    }
    async deleteHallFormById(id) {
        return this.hallFormService.deleteHallFormById(id);
    }
    async disableHallAvailability(body) {
        return this.hallFormService.disableHallAvailability(body.hallId, body.date, body.reason, body.adminId);
    }
    async enableHallAvailability(body) {
        return this.hallFormService.enableHallAvailability(body.hallId, body.date, body.adminId);
    }
    async submitHallFormWithoutOtp(body) {
        const { formDetails } = body;
        const { bookingId, date } = await this.hallFormService.createManualHallForm(formDetails);
        return {
            message: 'Hall form submitted successfully',
            bookingId,
            date,
            formDetails,
        };
    }
    async updatePaymentDetails(id, updatePaymentDto) {
        return this.hallFormService.updatePaymentDetails(id, updatePaymentDto);
    }
};
exports.HallFormController = HallFormController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], HallFormController.prototype, "submitHallForm", null);
__decorate([
    (0, common_1.Patch)(':id/confirm-reserve'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, confirm_reserve_dto_1.ConfirmReserveDto]),
    __metadata("design:returntype", Promise)
], HallFormController.prototype, "confirmReserve", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.SessionAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.SetMetadata)('role', 'Admin'),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HallFormController.prototype, "getAllHallForms", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.SessionAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.SetMetadata)('role', 'Admin'),
    (0, common_1.Get)('filter'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], HallFormController.prototype, "getHallFormsByParams", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.SessionAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.SetMetadata)('role', 'Admin'),
    (0, common_1.Delete)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HallFormController.prototype, "deleteAllHallForms", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.SessionAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.SetMetadata)('role', 'Admin'),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], HallFormController.prototype, "deleteHallFormById", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.SessionAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.SetMetadata)('role', 'Admin'),
    (0, common_1.Post)('disable'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], HallFormController.prototype, "disableHallAvailability", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.SessionAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.SetMetadata)('role', 'Admin'),
    (0, common_1.Post)('enable'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], HallFormController.prototype, "enableHallAvailability", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.SessionAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.SetMetadata)('role', 'Admin'),
    (0, common_1.Post)('manual'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], HallFormController.prototype, "submitHallFormWithoutOtp", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.SessionAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.SetMetadata)('role', 'Admin'),
    (0, common_1.Patch)(':id/payment'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_payment_dto_1.UpdatePaymentDto]),
    __metadata("design:returntype", Promise)
], HallFormController.prototype, "updatePaymentDetails", null);
exports.HallFormController = HallFormController = __decorate([
    (0, common_1.Controller)('hallforms'),
    __metadata("design:paramtypes", [hallform_service_1.HallFormService])
], HallFormController);
//# sourceMappingURL=hallform.controller.js.map