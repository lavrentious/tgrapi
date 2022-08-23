import {
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JsonWebTokenError } from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest<TUser = any>(
    err: any,
    user: any,
    info: any,
    context: ExecutionContext,
    status?: any,
  ): TUser {
    if (info instanceof JsonWebTokenError) {
      throw new HttpException(
        info.message ?? 'invalid jwt',
        HttpStatus.UNAUTHORIZED,
      );
    }
    return super.handleRequest(err, user, info, context, status);
  }
}
