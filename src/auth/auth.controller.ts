import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ApiCookieAuth,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { hours, Throttle } from '@nestjs/throttler';
import { Request, Response } from 'express';
import { IpAddress } from 'src/common/decorators/ip-address.decorator';
import { UserAgent } from 'src/common/decorators/user-agent.decorator';
import { Environment, EnvironmentVariables } from 'src/env.validation';
import { AuthService } from './auth.service';
import { AuthResponseDto } from './dto/auth-response.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { REFRESH_TOKEN_LIFESPAN } from './schemas/token.schema';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private configService: ConfigService<EnvironmentVariables>,
  ) {}

  private setRefreshTokenCookie(
    res: Response,
    refreshToken: string,
    secure = this.configService.get('NODE_ENV', { infer: true }) ===
      Environment.PRODUCTION,
  ) {
    res.cookie('refreshToken', refreshToken, {
      expires: new Date(Date.now() + REFRESH_TOKEN_LIFESPAN * 1000),
      httpOnly: true,
      sameSite: secure ? 'none' : 'lax',
      secure,
    });
  }

  @ApiOkResponse({ type: AuthResponseDto })
  @Throttle({ default: { limit: 3, ttl: hours(24) } }) // 3 per 24 hours
  @Post('register')
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
    @IpAddress() ipAddress: string,
    @UserAgent() userAgent: string,
  ) {
    const result = await this.authService.register(dto, ipAddress, userAgent);
    this.setRefreshTokenCookie(res, result.refreshToken);
    return result;
  }

  @ApiOkResponse({ type: AuthResponseDto })
  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
    @IpAddress() ipAddress: string,
    @UserAgent() userAgent: string,
  ) {
    const result = await this.authService.login(
      dto.usernameOrEmail,
      dto.password,
      ipAddress,
      userAgent,
    );
    this.setRefreshTokenCookie(res, result.refreshToken);
    return result;
  }

  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  @ApiCookieAuth()
  @Delete('logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      throw new UnauthorizedException('no refreshToken cookie present');
    }
    res.clearCookie('refreshToken');
    await this.authService.logout(refreshToken);
  }

  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  @ApiCookieAuth()
  @Delete('logout-all')
  async logoutAll(@Req() req: Request) {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      throw new UnauthorizedException('no refreshToken cookie present');
    }
    await this.authService.logoutAll(refreshToken);
  }

  @ApiOkResponse({ type: AuthResponseDto })
  @ApiCookieAuth()
  @Get('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @IpAddress() ipAddress: string,
    @UserAgent() userAgent: string,
  ) {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      throw new UnauthorizedException('no refreshToken cookie present');
    }
    const result = await this.authService
      .refresh(refreshToken, ipAddress, userAgent)
      .catch((e) => {
        if (e instanceof UnauthorizedException) {
          res.clearCookie('refreshToken');
        }
        throw e;
      });
    this.setRefreshTokenCookie(res, result.refreshToken);
    return result;
  }
}
