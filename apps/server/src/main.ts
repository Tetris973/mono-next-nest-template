import { NestFactory, Reflector } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import {
  ValidationPipe,
  ClassSerializerInterceptor,
  INestApplication,
} from '@nestjs/common';
/**
 * Setup Swagger documentation as web service for the application
 */
export function setupSwagger(app: INestApplication) {
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Nest basic API for users')
    .setDescription('The users API description')
    .setVersion('1.0')
    .addBearerAuth(
      // Add JWT token to the header for authentication
      {
        type: 'http',
        scheme: 'Bearer',
        bearerFormat: 'JWT',
        in: 'header',
      },
      'token',
    )
    .addSecurityRequirements('token') // Auto add the token to all endpoints
    .addTag('users')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  const swaggerPath = 'api';
  SwaggerModule.setup(swaggerPath, app, document);
}

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

  const configService = app.get(ConfigService);
  const port = configService.get<number>('port') || -1; // -1 to throw error if not set

  if (configService.get<boolean>('runSwagger')) {
    setupSwagger(app);
  }

  await app.listen(port);
}
bootstrap();
