"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchesField = MatchesField;
const class_validator_1 = require("class-validator");
function MatchesField(property, validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [property],
            validator: {
                validate(value, args) {
                    const [relatedPropertyName] = args.constraints;
                    const relatedValue = args.object[relatedPropertyName];
                    return value === relatedValue;
                },
                defaultMessage() {
                    return `${propertyName} must match ${property}.`;
                },
            },
        });
    };
}
//# sourceMappingURL=MatchesField.js.map