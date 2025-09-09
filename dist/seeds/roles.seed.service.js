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
var RolesSeedService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolesSeedService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let RolesSeedService = RolesSeedService_1 = class RolesSeedService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(RolesSeedService_1.name);
    }
    async onModuleInit() {
        await this.seedRoles();
    }
    async seedRoles() {
        const requiredRoles = ['User', 'Admin', 'Moderator'];
        const existingRoles = await this.prisma.roles.findMany({
            where: { role_name: { in: requiredRoles } },
        });
        const existingRoleNames = existingRoles.map((role) => role.role_name);
        const rolesToSeed = requiredRoles.filter((role) => !existingRoleNames.includes(role));
        if (rolesToSeed.length > 0) {
            await this.prisma.roles.createMany({
                data: rolesToSeed.map((role_name) => ({ role_name })),
            });
            this.logger.log(`Roles added successfully: ${rolesToSeed.join(', ')}`);
        }
        else {
            this.logger.log('Roles table is already fully populated.');
        }
    }
};
exports.RolesSeedService = RolesSeedService;
exports.RolesSeedService = RolesSeedService = RolesSeedService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RolesSeedService);
//# sourceMappingURL=roles.seed.service.js.map