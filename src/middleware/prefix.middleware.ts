import {
  Injectable,
  NestMiddleware,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ApiPrefixMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const prefix = '/api/v1';
    if (!req.url.startsWith(prefix)) {
      // Redirect to the correct prefixed route
      req.url = `${prefix}${req.url}`;
    }
    next();
  }
}
