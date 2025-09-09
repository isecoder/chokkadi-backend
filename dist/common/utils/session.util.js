"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSessionUser = getSessionUser;
const common_1 = require("@nestjs/common");
function getSessionUser(request) {
    const user = request.session?.user;
    if (!user) {
        throw new common_1.UnauthorizedException('No user session found');
    }
    return user;
}
//# sourceMappingURL=session.util.js.map