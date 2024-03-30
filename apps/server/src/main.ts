import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';

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
  app.useGlobalInterceptors(
    // Set serialization for all outgoing response DTO
    // Returned object from controller that is not transformed to DTO will be transformer to {}
    new ClassSerializerInterceptor(app.get(Reflector), {
      strategy: 'excludeAll', // All DTO properties must be explicitly included otherwise it will be excluded
      excludeExtraneousValues: true, // Remove properties that are not in the DTO
    }),
  );
  const config = app.get(ConfigService);
  const port = config.get<number>('port') || -1; // -1 to throw error if not set

  await app.listen(port);
}
bootstrap();
