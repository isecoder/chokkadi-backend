import { ProfileService } from './profile.service';
export declare class ProfileController {
    private readonly profileService;
    constructor(profileService: ProfileService);
    getProfile(session: {
        user?: any;
    }): {
        message: string;
        user: {
            id: any;
            email: any;
            name: any;
        };
    } | {
        message: string;
    };
}
