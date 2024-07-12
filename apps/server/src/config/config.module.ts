import { Module, Logger } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import config from './configuration';
import { validate } from './env.validation';

@Module({
  imports: [
    NestConfigModule.forRoot({
      validate,
      envFilePath: `.env.${process.env.NODE_ENV}.local`,
      load: [config],
      isGlobal: true,
    }),
  ],
  exports: [NestConfigModule],
})
export class ConfigModule {
  private readonly logger = new Logger(ConfigModule.name);

  constructor() {
    const envFile = `.env.${process.env.NODE_ENV}.local`;
    this.logger.log(`Environment file loaded: ${envFile}`);
  }
}
