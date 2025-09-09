import { ExecutionContext } from '@nestjs/common';
declare const SessionAuthGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class SessionAuthGuard extends SessionAuthGuard_base {
    canActivate(context: ExecutionContext): boolean;
}
export {};
