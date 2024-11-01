import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { hours, Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { AnonymousJwtAuthGuard } from 'src/auth/guards/anonymous-jwt-auth.guard';
import { CreatePasswordResetDto } from './dto/create.dto';
import { ResetPasswordDto } from './dto/reset.dto';
import { PasswordResetsService } from './password-resets.service';

@ApiTags('passwordResets')
@Controller('password-resets')
export class PasswordResetsController {
  constructor(private readonly passwordResetsService: PasswordResetsService) {}

  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse()
  @Throttle({ default: { limit: 5, ttl: hours(24) } }) // 5 per 24 hours
  @UseGuards(AnonymousJwtAuthGuard, ThrottlerGuard)
  @Post()
  async create(@Body() dto: CreatePasswordResetDto) {
    await this.passwordResetsService.create(dto.usernameOrEmail);
  }

  @ApiNotFoundResponse()
  @ApiOkResponse()
  @UseGuards(AnonymousJwtAuthGuard)
  @Get(':key')
  async check(@Param('key') key: string) {
    await this.passwordResetsService.check(key);
  }

  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse()
  @UseGuards(AnonymousJwtAuthGuard)
  @Patch(':key')
  async reset(@Param('key') key: string, @Body() dto: ResetPasswordDto) {
    await this.passwordResetsService.reset(key, dto.password);
  }
}
