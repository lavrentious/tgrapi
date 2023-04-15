import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import * as mongoose from 'mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';

export const MAX_PHOTOS = 5;

export type RecordDocument = HydratedDocument<Record>;

export class Address {
  @ApiPropertyOptional()
  @IsString()
  region?: string;

  @ApiPropertyOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional()
  @IsString()
  street?: string;

  @ApiPropertyOptional()
  @IsString()
  house?: string;
}
export class AddressWithDisplayName extends Address {
  @ApiPropertyOptional()
  @IsString()
  displayName?: string;
}
export enum SpotType {
  USEFUL = 'USEFUL',
  SIGHT = 'SIGHT',
  MISC = 'MISC',
}

@Schema({ timestamps: true, minimize: false })
export class Record {
  @ApiProperty({ type: String })
  _id: Types.ObjectId;

  @ApiProperty()
  @Prop({ required: true })
  name: string;

  @ApiPropertyOptional()
  @Prop({})
  description?: string;

  @ApiPropertyOptional()
  @Prop({})
  accessibility?: string;

  @ApiProperty()
  @Prop({ required: true, type: AddressWithDisplayName })
  address: AddressWithDisplayName;

  @ApiProperty()
  @Prop({ required: true })
  lat: number;

  @ApiProperty()
  @Prop({ required: true })
  lon: number;

  @ApiProperty({ enum: SpotType })
  @Prop({ required: true, enum: SpotType })
  type: SpotType;

  @ApiProperty({ type: String })
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: User.name,
  })
  author: Types.ObjectId;

  @ApiProperty({ type: [String], uniqueItems: true })
  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Photo' }],
    default: [],
  })
  photos: Types.ObjectId[];

  @ApiProperty()
  @Prop({ required: false })
  createdAt: Date;

  @ApiProperty()
  @Prop({ required: false })
  updatedAt: Date;
}

export const RecordSchema = SchemaFactory.createForClass(Record);
