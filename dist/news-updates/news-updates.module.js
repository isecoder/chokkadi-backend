"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsupdatesModule = void 0;
const common_1 = require("@nestjs/common");
const news_updates_service_1 = require("./news-updates.service");
const newsupdates_controller_1 = require("./newsupdates.controller");
const prisma_service_1 = require("../prisma/prisma.service");
const supabase_service_1 = require("../supabase/supabase.service");
let NewsupdatesModule = class NewsupdatesModule {
};
exports.NewsupdatesModule = NewsupdatesModule;
exports.NewsupdatesModule = NewsupdatesModule = __decorate([
    (0, common_1.Module)({
        providers: [news_updates_service_1.NewsUpdatesService, prisma_service_1.PrismaService, supabase_service_1.SupabaseService],
        controllers: [newsupdates_controller_1.NewsUpdatesController],
    })
], NewsupdatesModule);
//# sourceMappingURL=news-updates.module.js.map