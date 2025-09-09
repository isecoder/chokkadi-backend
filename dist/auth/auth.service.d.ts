import { PrismaService } from '../prisma/prisma.service';
import { BaseService } from 'src/common/utils/base.service';
export declare class AuthService extends BaseService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    register(email: string, password: string, name: string, phone: string, role_id?: number): Promise<{
        user_id: number;
        name: string;
        email: string;
        phone: string;
        password: string | null;
        role_id: number;
        createdAt: Date;
        auth_provider: string;
    }>;
    login(email: string, password: string): Promise<{
        user_id: number;
        name: string;
        email: string;
        phone: string;
        password: string | null;
        role_id: number;
        createdAt: Date;
        auth_provider: string;
    }>;
    oauthLogin(email: string): Promise<{
        user_id: number;
        name: string;
        email: string;
        phone: string;
        password: string | null;
        role_id: number;
        createdAt: Date;
        auth_provider: string;
    }>;
}
