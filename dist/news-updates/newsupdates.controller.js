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
exports.NewsUpdatesController = void 0;
const common_1 = require("@nestjs/common");
const news_updates_service_1 = require("./news-updates.service");
const create_news_update_dto_1 = require("./dto/create-news-update.dto");
const update_news_update_dto_1 = require("./dto/update-news-update.dto");
let NewsUpdatesController = class NewsUpdatesController {
    constructor(newsUpdatesService) {
        this.newsUpdatesService = newsUpdatesService;
    }
    async createNewsUpdate(createNewsUpdateDto, req) {
        const userId = req.session?.user?.id;
        if (!userId) {
            throw new common_1.BadRequestException('User not authenticated.');
        }
        return this.newsUpdatesService.createNewsUpdate({
            ...createNewsUpdateDto,
            created_by: userId,
        });
    }
    async updateNewsUpdate(newsId, updateNewsUpdateDto, req) {
        const userId = req.session?.user?.id;
        if (!userId) {
            throw new common_1.BadRequestException('User not authenticated.');
        }
        return this.newsUpdatesService.updateNewsUpdate(newsId, {
            ...updateNewsUpdateDto,
            updated_by: userId,
        });
    }
    async deleteNewsUpdate(newsId) {
        return this.newsUpdatesService.deleteNewsUpdate(newsId);
    }
    async getNewsUpdateById(newsId) {
        return this.newsUpdatesService.getNewsUpdateById(newsId);
    }
    async getAllNewsUpdates() {
        return this.newsUpdatesService.getAllNewsUpdates();
    }
};
exports.NewsUpdatesController = NewsUpdatesController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_news_update_dto_1.CreateNewsUpdateDto, Object]),
    __metadata("design:returntype", Promise)
], NewsUpdatesController.prototype, "createNewsUpdate", null);
__decorate([
    (0, common_1.Put)('update/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_news_update_dto_1.UpdateNewsUpdateDto, Object]),
    __metadata("design:returntype", Promise)
], NewsUpdatesController.prototype, "updateNewsUpdate", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], NewsUpdatesController.prototype, "deleteNewsUpdate", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], NewsUpdatesController.prototype, "getNewsUpdateById", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], NewsUpdatesController.prototype, "getAllNewsUpdates", null);
exports.NewsUpdatesController = NewsUpdatesController = __decorate([
    (0, common_1.Controller)('news-updates'),
    __metadata("design:paramtypes", [news_updates_service_1.NewsUpdatesService])
], NewsUpdatesController);
//# sourceMappingURL=newsupdates.controller.js.map