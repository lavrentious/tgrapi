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
import { Request, Response } from 'express';
import { IpAddress } from 'src/common/decorators/ip-address.decorator';
import { UserAgent } from 'src/common/decorators/user-agent.decorator';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { REFRESH_TOKEN_LIFESPAN } from './schemas/token.schema';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
    @IpAddress() ipAddress: string,
    @UserAgent() userAgent: string,
  ) {
    const result = await this.authService.register(dto, ipAddress, userAgent);
    res.cookie('refreshToken', result.refreshToken, {
      expires: new Date(Date.now() + REFRESH_TOKEN_LIFESPAN * 1000),
      httpOnly: true,
    });
    return result;
  }

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
    res.cookie('refreshToken', result.refreshToken, {
      expires: new Date(Date.now() + REFRESH_TOKEN_LIFESPAN * 1000),
      httpOnly: true,
    });
    return result;
  }

  @Delete('logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      throw new UnauthorizedException('no refreshToken cookie present');
    }
    const result = this.authService.logout(refreshToken);
    res.clearCookie('refreshToken');
    return result;
  }

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
    res.cookie('refreshToken', result.refreshToken, {
      expires: new Date(Date.now() + REFRESH_TOKEN_LIFESPAN * 1000),
      httpOnly: true,
    });
    return result;
  }
}
