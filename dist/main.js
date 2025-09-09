"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const prisma_exception_filter_1 = require("./common/filters/prisma-exception.filter");
const response_interceptor_1 = require("./common/interceptors/response.interceptor");
const parse_id_pipe_1 = require("./common/pipes/parse-id.pipe");
const SimpleException_filter_1 = require("./common/filters/SimpleException.filter");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.setGlobalPrefix('v1/api');
    app.enableCors({
        origin: 'http://localhost:3000',
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        disableErrorMessages: false,
    }), new parse_id_pipe_1.ParseIdPipe());
    app.useGlobalFilters(new SimpleException_filter_1.SimpleExceptionFilter());
    app.useGlobalFilters(new prisma_exception_filter_1.PrismaExceptionFilter());
    app.useGlobalInterceptors(new response_interceptor_1.ResponseInterceptor());
    await app.listen(4000);
}
bootstrap();
//# sourceMappingURL=main.js.map