import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AbilityModule } from 'src/ability/ability.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { GeoService } from './geo.service';
import { PhotosService } from './photos.service';
import { RecordsController } from './records.controller';
import { RecordsService } from './records.service';
import { Photo, PhotoSchema } from './schemas/photo.schema';
import { Record, RecordSchema } from './schemas/record.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Record.name, schema: RecordSchema },
      { name: Photo.name, schema: PhotoSchema },
    ]),
    AbilityModule,
    CloudinaryModule,
  ],
  controllers: [RecordsController],
  providers: [RecordsService, PhotosService, GeoService],
})
export class RecordsModule {}
