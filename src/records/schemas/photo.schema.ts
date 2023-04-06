import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type PhotoDocument = HydratedDocument<Photo>;

@Schema()
export class Photo {
  _id: Types.ObjectId;

  @Prop({ required: true })
  url: string;

  @Prop({ required: true })
  publicId: string;

  @Prop({ required: false })
  comment: string;
}

export const PhotoSchema = SchemaFactory.createForClass(Photo);
