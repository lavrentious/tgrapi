import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from './user.schema';

export type EmailConfirmationDocument = EmailConfirmation & Document;

@Schema({})
export class EmailConfirmation {
  @Prop({ type: MongooseSchema.Types.ObjectId, required: true, ref: User.name })
  user: User;

  @Prop({ required: true, unique: true })
  key: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const EmailConfirmationSchema =
  SchemaFactory.createForClass(EmailConfirmation);
