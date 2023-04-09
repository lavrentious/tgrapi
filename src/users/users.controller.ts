import { ForbiddenError } from '@casl/ability';
import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { OmitType } from '@nestjs/mapped-types';
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

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/me')
  async me(@RequestUser() user: User): Promise<PublicUser> {
    const res = await this.userService.findById(user._id, '-__v -password');
    if (!res) throw new NotFoundException();
    return res;
  }

  @Get(':id')
  @UseGuards(AnonymousJwtAuthGuard)
  async getById(
    @Param('id', new ParseObjectIdPipe()) id: string,
  ): Promise<PublicUser> {
    const res = await this.userService.findById(id, '-__v -password');
    if (!res) throw new NotFoundException();
    return res;
  }

  @Get()
  async getAll(): Promise<PublicUser[]> {
    return this.userService.findAll('-__v -password');
  }

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
    Object.keys(dto).forEach((field) => {
      ForbiddenError.from(ability).throwUnlessCan(Action.UPDATE, user, field);
    });
    return this.userService.updateOne(user, dto);
  }

  @Get('confirm-email/:key')
  async confirmEmail(@Param('key') key: string): Promise<string> {
    return this.userService.confirmEmail(key);
  }
}
