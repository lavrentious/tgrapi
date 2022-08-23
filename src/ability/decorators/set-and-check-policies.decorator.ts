import { applyDecorators, UseGuards } from '@nestjs/common';
import { PoliciesGuard, PolicyHandler } from '../guards/policies.guard';
import { SetRequiredPolicies } from './set-required-policies.decorator';

/**
 * Combines `SetRequiredPolicies` decorator and `PoliciesGuard`
 */
export function SetAndCheckPolicies(...policies: PolicyHandler[]) {
  return applyDecorators(
    UseGuards(PoliciesGuard),
    SetRequiredPolicies(...policies),
  );
}
