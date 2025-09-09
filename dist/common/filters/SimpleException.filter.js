"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var SimpleExceptionFilter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
let SimpleExceptionFilter = SimpleExceptionFilter_1 = class SimpleExceptionFilter {
    constructor() {
        this.logger = new common_1.Logger(SimpleExceptionFilter_1.name);
    }
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const { status, message, type } = this.extractErrorDetails(exception);
        this.logError(type, status, request, message, this.getStack(exception));
        response.status(Number(status)).json({
            statusCode: Number(status),
            timestamp: new Date().toISOString(),
            path: request.url,
            method: request.method,
            type,
            message,
        });
    }
    extractErrorDetails(exception) {
        if (exception instanceof common_1.HttpException) {
            const status = exception.getStatus();
            const response = exception.getResponse();
            const message = typeof response === 'string'
                ? response
                : response.message || 'An unexpected error occurred';
            return { status, message, type: 'HTTP Exception' };
        }
        if (typeof exception === 'object' &&
            exception !== null &&
            'statusCode' in exception) {
            return {
                status: Number(exception.statusCode) || 500,
                message: exception.message || 'An unknown error occurred',
                type: 'Custom Exception',
            };
        }
        return {
            status: 500,
            message: exception instanceof Error ? exception.message : 'Unknown Error',
            type: 'Non-HTTP Exception',
        };
    }
    logError(exceptionType, status, request, message, stack) {
        this.logger.error(`\nError Details:\n` +
            `\t- Exception Type: ${exceptionType}\n` +
            `\t- HTTP Method: ${request.method}\n` +
            `\t- URL: ${request.url}\n` +
            `\t- Status Code: ${status}\n` +
            `\t- Message: ${Array.isArray(message) ? message.join(', ') : message}\n` +
            `\t- Stack Trace:\n${this.formatStackTrace(stack)}\n`);
    }
    getStack(exception) {
        return exception instanceof Error ? exception.stack || '' : '';
    }
    formatStackTrace(stack) {
        return stack
            .split('\n')
            .map((line, index) => `\t\t${index === 0 ? '🔴 ' : '↳ '}${line.trim()}`)
            .join('\n');
    }
};
exports.SimpleExceptionFilter = SimpleExceptionFilter;
exports.SimpleExceptionFilter = SimpleExceptionFilter = SimpleExceptionFilter_1 = __decorate([
    (0, common_1.Catch)()
], SimpleExceptionFilter);
//# sourceMappingURL=SimpleException.filter.js.map