"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HallsModule = void 0;
const common_1 = require("@nestjs/common");
const halls_controller_1 = require("./halls.controller");
const halls_service_1 = require("./halls.service");
const prisma_service_1 = require("../prisma/prisma.service");
const hallform_module_1 = require("../hallform/hallform.module");
const supabase_service_1 = require("../supabase/supabase.service");
let HallsModule = class HallsModule {
};
exports.HallsModule = HallsModule;
exports.HallsModule = HallsModule = __decorate([
    (0, common_1.Module)({
        imports: [hallform_module_1.HallFormModule],
        controllers: [halls_controller_1.HallsController],
        providers: [halls_service_1.HallsService, prisma_service_1.PrismaService, supabase_service_1.SupabaseService],
    })
], HallsModule);
//# sourceMappingURL=halls.module.js.map