"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSessionConfig = getSessionConfig;
function getSessionConfig(configService) {
    return {
        session: {
            secret: configService.get('SESSION_SECRET') || 'your-session-secret',
            maxAge: 30 * 24 * 60 * 60 * 1000,
            httpOnly: true,
        },
    };
}
//# sourceMappingURL=session.config.js.map