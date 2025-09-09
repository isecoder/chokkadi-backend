"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsInternationalPhone = IsInternationalPhone;
const class_validator_1 = require("class-validator");
const validation_message_1 = require("../../common/constants/validation-message");
let IsInternationalPhoneConstraint = class IsInternationalPhoneConstraint {
    validate(phoneNumber) {
        const phonePattern = /^\+[1-9]\d{1,14}$/;
        return phonePattern.test(phoneNumber);
    }
    defaultMessage() {
        return validation_message_1.ValidationMessages.internationalPhone;
    }
};
IsInternationalPhoneConstraint = __decorate([
    (0, class_validator_1.ValidatorConstraint)({ async: false })
], IsInternationalPhoneConstraint);
function IsInternationalPhone(validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsInternationalPhoneConstraint,
        });
    };
}
//# sourceMappingURL=IsInternationalPhone.js.map