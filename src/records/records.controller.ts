import { ForbiddenError } from '@casl/ability';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Action, AppAbility } from 'src/ability/ability.factory';
import { AbilityPipe } from 'src/ability/ability.pipe';
import { SetAndCheckPolicies } from 'src/ability/decorators/set-and-check-policies.decorator';
import { RequestUser } from 'src/auth/decorators/request-user.decorator';
import { AnonymousJwtAuthGuard } from 'src/auth/guards/anonymous-jwt-auth.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ParseObjectIdPipe } from 'src/common/pipes/parse-object-id.pipe';
import { CreateRecordPolicyHandler } from 'src/records/policies/create-record.policy';
import { UpdateRecordPolicyHandler } from 'src/records/policies/update-record.policy';
import { User } from 'src/users/schemas/user.schema';
import { CreateRecordDto } from './dto/create-record.dto';
import { FindAllResultDto } from './dto/find-all-result.dto';
import { FindRecordsQueryParams } from './dto/find-records-query-params.dto';
import { UpdatePhotoDto } from './dto/update-photo.dto';
import { UpdateRecordDto } from './dto/update-record.dto';
import { UploadPhotoDto } from './dto/upload-photo.dto';
import { MulterImageOptions } from './multer.config';
import { PhotosService } from './photos.service';
import { DeleteRecordPolicyHandler } from './policies/delete-record.policy';
import { RecordsService } from './records.service';
import { Photo } from './schemas/photo.schema';
import { Record } from './schemas/record.schema';

@ApiForbiddenResponse()
@ApiUnauthorizedResponse()
@ApiTags('records')
@Controller('records')
export class RecordsController {
  constructor(
    private readonly recordsService: RecordsService,
    private readonly photosService: PhotosService,
  ) {}

  @ApiOkResponse({ type: Record })
  @ApiBearerAuth()
  @Post()
  @SetAndCheckPolicies(CreateRecordPolicyHandler)
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() dto: CreateRecordDto,
    @RequestUser() currentUser: User,
  ): Promise<Record> {
    return this.recordsService.create(dto, currentUser._id);
  }

  @ApiOkResponse({ type: Photo })
  @ApiBearerAuth()
  @Post('/:id/photos')
  @UseInterceptors(FileInterceptor('file', MulterImageOptions))
  @SetAndCheckPolicies(UpdateRecordPolicyHandler)
  @UseGuards(JwtAuthGuard)
  async uploadPhoto(
    @Param('id', new ParseObjectIdPipe()) id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UploadPhotoDto,
    @RequestUser(AbilityPipe) ability: AppAbility,
  ) {
    if (!file) {
      throw new BadRequestException('no file attached');
    }
    const record = await this.recordsService.findById(id, false);
    if (!record) {
      throw new NotFoundException();
    }
    ForbiddenError.from(ability).throwUnlessCan(
      Action.UPDATE,
      record,
      'photos',
    );
    return this.photosService.create(file, dto, record);
  }

  @ApiOkResponse({ type: Photo })
  @ApiBearerAuth()
  @Delete('/:recordId/photos/:photoId')
  @UseGuards(JwtAuthGuard)
  async deletePhoto(
    @Param('recordId', new ParseObjectIdPipe()) recordId: string,
    @Param('photoId', new ParseObjectIdPipe()) photoId: string,
    @RequestUser(AbilityPipe) ability: AppAbility,
  ) {
    const record = await this.recordsService.findById(recordId, false);
    if (!record) {
      throw new NotFoundException('record not found');
    }
    ForbiddenError.from(ability).throwUnlessCan(
      Action.UPDATE,
      record,
      'photos',
    );
    const photoResult = await this.photosService.deleteOne(photoId);
    return photoResult;
  }

  @ApiOkResponse({ type: FindAllResultDto })
  @Get()
  @UseGuards(AnonymousJwtAuthGuard)
  async findAll(
    @Query() params: FindRecordsQueryParams,
  ): Promise<FindAllResultDto> {
    return this.recordsService.findAll(params);
  }

  @ApiOkResponse({ type: Record })
  @Get(':id')
  async findOne(
    @Param('id', new ParseObjectIdPipe()) id: string,
  ): Promise<Record> {
    const record = await this.recordsService.findById(id);
    if (!record) {
      throw new NotFoundException();
    }
    return record;
  }

  @ApiOkResponse({ type: Record })
  @ApiBearerAuth()
  @Patch(':id')
  @SetAndCheckPolicies(UpdateRecordPolicyHandler)
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id', new ParseObjectIdPipe()) id: string,
    @Body() dto: UpdateRecordDto,
    @RequestUser(AbilityPipe) ability: AppAbility,
  ) {
    const record = await this.recordsService.findById(id, false);
    if (!record) {
      throw new NotFoundException();
    }
    Object.keys(dto).forEach((field) => {
      if (['autoAddress'].includes(field)) return;
      ForbiddenError.from(ability).throwUnlessCan(Action.UPDATE, record, field);
    });
    return this.recordsService.updateOne(record, dto);
  }

  @ApiOkResponse({ type: Photo })
  @ApiBearerAuth()
  @Patch(':recordId/photos/:photoId')
  @SetAndCheckPolicies(UpdateRecordPolicyHandler)
  @UseGuards(JwtAuthGuard)
  async updatePhoto(
    @Param('recordId', new ParseObjectIdPipe()) recordId: string,
    @Param('photoId', new ParseObjectIdPipe()) photoId: string,
    @Body() dto: UpdatePhotoDto,
    @RequestUser(AbilityPipe) ability: AppAbility,
  ) {
    const record = await this.recordsService.findById(recordId, false);
    if (!record) {
      throw new NotFoundException();
    }
    ForbiddenError.from(ability).throwUnlessCan(
      Action.UPDATE,
      record,
      'photos',
    );
    return this.photosService.updateOne(photoId, dto);
  }

  @ApiOkResponse({
    type: Record,
  })
  @ApiBearerAuth()
  @Delete(':id')
  @SetAndCheckPolicies(DeleteRecordPolicyHandler)
  @UseGuards(JwtAuthGuard)
  async delete(
    @Param('id', new ParseObjectIdPipe()) id: string,
    @RequestUser(AbilityPipe) ability: AppAbility,
  ) {
    const record = await this.recordsService.findById(id, false);
    if (!record) {
      throw new NotFoundException();
    }
    ForbiddenError.from(ability).throwUnlessCan(Action.DELETE, record);
    return this.recordsService.deleteOne(record);
  }
}
