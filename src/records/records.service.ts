import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema } from 'mongoose';
import { CreateRecordDto } from './dto/create-record.dto';
import { UpdateRecordDto } from './dto/update-record.dto';
import { GeoService } from './geo.service';
import { PhotosService } from './photos.service';
import { PhotoDocument } from './schemas/photo.schema';
import { Record, RecordDocument } from './schemas/record.schema';

@Injectable()
export class RecordsService {
  constructor(
    @InjectModel(Record.name)
    private readonly recordModel: Model<RecordDocument>,
    @Inject(forwardRef(() => PhotosService))
    private readonly photosService: PhotosService,
    private readonly geoService: GeoService,
  ) {}

  async create(
    dto: CreateRecordDto,
    authorId: string,
  ): Promise<RecordDocument> {
    let { address } = dto;
    if (!dto.address) {
      address = await this.geoService.addressByCoords(dto.lat, dto.lon);
    }
    return this.recordModel.create({
      ...dto,
      address: {
        displayName: this.geoService.getDisplayName(address),
        ...address,
      },
      author: authorId,
    });
  }

  async findAll(): Promise<RecordDocument[]> {
    // TODO: @casl/mongoose AccessibleRecords plugin
    return this.recordModel.find();
  }

  async findById(id: string | Schema.Types.ObjectId): Promise<RecordDocument> {
    return this.recordModel.findById(id);
  }

  async removePhoto(
    record: RecordDocument,
    photoId: string,
  ): Promise<RecordDocument> {
    record.photos = record.photos.filter((id) => id.toString() !== photoId);
    return record.save();
  }

  async updateOne(record: RecordDocument, dto: UpdateRecordDto): Promise<any> {
    const query = { ...dto };
    if (dto.photos) {
      for (const id of dto.photos) {
        const photo = await this.photosService.findById(id);
        if (!photo) {
          throw new NotFoundException(`photo with id ${id} not found`);
        }
      }
      const newPhotos = new Set(dto.photos);
      const unusedPhotos = record.photos.filter(
        (id) => !newPhotos.has(id.toString()),
      );
      const deletionResult = this.photosService.deleteMany(unusedPhotos);
      return Promise.all([record.updateOne(dto), deletionResult]);
    }
    if (dto.autoAddress) {
      const address = await this.geoService.addressByCoords(
        dto.lat || record.lat,
        dto.lon || record.lon,
      );
      dto.address = address;
    }
    if (dto.address) {
      delete query.address;
      for (const key of Object.keys(dto.address)) {
        query['address.' + key] = dto.address[key];
      }
      query['address.displayName'] = this.geoService.getDisplayName({
        ...record.address,
        ...dto.address,
      });
    }
    return this.recordModel.findByIdAndUpdate(record, query);
  }

  async deleteOne(record: RecordDocument): Promise<{
    record: RecordDocument;
    photos: { deleted: (void | PhotoDocument)[]; failed: string[] };
  }> {
    const [photoResult, recordResult] = await Promise.all([
      this.photosService.deleteMany(record.photos),
      record.remove(),
    ]);
    return { record: recordResult, photos: photoResult };
  }
}
