import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';

export const MAX_PHOTOS = 5;

export type RecordDocument = Record & Document;
export class Address {
  displayName: string;
  region: { value: string; type: string };
  city: { value: string; type: string };
}
export enum SpotType {
  USEFUL,
  SIGHT,
}

@Schema({ timestamps: true })
export class Record {
  @Prop({ required: true })
  name: string;

  @Prop({})
  description: string;

  @Prop({})
  accessibility: string;

  @Prop({ required: true })
  address: Address;

  @Prop({ required: true })
  lat: number;

  @Prop({ required: true })
  lon: number;

  @Prop({ required: true, enum: SpotType })
  type: SpotType;

  @Prop({ type: MongooseSchema.Types.ObjectId, required: true, ref: User.name })
  author: User;

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Photo' }],
    default: [],
  })
  photos: MongooseSchema.Types.ObjectId[];
}

export const RecordSchema = SchemaFactory.createForClass(Record);
