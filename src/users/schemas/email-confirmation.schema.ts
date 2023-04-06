import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from './user.schema';

export type EmailConfirmationDocument = HydratedDocument<EmailConfirmation>;

@Schema({})
export class EmailConfirmation {
  _id: Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: User.name,
  })
  user: User;

  @Prop({ required: true, unique: true })
  key: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const EmailConfirmationSchema =
  SchemaFactory.createForClass(EmailConfirmation);
