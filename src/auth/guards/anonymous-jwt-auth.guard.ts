import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
/** Validates JWT allowing no JWT, but forbidding invalid JWT. */
class AnonymousJwtAuthGuard extends AuthGuard('jwt') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const header = context.switchToHttp().getRequest().headers['authorization'];
    if (!header) {
      return true;
    }
    await super.canActivate(context);
    return true;
  }
}

export { AnonymousJwtAuthGuard };
