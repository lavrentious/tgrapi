import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from '../../schemas/user.schema';

export type PasswordResetDocument = HydratedDocument<PasswordReset>;

export const PASSWORD_RESET_LIFESPAN = 86400;

@Schema({})
export class PasswordReset {
  _id: Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: User.name,
  })
  user: Types.ObjectId;

  @Prop({ required: true, unique: true })
  key: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({
    default: () => Date.now() + PASSWORD_RESET_LIFESPAN * 1000,
  })
  expireAt: Date;
}

export const PasswordResetSchema = SchemaFactory.createForClass(PasswordReset);
PasswordResetSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });
