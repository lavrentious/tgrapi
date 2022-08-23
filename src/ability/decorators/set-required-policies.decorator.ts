import { SetMetadata } from '@nestjs/common';
import { PolicyHandler } from '../guards/policies.guard';

export const CHECK_POLICIES_KEY = 'check_policy';
export const SetRequiredPolicies = (...policies: PolicyHandler[]) =>
  SetMetadata(CHECK_POLICIES_KEY, policies);
