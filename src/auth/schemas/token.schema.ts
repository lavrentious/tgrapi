import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';
import { REFRESH_TOKEN_LIFESPAN } from '../auth.module';

export type TokenDocument = Token & Document;

@Schema()
export class Token {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;

  @Prop({ required: true, unique: true })
  refreshToken: string;

  @Prop({ required: true })
  ipAddress: string;

  @Prop({ required: true })
  userAgent: string;

  @Prop({
    default: Date.now,
    expires: REFRESH_TOKEN_LIFESPAN,
  })
  issuedAt: Date;
}

export const TokenSchema = SchemaFactory.createForClass(Token);
TokenSchema.index(
  { issuedAt: 1 },
  { expireAfterSeconds: REFRESH_TOKEN_LIFESPAN },
);
