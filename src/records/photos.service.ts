import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema } from 'mongoose';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { CreatePhotoDto } from './dto/create-photo.dto';
import { UpdatePhotoDto } from './dto/update-photo.dto';
import { UploadPhotoDto } from './dto/upload-photo.dto';
import { Photo, PhotoDocument } from './schemas/photo.schema';
import { MAX_PHOTOS, RecordDocument } from './schemas/record.schema';

@Injectable()
export class PhotosService {
  constructor(
    private readonly cloudinaryService: CloudinaryService,
    @InjectModel(Photo.name)
    private readonly photoModel: Model<PhotoDocument>,
  ) {}
  async create(
    file: Express.Multer.File,
    uploadDto: UploadPhotoDto,
    record: RecordDocument,
  ): Promise<PhotoDocument> {
    if (record.photos.length >= MAX_PHOTOS) {
      throw new BadRequestException('Photos limit reached');
    }
    const { public_id, url } = await this.cloudinaryService.uploadImage(file);
    const createDto: CreatePhotoDto = {
      ...uploadDto,
      publicId: public_id,
      url,
    };
    const photo = await this.photoModel.create(createDto);
    record.photos.push(photo._id);
    await record.save();
    return photo;
  }

  async deleteOne(photoId: string): Promise<PhotoDocument> {
    const photo = await this.findById(photoId);
    if (!photo) {
      throw new NotFoundException('photo not found');
    }

    const [, dbResult] = await Promise.all([
      this.cloudinaryService.deleteImage(photo.publicId),
      photo.remove(),
    ]);
    return dbResult;
  }

  async deleteMany(ids: (string | Schema.Types.ObjectId)[]): Promise<{
    deleted: (PhotoDocument | void)[];
    failed: string[];
  }> {
    const failed: string[] = [];
    const deleted = await Promise.all(
      ids.map((id) =>
        this.deleteOne(id.toString()).catch(() => {
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
    return photo.updateOne(dto);
  }
}
