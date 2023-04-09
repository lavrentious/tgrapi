import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
  @ApiProperty({ type: String })
  _id: Types.ObjectId;

  @ApiPropertyOptional()
  @Prop({})
  name?: string;

  @ApiProperty()
  @Prop({ unique: true, required: true })
  email: string;

  @ApiPropertyOptional()
  @Prop({ unique: true, sparse: true, index: true })
  username?: string;

  @ApiProperty()
  @Prop({ required: true })
  password: string;

  @ApiProperty()
  @Prop({ default: false })
  emailConfirmed: boolean;

  @ApiProperty({ enum: Role })
  @Prop({ enum: Role, default: Role.USER })
  role: Role;

  @ApiProperty()
  @Prop({ required: false })
  createdAt: Date;

  @ApiProperty()
  @Prop({ required: false })
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
