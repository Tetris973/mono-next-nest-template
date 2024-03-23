import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Set validation for all incoming request using a DTO with class-validator
  app.useGlobalPipes(
    new ValidationPipe({
      // Strip unknown properties from the request body
      whitelist: true,
      // Transform the request body to the DTO instance
      transform: true,
    }),
  );
  const config = app.get(ConfigService);
  const port = config.get<number>('port') || -1; // -1 to throw error if not set

  await app.listen(port);
}
bootstrap();
