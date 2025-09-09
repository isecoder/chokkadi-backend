import { HttpStatus } from '@nestjs/common';
export declare class BaseService {
    protected throwHttpException(key: string, statusCode: HttpStatus): void;
    protected throwUnauthorizedException(key?: string): void;
    protected throwNotFoundException(entityName: string, id: number): void;
    protected handleDatabaseOperation<T>(operation: Promise<T>, id: number, entityName: string): Promise<T>;
}
