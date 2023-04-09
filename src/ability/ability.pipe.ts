import { Injectable, PipeTransform } from '@nestjs/common';
import { User } from 'src/users/schemas/user.schema';
import { AbilityFactory, AppAbility } from './ability.factory';

@Injectable()
export class AbilityPipe implements PipeTransform {
  constructor(private readonly abilityFactory: AbilityFactory) {}
  transform(value: User): AppAbility {
    return this.abilityFactory.defineAbility(value);
  }
}
