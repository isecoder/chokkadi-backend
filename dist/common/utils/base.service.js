"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseService = void 0;
const common_1 = require("@nestjs/common");
const errorMessages = new Map([
    ['UNAUTHORIZED', 'Invalid credentials'],
    ['USER_NOT_FOUND', 'User not found'],
    ['ALREADY_LOGGED_IN', 'User already logged in'],
    ['NO_ACTIVE_SESSION', 'No active session'],
]);
class BaseService {
    throwHttpException(key, statusCode) {
        const message = errorMessages.get(key) || 'Unknown error';
        throw new common_1.HttpException(message, statusCode);
    }
    throwUnauthorizedException(key = 'UNAUTHORIZED') {
        const message = errorMessages.get(key) || 'Unauthorized access';
        throw new common_1.UnauthorizedException(message);
    }
    throwNotFoundException(entityName, id) {
        throw new common_1.NotFoundException(`${entityName} with ID ${id} not found. Please make sure the ${entityName} exists.`);
    }
    async handleDatabaseOperation(operation, id, entityName) {
        const result = await operation;
        if (!result) {
            this.throwNotFoundException(entityName, id);
        }
        return result;
    }
}
exports.BaseService = BaseService;
//# sourceMappingURL=base.service.js.map