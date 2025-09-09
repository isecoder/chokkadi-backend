import { NestCookieSessionOptions } from 'nestjs-cookie-session';
import { ConfigService } from '@nestjs/config';
export declare function getSessionConfig(configService: ConfigService): NestCookieSessionOptions;
