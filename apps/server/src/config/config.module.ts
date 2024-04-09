// src/config/config.module.ts
import { Module } from '@nestjs/common';
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
  exports: [NestConfigModule], // Exporting ConfigModule for reusability
})
export class ConfigModule {}
