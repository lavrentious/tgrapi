import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Type,
} from '@nestjs/common';
import { ModuleRef, Reflector } from '@nestjs/core';
import { AbilityFactory, AppAbility } from '../ability.factory';
import { CHECK_POLICIES_KEY } from '../decorators/set-required-policies.decorator';

export interface IPolicyHandler {
  check(ability: AppAbility): void;
}

export type PolicyHandlerCallback = (ability: AppAbility) => boolean;

export type PolicyHandler = Type<IPolicyHandler>;

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private caslAbilityFactory: AbilityFactory,
    private moduleRef: ModuleRef,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const policyHandlers =
      this.reflector.get<PolicyHandler[]>(
        CHECK_POLICIES_KEY,
        context.getHandler(),
      ) || [];

    const { user } = context.switchToHttp().getRequest();
    const ability = this.caslAbilityFactory.defineAbility(user);

    for (const handler of policyHandlers) {
      const policyInstance = await this.moduleRef.create(handler);
      policyInstance.check(ability);
    }
    return true;
  }
}
