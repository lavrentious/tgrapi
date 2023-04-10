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
  UseGuards,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags, OmitType } from '@nestjs/swagger';
import { isValidObjectId } from 'mongoose';
import { Action, AppAbility } from 'src/ability/ability.factory';
import { AbilityPipe } from 'src/ability/ability.pipe';
import { SetAndCheckPolicies } from 'src/ability/decorators/set-and-check-policies.decorator';
import { RequestUser } from 'src/auth/decorators/request-user.decorator';
import { AnonymousJwtAuthGuard } from 'src/auth/guards/anonymous-jwt-auth.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ParseObjectIdPipe } from 'src/common/pipes/parse-object-id.pipe';
import { UpdateUserDto } from './dto/update-user.dto';
import { DeleteUserPolicyHandler } from './policies/delete-user.policy';
import { UpdateUserPolicyHandler } from './policies/update-user.policy';
import { User } from './schemas/user.schema';
import { UsersService } from './users.service';

// TODO: optional values based on ability
class PublicUser extends OmitType(User, ['password']) {}

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @ApiOkResponse({ type: PublicUser })
  @UseGuards(JwtAuthGuard)
  @Get('/me')
  async me(@RequestUser() user: User): Promise<PublicUser> {
    const res = await this.userService.findById(user._id, '-__v -password');
    if (!res) throw new NotFoundException();
    return res;
  }

  @ApiOkResponse({ type: PublicUser })
  @Get(':idOrUsername')
  @UseGuards(AnonymousJwtAuthGuard)
  async getById(
    @Param('idOrUsername') idOrUsername: string,
  ): Promise<PublicUser> {
    let res: User;
    if (isValidObjectId(idOrUsername))
      res = await this.userService.findById(idOrUsername, '-__v -password');
    else
      res = await this.userService.findByUsername(
        idOrUsername,
        '-__v -password',
      );
    if (!res) throw new NotFoundException();
    return res;
  }

  @ApiOkResponse({ type: [PublicUser] })
  @Get()
  async getAll(): Promise<PublicUser[]> {
    return this.userService.findAll('-__v -password');
  }

  @ApiOkResponse({ type: PublicUser })
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
    return this.userService.deleteById(id);
  }

  @ApiOkResponse({ type: PublicUser })
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
    const { password: _, ...res } = (
      await this.userService.updateOne(user, dto)
    ).toObject();
    return res;
  }

  @ApiOkResponse({ type: String })
  @Get('confirm-email/:key')
  async confirmEmail(@Param('key') key: string): Promise<string> {
    return this.userService.confirmEmail(key);
  }
}
