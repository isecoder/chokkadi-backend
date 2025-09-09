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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const argon2 = require("argon2");
const base_service_1 = require("../common/utils/base.service");
let AuthService = class AuthService extends base_service_1.BaseService {
    constructor(prisma) {
        super();
        this.prisma = prisma;
    }
    async register(email, password, name, phone, role_id) {
        const hashedPassword = await argon2.hash(password);
        const newUser = await this.prisma.users.create({
            data: {
                email,
                password: hashedPassword,
                name,
                phone,
                auth_provider: 'traditional',
                role_id: role_id || 1,
            },
        });
        return newUser;
    }
    async login(email, password) {
        const user = await this.prisma.users.findUnique({ where: { email } });
        if (!user || user.auth_provider !== 'traditional') {
            this.throwUnauthorizedException('UNAUTHORIZED');
        }
        const passwordValid = await argon2.verify(user.password, password);
        if (!passwordValid) {
            this.throwUnauthorizedException('UNAUTHORIZED');
        }
        return user;
    }
    async oauthLogin(email) {
        const user = await this.prisma.users.findUnique({ where: { email } });
        if (!user) {
            this.throwUnauthorizedException('USER_NOT_FOUND');
        }
        return user;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AuthService);
//# sourceMappingURL=auth.service.js.map