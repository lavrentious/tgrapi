import { Ability, ForbiddenError } from '@casl/ability';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(ForbiddenError)
export class ForbiddenErrorFilter implements ExceptionFilter {
  catch(exception: ForbiddenError<Ability>, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    res.status(HttpStatus.FORBIDDEN).json({
      statusCode: HttpStatus.FORBIDDEN,
      message:
        exception.message +
        (exception.field ? ` ("${exception.field}" field)` : ''),
      error: 'Forbidden',
      path: req.url,
    });
  }
}
