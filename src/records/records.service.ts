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
  ) {}

  async create(
    dto: CreateRecordDto,
    authorId: string,
  ): Promise<RecordDocument> {
    return new this.recordModel({ ...dto, author: authorId }).save();
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
      console.log({ unusedPhotos });
      const deletionResult = this.photosService.deleteMany(unusedPhotos);
      return Promise.all([record.updateOne(dto), deletionResult]);
    }
    return record.updateOne(dto);
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
