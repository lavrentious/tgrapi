import { AnyAbility, RuleOf } from '@casl/ability';
import { Rule } from '@casl/ability/dist/types/Rule';

export type GetRuleFields<R extends Rule<any, any>> = (rule: R) => string[];

export interface PermittedFieldsOptions<T extends AnyAbility> {
  fieldsFrom: GetRuleFields<RuleOf<T>>;
}

export function permittedFieldsOf<T extends AnyAbility>(
  ability: T,
  action: Parameters<T['can']>[0],
  subject: Parameters<T['can']>[1],
  options: PermittedFieldsOptions<T>,
): string[] {
  const subjectType = ability.detectSubjectType(subject);
  const rules = ability.possibleRulesFor(action, subjectType);
  const uniqueFields = new Set<string>();
  const deleteItem = uniqueFields.delete.bind(uniqueFields);
  const addItem = uniqueFields.add.bind(uniqueFields);
  let i = rules.length;

  while (i--) {
    const rule = rules[i];
    if (rule.matchesConditions(subject)) {
      const toggle = rule.inverted ? deleteItem : addItem;
      options.fieldsFrom(rule).forEach(toggle);
    }
  }

  return Array.from(uniqueFields);
}
