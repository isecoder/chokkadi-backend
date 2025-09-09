import { ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { Prisma } from '@prisma/client';
export declare class PrismaExceptionFilter implements ExceptionFilter {
    private readonly logger;
    catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost): void;
    private getClientErrorMessage;
    private formatStackTrace;
}
