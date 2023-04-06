import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
  VERIFIED = 'VERIFIED',
  MODERATOR = 'MODERATOR',
}

@Schema({ timestamps: true })
export class User {
  _id: Types.ObjectId;

  @Prop({})
  name?: string;

  @Prop({ unique: true, required: true })
  email: string;

  @Prop({ unique: true })
  username?: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: false })
  emailConfirmed: boolean;

  @Prop({ enum: Role, default: Role.USER })
  role: Role;

  @Prop({ required: false })
  createdAt: Date;

  @Prop({ required: false })
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
