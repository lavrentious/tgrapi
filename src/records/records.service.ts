import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage, Types } from 'mongoose';
import { escapeRegExp } from 'src/common/utils/escape-regexp';
import { CreateRecordDto } from './dto/create-record.dto';
import { FindAllResultDto } from './dto/find-all-result.dto';
import { FindRecordsQueryParams } from './dto/find-records-query-params.dto';
import { UpdateRecordDto } from './dto/update-record.dto';
import { GeoService } from './geo.service';
import { PhotosService } from './photos.service';
import { Photo, PhotoDocument } from './schemas/photo.schema';
import { Record, RecordDocument } from './schemas/record.schema';

export const CLOSEST_RADIUS = 300;

@Injectable()
export class RecordsService {
  constructor(
    @InjectModel(Record.name)
    private readonly recordModel: Model<RecordDocument>,
    @InjectModel(Photo.name)
    private readonly photoModel: Model<PhotoDocument>,
    @Inject(forwardRef(() => PhotosService))
    private readonly photosService: PhotosService,
    private readonly geoService: GeoService,
  ) {}

  async create(
    dto: CreateRecordDto,
    authorId: Types.ObjectId | string,
  ): Promise<RecordDocument> {
    let { address } = dto;
    if (!dto.address || dto.autoAddress) {
      address = await this.geoService.addressByCoords(dto.lat, dto.lon);
    }
    return this.recordModel.create({
      ...dto,
      address: {
        ...address,
      },
      _location: [dto.lon, dto.lat],
      author: new Types.ObjectId(authorId),
    });
  }

  async findAll(params: FindRecordsQueryParams): Promise<FindAllResultDto[]> {
    // TODO: @casl/mongoose AccessibleRecords plugin
    const { userLat, userLon, radius, search } = params;
    const aggregation = [] as PipelineStage[];
    if (userLat != null && userLon != null) {
      aggregation.push(
        {
          $geoNear: {
            near: {
              type: 'Point',
              coordinates: [userLon, userLat],
            },
            distanceField: 'distance',
            maxDistance: radius ?? CLOSEST_RADIUS,
            spherical: true,
            key: '_location',
          },
        },
        {
          $addFields: {
            azimuth: {
              $radiansToDegrees: {
                $atan2: [
                  { $subtract: ['$lon', userLon] },
                  { $subtract: ['$lat', userLat] },
                ],
              },
            },
          },
        },
      );
    }
    if (search) {
      const regexp = new RegExp(
        search
          .trim()
          .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
          .split(/\s+/)
          .map((w) => `(?=.*${escapeRegExp(w)})`)
          .join('') + '.+',
        'gi',
      );
      aggregation.push({
        $match: {
          $or: [{ name: regexp }, { 'address.displayName': regexp }],
        },
      });
    }
    if (!aggregation.length) aggregation.push({ $match: {} });
    console.log(aggregation);
    return this.recordModel.aggregate(aggregation).exec();
  }

  async findById(
    id: string | Types.ObjectId,
    populate = true,
  ): Promise<RecordDocument> {
    const q = this.recordModel.findById(id);
    if (populate) {
      q.populate('author', 'username').populate(
        'photos',
        '-__v',
        this.photoModel,
      );
    }
    return q;
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
      dto.photos = (
        await Promise.all(dto.photos.map((id) => this.photosService.exists(id)))
      )
        .filter((e) => e != null)
        .map((e) => e._id.toString());
      const newPhotos = new Set(dto.photos);
      const unusedPhotos = record.photos.filter(
        (id) => !newPhotos.has(id.toString()),
      );
      await this.photosService.deleteMany(unusedPhotos);
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
    }
    if (dto.lat !== record.lat || dto.lon !== record.lon) {
      query['location.coordinates'] = [dto.lon, dto.lat];
    }
    return record.updateOne(query, { new: true });
  }

  async deleteOne(record: RecordDocument): Promise<{
    record: RecordDocument;
    photos: { deleted: (void | Photo)[]; failed: string[] };
  }> {
    const [photoResult, recordResult] = await Promise.all([
      this.photosService.deleteMany(record.photos),
      record.deleteOne(),
    ]);
    return { record: recordResult, photos: photoResult };
  }
}
