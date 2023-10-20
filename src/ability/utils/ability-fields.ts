import { AnyAbility } from '@casl/ability';
import { permittedFieldsOf } from '@casl/ability/extra';

import { Action } from '../ability.factory';

export function getAllowedFields<T extends AnyAbility>(
  ability: T,
  action: Action,
  subject: Parameters<T['can']>[1],
): (keyof Parameters<T['can']>[1])[] {
  return permittedFieldsOf(ability, action, subject, {
    fieldsFrom: (rule) =>
      rule.fields || Object.getOwnPropertyNames(subject.toObject()),
  });
}
