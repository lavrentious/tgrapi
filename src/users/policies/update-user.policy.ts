import { ForbiddenError } from '@casl/ability';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Action, AppAbility } from '../../ability/ability.factory';
import { IPolicyHandler } from '../../ability/guards/policies.guard';
import { User, UserDocument } from '../schemas/user.schema';

export class UpdateUserPolicyHandler implements IPolicyHandler {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}
  check(ability: AppAbility) {
    ForbiddenError.from(ability).throwUnlessCan(Action.UPDATE, this.userModel);
  }
}
