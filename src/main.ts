import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { Request } from 'express';
import morgan from 'morgan';
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
      {
        skip: (req: Request) => req.originalUrl.startsWith('/api'),
      },
    ),
  );
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useGlobalFilters(new ForbiddenErrorFilter());
  const config = new DocumentBuilder()
    .setTitle('TGR API')
    .setDescription('The TGR API description')
    .setVersion(configService.get('VERSION'))
    .addBearerAuth({
      type: 'http',
      name: 'Authorization',
      in: 'header',
      bearerFormat: 'JWT',
      scheme: 'bearer',
    })
    .addCookieAuth('refreshToken', {
      type: 'http',
      in: 'Header',
      scheme: 'Bearer',
      name: 'refreshToken',
    })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  await app.listen(configService.get('PORT') || 8080);
}
bootstrap();
