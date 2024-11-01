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
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { hours, Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { Request } from 'express';
import { isValidObjectId } from 'mongoose';
import { Action, AppAbility } from 'src/ability/ability.factory';
import { AbilityPipe } from 'src/ability/ability.pipe';
import { SetAndCheckPolicies } from 'src/ability/decorators/set-and-check-policies.decorator';
import { getAllowedFields } from 'src/ability/utils/ability-fields';
import { RequestUser } from 'src/auth/decorators/request-user.decorator';
import { AnonymousJwtAuthGuard } from 'src/auth/guards/anonymous-jwt-auth.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ParseObjectIdPipe } from 'src/common/pipes/parse-object-id.pipe';
import { pick } from 'src/common/utils/pick';
import { FindUsersQueryParams } from './dto/find-all-users-params.dto';
import { FindAllUsersResultDto } from './dto/find-all-users-result.dto';
import { PublicUser } from './dto/public-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DeleteUserPolicyHandler } from './policies/delete-user.policy';
import { UpdateUserPolicyHandler } from './policies/update-user.policy';
import { User, UserDocument } from './schemas/user.schema';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @ApiOkResponse({ type: PublicUser })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('/me')
  async me(
    @RequestUser() user: User,
    @RequestUser(AbilityPipe) ability: AppAbility,
  ): Promise<PublicUser> {
    const res = await this.userService.findById(user._id);
    if (!res) throw new NotFoundException();
    return pick(
      res.toObject(),
      getAllowedFields(ability, Action.READ, res),
    ) as PublicUser;
  }

  @ApiOkResponse({ type: PublicUser })
  @Get(':idOrUsername')
  @UseGuards(AnonymousJwtAuthGuard)
  async getById(
    @Param('idOrUsername') idOrUsername: string,
    @RequestUser(AbilityPipe) ability: AppAbility,
  ): Promise<PublicUser> {
    let res: UserDocument;
    if (isValidObjectId(idOrUsername))
      res = await this.userService.findById(idOrUsername);
    else res = await this.userService.findByUsername(idOrUsername);

    if (!res) throw new NotFoundException();
    return pick(
      res.toObject(),
      getAllowedFields(ability, Action.READ, res),
    ) as PublicUser;
  }

  @ApiOkResponse({ type: FindAllUsersResultDto })
  @UseGuards(AnonymousJwtAuthGuard)
  @Get()
  async getAll(
    @Query() params: FindUsersQueryParams,
    @RequestUser(AbilityPipe) ability: AppAbility,
  ): Promise<FindAllUsersResultDto> {
    const res = await this.userService.findAll(params);
    return {
      ...res,
      docs: res.docs.map(
        (doc: UserDocument) =>
          pick(
            doc.toObject(),
            getAllowedFields(ability, Action.READ, doc),
          ) as PublicUser,
      ),
    };
  }

  @ApiOkResponse({ type: PublicUser })
  @ApiBearerAuth()
  @Delete(':id')
  @SetAndCheckPolicies(DeleteUserPolicyHandler)
  @UseGuards(JwtAuthGuard)
  async deleteById(
    @Param('id', new ParseObjectIdPipe()) id: string,
    @RequestUser(AbilityPipe) ability: AppAbility,
  ): Promise<PublicUser> {
    const user = await this.userService.findById(id);
    if (!user) throw new NotFoundException();
    ForbiddenError.from(ability).throwUnlessCan(Action.DELETE, user);
    return pick(
      await this.userService.deleteById(id),
      getAllowedFields(ability, Action.READ, user),
    ) as PublicUser;
  }

  @ApiOkResponse({ type: PublicUser })
  @ApiBearerAuth()
  @Patch(':id')
  @SetAndCheckPolicies(UpdateUserPolicyHandler)
  @UseGuards(JwtAuthGuard)
  async updateById(
    @Param('id', new ParseObjectIdPipe()) id: string,
    @Body() dto: UpdateUserDto,
    @RequestUser(AbilityPipe) ability: AppAbility,
  ): Promise<PublicUser> {
    const user = await this.userService.findById(id);
    if (!user) throw new NotFoundException();
    if (Object.keys(dto).length === 0) throw new BadRequestException();
    Object.keys(dto).forEach((field) => {
      ForbiddenError.from(ability).throwUnlessCan(Action.UPDATE, user, field);
    });
    const res = await this.userService.updateOne(user, dto);
    return pick(
      res.toObject(),
      getAllowedFields(ability, Action.READ, user),
    ) as PublicUser;
  }

  @ApiBearerAuth()
  @ApiOkResponse()
  @UseGuards(JwtAuthGuard)
  @Put(':id/password')
  async updatePassword(
    @RequestUser(AbilityPipe) ability: AppAbility,
    @Body() dto: UpdatePasswordDto,
    @Param('id') id: string,
    @Req() req: Request,
  ): Promise<void> {
    const { refreshToken } = req.cookies;
    const user = await this.userService.findById(id);
    if (!user) throw new NotFoundException();
    ForbiddenError.from(ability).throwUnlessCan(
      Action.UPDATE,
      user,
      'password',
    );
    await this.userService.updatePassword(user, dto, refreshToken);
  }

  @ApiBearerAuth()
  @ApiOkResponse()
  @Throttle({ default: { limit: 3, ttl: hours(24) } }) // 3 per 24 hours
  @UseGuards(JwtAuthGuard, ThrottlerGuard)
  @Post('confirm-email')
  async resendEmailConfirmation(@RequestUser() user: User): Promise<void> {
    return this.userService.resendEmailConfirmation(user);
  }

  @ApiOkResponse({ type: String })
  @Get('confirm-email/:key')
  async confirmEmail(@Param('key') key: string): Promise<string> {
    return this.userService.confirmEmail(key);
  }
}
