import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthzModule } from './authz/authz.module';
import { RoleModule } from './role/role.module';
import { ConfigModule } from './config/config.module';
import { APP_INTERCEPTOR, APP_PIPE, Reflector } from '@nestjs/core';
import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';

@Module({
  imports: [
    // !!! This import must be before any other !!!
    ConfigModule, // Custom config modul
    PrismaModule,
    AuthModule,
    UserModule,
    AuthzModule,
    RoleModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      // Set validation for all incoming request using a DTO with class-validator
      useValue: new ValidationPipe({
        // Strip unknown properties from the request body
        whitelist: true,
        // Transform the request body to the DTO instance
        transform: true,
      }),
    },
    {
      provide: APP_INTERCEPTOR,
      // Set serialization for all outgoing response DTO
      // Returned object from controller that is not transformed to DTO will be transformer to {}
      useFactory: (reflector: Reflector) =>
        new ClassSerializerInterceptor(reflector, {
          strategy: 'excludeAll', // All DTO properties must be explicitly included otherwise it will be excluded
          excludeExtraneousValues: true, // Remove properties that are not in the DTO
        }),
      // This tells NestJS to inject the Reflector service into the factory
      inject: [Reflector],
    },
  ],
})
export class AppModule {}
