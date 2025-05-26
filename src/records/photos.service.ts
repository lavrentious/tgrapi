import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Mutex } from 'async-mutex';
import { Model, Types } from 'mongoose';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { UpdatePhotoDto } from './dto/update-photo.dto';
import { UploadPhotoDto } from './dto/upload-photo.dto';
import { RecordsService } from './records.service';
import { Photo, PhotoDocument } from './schemas/photo.schema';
import { MAX_PHOTOS, RecordDocument } from './schemas/record.schema';

@Injectable()
export class PhotosService {
  private uploadLocks = new Map<string, Mutex>();

  constructor(
    private readonly cloudinaryService: CloudinaryService,
    @InjectModel(Photo.name)
    private readonly photoModel: Model<PhotoDocument>,
    private readonly recordsService: RecordsService,
  ) {}
  async create(
    file: Express.Multer.File,
    uploadDto: UploadPhotoDto,
    record: RecordDocument,
  ): Promise<PhotoDocument> {
    const recordId = record._id.toString();
    let mutex = this.uploadLocks.get(recordId);
    if (!mutex) {
      mutex = new Mutex();
      this.uploadLocks.set(recordId, mutex);
    }

    return await mutex.runExclusive(async () => {
      try {
        const freshRecord = await this.recordsService.findById(
          record._id,
          false,
        );
        if (freshRecord.photos.length >= MAX_PHOTOS) {
          throw new BadRequestException('Photos limit reached');
        }

        const { public_id, url } =
          await this.cloudinaryService.uploadImage(file);
        const photo = await this.photoModel.create({
          ...uploadDto,
          publicId: public_id,
          url,
        });

        freshRecord.photos.push(photo._id);
        await freshRecord.save();
        return photo;
      } finally {
        this.uploadLocks.delete(recordId);
      }
    });
  }

  async deleteOne(recordId: string, photoId: string): Promise<PhotoDocument> {
    const photo: PhotoDocument = await this.findById(photoId);
    if (!photo) {
      throw new NotFoundException('photo not found');
    }

    let mutex = this.uploadLocks.get(recordId);
    if (!mutex) {
      mutex = new Mutex();
      this.uploadLocks.set(recordId, mutex);
    }

    await mutex.runExclusive(async () => {
      try {
        const freshRecord = await this.recordsService.findById(recordId, false);
        freshRecord.photos = freshRecord.photos.filter(
          (id) => id.toString() !== photoId,
        );
        await freshRecord.save();
        await Promise.all([
          this.cloudinaryService.deleteImage(photo.publicId),
          photo.deleteOne(),
        ]);
      } finally {
        this.uploadLocks.delete(recordId);
      }
    });

    return photo;
  }

  async deleteMany(
    recordId: string,
    photoIds: (string | Types.ObjectId)[],
  ): Promise<{
    deleted: (Photo | void)[];
    failed: string[];
  }> {
    const failed: string[] = [];
    const deleted = await Promise.all(
      photoIds.map((id) =>
        this.deleteOne(recordId, id.toString()).catch((e) => {
          console.warn('Failed to delete photo', id, e);
          failed.push(id.toString());
        }),
      ),
    );
    return { deleted, failed };
  }

  async findById(id: string): Promise<PhotoDocument> {
    return this.photoModel.findById(id);
  }

  async exists(id: string) {
    return this.photoModel.exists({ _id: id });
  }

  async updateOne(id: string, dto: UpdatePhotoDto): Promise<PhotoDocument> {
    const photo = await this.findById(id);
    if (!photo) {
      throw new NotFoundException();
    }
    photo.set(dto);
    await photo.save();
    return photo;
  }
}
