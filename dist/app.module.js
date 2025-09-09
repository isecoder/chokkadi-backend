"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const nestjs_cookie_session_1 = require("nestjs-cookie-session");
const config_1 = require("@nestjs/config");
const auth_module_1 = require("./auth/auth.module");
const supabase_module_1 = require("./supabase/supabase.module");
const prisma_module_1 = require("./prisma/prisma.module");
const contacts_module_1 = require("./contacts/contacts.module");
const profile_module_1 = require("./profile/profile.module");
const seeds_module_1 = require("./seeds/seeds.module");
const admin_module_1 = require("./admin/admin.module");
const session_config_1 = require("./common/config/session.config");
const news_updates_module_1 = require("./news-updates/news-updates.module");
const halls_module_1 = require("./halls/halls.module");
const logger_middleware_1 = require("./middleware/logger.middleware");
const hallform_module_1 = require("./hallform/hallform.module");
const otp_module_1 = require("./otp/otp.module");
const gallery_module_1 = require("./gallery/gallery.module");
let AppModule = class AppModule {
    configure(consumer) {
        consumer.apply(logger_middleware_1.LoggerMiddleware).forRoutes('*');
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot(),
            nestjs_cookie_session_1.CookieSessionModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (configService) => (0, session_config_1.getSessionConfig)(configService),
            }),
            auth_module_1.AuthModule,
            supabase_module_1.StorageModule,
            prisma_module_1.PrismaModule,
            contacts_module_1.ContactsModule,
            profile_module_1.ProfileModule,
            seeds_module_1.RolesModule,
            admin_module_1.AdminModule,
            news_updates_module_1.NewsupdatesModule,
            halls_module_1.HallsModule,
            hallform_module_1.HallFormModule,
            otp_module_1.OtpModule,
            gallery_module_1.GalleryModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map