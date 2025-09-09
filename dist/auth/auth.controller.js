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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const register_dto_1 = require("./dto/register.dto");
const login_dto_1 = require("./dto/login.dto");
const base_service_1 = require("../common/utils/base.service");
let AuthController = class AuthController extends base_service_1.BaseService {
    constructor(authService) {
        super();
        this.authService = authService;
    }
    async register(registerDto) {
        const newUser = await this.authService.register(registerDto.email, registerDto.password, registerDto.name, registerDto.phone, registerDto.role_id);
        return newUser;
    }
    async login(loginDto, session) {
        if (!session.user) {
            const user = await this.authService.login(loginDto.email, loginDto.password);
            session.user = { id: user.user_id, name: user.name };
            return session.user;
        }
        this.throwHttpException('ALREADY_LOGGED_IN', common_1.HttpStatus.CONFLICT);
    }
    getSession(session) {
        if (session.user) {
            return session.user;
        }
        this.throwHttpException('NO_ACTIVE_SESSION', common_1.HttpStatus.BAD_REQUEST);
    }
    logout(session) {
        if (session.user) {
            session.user = null;
            return { message: 'User logged out successfully' };
        }
        this.throwHttpException('NO_ACTIVE_SESSION', common_1.HttpStatus.BAD_REQUEST);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_dto_1.RegisterDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Session)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Get)('session'),
    __param(0, (0, common_1.Session)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "getSession", null);
__decorate([
    (0, common_1.Post)('logout'),
    __param(0, (0, common_1.Session)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "logout", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map