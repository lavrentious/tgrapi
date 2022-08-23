import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { UserDocument } from 'src/users/schemas/user.schema';

export const RequestUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const req: Request & { user: UserDocument } = ctx
      .switchToHttp()
      .getRequest();
    return req.user;
  },
);
