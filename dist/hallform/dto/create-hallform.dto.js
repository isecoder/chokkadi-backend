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
exports.CreateHallFormDto = void 0;
const class_validator_1 = require("class-validator");
const IsInternationalPhone_1 = require("../../common/decorators/IsInternationalPhone");
const MatchesField_1 = require("../../common/decorators/MatchesField");
const validation_message_1 = require("../../common/constants/validation-message");
class CreateHallFormDto {
}
exports.CreateHallFormDto = CreateHallFormDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateHallFormDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateHallFormDto.prototype, "reason", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, IsInternationalPhone_1.IsInternationalPhone)(),
    __metadata("design:type", String)
], CreateHallFormDto.prototype, "mobileNumber", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, IsInternationalPhone_1.IsInternationalPhone)(),
    (0, MatchesField_1.MatchesField)('mobileNumber', {
        message: validation_message_1.ValidationMessages.mobileNumberConfirmation,
    }),
    __metadata("design:type", String)
], CreateHallFormDto.prototype, "mobileNumberConfirmation", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", Date)
], CreateHallFormDto.prototype, "date", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateHallFormDto.prototype, "hallId", void 0);
//# sourceMappingURL=create-hallform.dto.js.map