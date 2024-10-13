import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import { setupSwagger, setupSwaggerUI } from './lib/swagger/swagger.config';
import { AllConfig } from './config/config.module';
async function bootstrap() {
  // bufferLogs: true is needed for PinoLoggin to work
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(app.get(Logger));
  app.useGlobalInterceptors(new LoggerErrorInterceptor());

  // Add security headers
  // Helmet and CORS must be added before module that may use app.use(...)
  app.use(helmet());
  app.enableCors();

  const configService = app.get(ConfigService<AllConfig>);
  const port = configService.getOrThrow('main.PORT', { infer: true });

  if (configService.getOrThrow('main.RUN_SWAGGER', { infer: true })) {
    const { document } = await setupSwagger(app);
    setupSwaggerUI(app, document);
  }

  await app.listen(port);
}
bootstrap();
