import { ForbiddenError } from '@casl/ability';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Action, AppAbility } from 'src/ability/ability.factory';
import { IPolicyHandler } from 'src/ability/guards/policies.guard';
import { Record, RecordDocument } from 'src/records/schemas/record.schema';

export class CreateRecordPolicyHandler implements IPolicyHandler {
  constructor(
    @InjectModel(Record.name)
    private readonly recordModel: Model<RecordDocument>,
  ) {}
  check(ability: AppAbility) {
    ForbiddenError.from(ability).throwUnlessCan(
      Action.CREATE,
      this.recordModel,
    );
  }
}
