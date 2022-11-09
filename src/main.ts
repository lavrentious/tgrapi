import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { ForbiddenErrorFilter } from './common/filters/forbidden-error.filter';

function checkEnvVarsDefined() {
  const requiredVars = [
    'PORT',
    'DB_URL',
    'JWT_ACCESS_SECRET',
    'JWT_REFRESH_SECRET',
    'SMTP_USER',
    'SMTP_PASS',
    'API_URL',
    'CLIENT_URL',
    'CLOUDINARY_CLOUD_NAME',
    'CLOUDINARY_API_KEY',
    'CLOUDINARY_API_SECRET',
  ];
  for (const varName of requiredVars) {
    if (!(varName in process.env))
      throw new Error('Environment variable missing: ' + varName);
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  checkEnvVarsDefined();
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useGlobalFilters(new ForbiddenErrorFilter());
  await app.listen(process.env.PORT || 8080);
}
bootstrap();
