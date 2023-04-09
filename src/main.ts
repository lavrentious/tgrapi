import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { version } from '../package.json';
import { AppModule } from './app.module';
import { ForbiddenErrorFilter } from './common/filters/forbidden-error.filter';
import { EnvironmentVariables } from './env.validation';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService =
    app.get<ConfigService<EnvironmentVariables>>(ConfigService);
  app.enableCors({
    origin: configService.get('CLIENT_URL'),
    credentials: true,
  });
  app.use(cookieParser());
  app.use(
    morgan(
      '[:date[clf]] :method :url :status :response-time ms - :res[content-length]',
    ),
  );
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useGlobalFilters(new ForbiddenErrorFilter());
  const config = new DocumentBuilder()
    .setTitle('TGR API')
    .setDescription('The TGR API description')
    .setVersion(version)
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(configService.get('PORT') || 8080);
}
bootstrap();
