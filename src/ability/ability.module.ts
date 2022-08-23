import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Record, RecordSchema } from 'src/records/schemas/record.schema';
import { User, UserSchema } from 'src/users/schemas/user.schema';
import { AbilityFactory } from './ability.factory';

@Module({
  providers: [AbilityFactory],
  exports: [AbilityFactory],
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Record.name, schema: RecordSchema },
    ]),
  ],
})
export class AbilityModule {}
