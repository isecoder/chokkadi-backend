"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var PrismaExceptionFilter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prismaErrorMessages = new Map([
    ['P2002', 'Already registered'],
    ['P2003', 'Foreign key constraint violation'],
    ['P2025', 'Record not found'],
    ['P2001', 'Record not found'],
    ['P2012', 'Missing required field'],
    ['P2004', 'Constraint failed'],
    ['P2005', 'Invalid value for the column'],
    ['P2011', 'Null constraint violation'],
    ['P2024', 'Too many records matched the query'],
    ['P2026', 'Transaction failed'],
    ['P9999', 'Database error occurred'],
]);
let PrismaExceptionFilter = PrismaExceptionFilter_1 = class PrismaExceptionFilter {
    constructor() {
        this.logger = new common_1.Logger(PrismaExceptionFilter_1.name);
    }
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const clientMessage = this.getClientErrorMessage(exception);
        this.logger.error(`Prisma Error:\n` +
            `\t- HTTP Method: ${request.method}\n` +
            `\t- URL: ${request.url}\n` +
            `\t- Detailed Error: ${exception.message}\n` +
            `\t- Stack Trace:\n${this.formatStackTrace(exception.stack)}\n`);
        response.status(common_1.HttpStatus.BAD_REQUEST).json({
            statusCode: common_1.HttpStatus.BAD_REQUEST,
            timestamp: new Date().toISOString(),
            path: request.url,
            method: request.method,
            message: clientMessage,
        });
    }
    getClientErrorMessage(exception) {
        return prismaErrorMessages.get(exception.code) || 'An error occurred';
    }
    formatStackTrace(stack) {
        return stack
            .split('\n')
            .map((line, index) => `\t\t${index === 0 ? '🔴 ' : '↳ '}${line.trim()}`)
            .join('\n');
    }
};
exports.PrismaExceptionFilter = PrismaExceptionFilter;
exports.PrismaExceptionFilter = PrismaExceptionFilter = PrismaExceptionFilter_1 = __decorate([
    (0, common_1.Catch)(client_1.Prisma.PrismaClientKnownRequestError)
], PrismaExceptionFilter);
//# sourceMappingURL=prisma-exception.filter.js.map