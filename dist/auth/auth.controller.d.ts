import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { BaseService } from 'src/common/utils/base.service';
export declare class AuthController extends BaseService {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
        user_id: number;
        name: string;
        email: string;
        phone: string;
        password: string | null;
        role_id: number;
        createdAt: Date;
        auth_provider: string;
    }>;
    login(loginDto: LoginDto, session: {
        user?: any;
    }): Promise<any>;
    getSession(session: {
        user?: any;
    }): any;
    logout(session: {
        user?: any;
    }): {
        message: string;
    };
}
