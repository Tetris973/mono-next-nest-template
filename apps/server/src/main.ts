import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { INestApplication } from '@nestjs/common';
import metadata from './metadata';
import helmet from 'helmet';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';

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
  // bufferLogs: true is needed for PinoLoggin to work
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(app.get(Logger));
  app.useGlobalInterceptors(new LoggerErrorInterceptor());

  // Add security headers
  // Helmet and CORS must be added before module that may use app.use(...)
  app.use(helmet());
  app.enableCors();

  const configService = app.get(ConfigService);
  const port = configService.getOrThrow<number>('PORT');

  if (configService.getOrThrow<boolean>('RUN_SWAGGER')) {
    setupSwagger(app);
  }

  await app.listen(port);
}
bootstrap();
