import { ExceptionFilter, ArgumentsHost } from '@nestjs/common';
export declare class SimpleExceptionFilter implements ExceptionFilter {
    private readonly logger;
    catch(exception: unknown, host: ArgumentsHost): void;
    private extractErrorDetails;
    private logError;
    private getStack;
    private formatStackTrace;
}
