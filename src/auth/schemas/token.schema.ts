import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { HydratedDocument, Types } from 'mongoose';

export const ACCESS_TOKEN_LIFESPAN = 900;
export const REFRESH_TOKEN_LIFESPAN = 2592000;

export type TokenDocument = HydratedDocument<Token>;

@Schema()
export class Token {
  _id: Types.ObjectId;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: Types.ObjectId;

  @Prop({ required: true, unique: true })
  refreshToken: string;

  @Prop({ required: true })
  ipAddress: string;

  @Prop({ required: true })
  userAgent: string;

  @Prop({
    default: Date.now,
  })
  issuedAt: Date;

  @Prop({
    default: () => Date.now() + REFRESH_TOKEN_LIFESPAN * 1000,
  })
  expireAt: Date;
}

export const TokenSchema = SchemaFactory.createForClass(Token);
TokenSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });
