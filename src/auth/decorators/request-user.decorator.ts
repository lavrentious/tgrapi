import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { User } from 'src/users/schemas/user.schema';

export const RequestUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const req: Request & { user: User } = ctx.switchToHttp().getRequest();
    return req.user;
  },
);
