import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { HydratedDocument, Types } from 'mongoose';

export type PhotoDocument = HydratedDocument<Photo>;

@Schema()
export class Photo {
  @ApiProperty({ type: String })
  _id: Types.ObjectId;

  @ApiProperty()
  @Prop({ required: true })
  url: string;

  @ApiProperty()
  @Prop({ required: true })
  publicId: string;

  @ApiPropertyOptional()
  @Prop({ required: false })
  comment?: string;
}

export const PhotoSchema = SchemaFactory.createForClass(Photo);
