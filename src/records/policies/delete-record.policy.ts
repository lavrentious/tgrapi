import { ForbiddenError } from '@casl/ability';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Record, RecordDocument } from 'src/records/schemas/record.schema';
import { Action, AppAbility } from '../../ability/ability.factory';
import { IPolicyHandler } from '../../ability/guards/policies.guard';

export class DeleteRecordPolicyHandler implements IPolicyHandler {
  constructor(
    @InjectModel(Record.name)
    private readonly recordModel: Model<RecordDocument>,
  ) {}
  check(ability: AppAbility) {
    ForbiddenError.from(ability).throwUnlessCan(
      Action.DELETE,
      this.recordModel,
    );
  }
}
