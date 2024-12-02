// src/common/middleware/logger.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => void): void {
    //console.log('Response is:', req); // Logs the entire request object
    //console.log('Request body:', req); // Logs the body of the request
    // console.log('Request headers:', req.headers.authorization); // Logs the headers
    next();
  }
}
