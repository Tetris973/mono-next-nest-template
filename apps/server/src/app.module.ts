import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import config from './config/configuration';
import { validate } from './config/env.validation';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    // !!! This import must be before any other !!!
    // Loads .env synchronously
    ConfigModule.forRoot({
      validate, // Validate env variables or throw error
      envFilePath: `.env.${process.env.NODE_ENV}.local`, // Path to .env file to parse
      load: [config], // Loaded env variable after parse
      isGlobal: true, // Enable use module globally without import in each module
    }),
    PrismaModule,
    AuthModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
