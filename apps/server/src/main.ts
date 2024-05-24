import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { INestApplication } from '@nestjs/common';
import metadata from './metadata';

/**
 * Setup Swagger documentation as web service for the application
 */
export async function setupSwagger(app: INestApplication) {
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

  // Used to make swagger(swagger dto type) work with swc compilation
  await SwaggerModule.loadPluginMetadata(metadata);

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  const swaggerPath = 'api';
  SwaggerModule.setup(swaggerPath, app, document);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('port') || -1; // -1 to throw error if not set

  if (configService.get<boolean>('runSwagger')) {
    setupSwagger(app);
  }

  await app.listen(port);
}
bootstrap();
