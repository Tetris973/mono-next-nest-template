import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import metadata from '@server/metadata';

/**
 * Setup Swagger documentation to provide api definition for the application
 * This is done to be used by the main application to generate the swagger ui
 * And to able to generate separately the json api schema to genrate the client sdk
 * @param app - The main nest application
 * @returns - The swagger configuration and the document
 */
export async function setupSwagger(app: INestApplication) {
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Nest basic API for users')
    .setDescription('The users API description')
    .setVersion('1.0')
    .addSecurityRequirements('token') // Auto add the token to all endpoints
    .build();

  // Used to make swagger(swagger dto type) work with swc compilation
  await SwaggerModule.loadPluginMetadata(metadata);

  const document = SwaggerModule.createDocument(app, swaggerConfig);

  return { document, swaggerConfig };
}

export function setupSwaggerUI(app: INestApplication, document: any) {
  const swaggerPath = 'api';
  SwaggerModule.setup(swaggerPath, app, document);
}
