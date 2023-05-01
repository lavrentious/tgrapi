import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiOkResponse, ApiProperty } from '@nestjs/swagger';
import { EnvironmentVariables } from './env.validation';

class HealthCheckResult {
  @ApiProperty()
  version: string;

  @ApiProperty({ format: 'date-time' })
  lastCommitDate: string;
}

@Controller()
export class AppController {
  constructor(
    private readonly configService: ConfigService<EnvironmentVariables>,
  ) {}

  @ApiOkResponse({ type: HealthCheckResult })
  @Get()
  health(): HealthCheckResult {
    return {
      version: this.configService.get('VERSION'),
      lastCommitDate: this.configService.get('LAST_COMMIT_DATE'),
    };
  }
}
