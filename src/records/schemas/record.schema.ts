import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import * as mongoose from 'mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';

export const MAX_PHOTOS = 5;

export type RecordDocument = HydratedDocument<Record>;
export const REGIONS: string[] = [
  'Респ Адыгея',
  'Респ Башкортостан',
  'Респ Бурятия',
  'Респ Алтай',
  'Респ Дагестан',
  'Респ Ингушетия',
  'Респ Кабардино-Балкарская',
  'Респ Калмыкия',
  'Респ Карачаево-Черкесская',
  'Респ Карелия',
  'Респ Коми',
  'Респ Марий Эл',
  'Респ Мордовия',
  'Респ Саха /Якутия/',
  'Респ Северная Осетия - Алания',
  'Респ Татарстан',
  'Респ Тыва',
  'Респ Удмуртская',
  'Респ Хакасия',
  'Респ Чеченская',
  'Чувашская Республика - Чувашия',
  'Алтайский край',
  'Краснодарский край',
  'Красноярский край',
  'Приморский край',
  'Ставропольский край',
  'Хабаровский край',
  'Амурская обл',
  'Архангельская обл',
  'Астраханская обл',
  'Белгородская обл',
  'Брянская обл',
  'Владимирская обл',
  'Волгоградская обл',
  'Вологодская обл',
  'Воронежская обл',
  'Ивановская обл',
  'Иркутская обл',
  'Калининградская обл',
  'Калужская обл',
  'Камчатский край',
  'Кемеровская область - Кузбасс',
  'Кировская обл',
  'Костромская обл',
  'Курганская обл',
  'Курская обл',
  'Ленинградская обл',
  'Липецкая обл',
  'Магаданская обл',
  'Московская обл',
  'Мурманская обл',
  'Нижегородская обл',
  'Новгородская обл',
  'Новосибирская обл',
  'Омская обл',
  'Оренбургская обл',
  'Орловская обл',
  'Пензенская обл',
  'Пермский край',
  'Псковская обл',
  'Ростовская обл',
  'Рязанская обл',
  'Самарская обл',
  'Саратовская обл',
  'Сахалинская обл',
  'Свердловская обл',
  'Смоленская обл',
  'Тамбовская обл',
  'Тверская обл',
  'Томская обл',
  'Тульская обл',
  'Тюменская обл',
  'Ульяновская обл',
  'Челябинская обл',
  'Забайкальский край',
  'Ярославская обл',
  'г Москва',
  'г Санкт-Петербург',
  'Еврейская Аобл',
  'Ненецкий АО',
  'Ханты-Мансийский Автономный округ - Югра АО',
  'Чукотский АО',
  'Ямало-Ненецкий АО',
  'Респ Крым',
  'г Севастополь',
  'г Байконур',
];
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
