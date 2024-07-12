import { Module, ClassSerializerInterceptor, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthzModule } from './authz/authz.module';
import { RoleModule } from './role/role.module';
import { ConfigModule } from './config/config.module';
import { APP_INTERCEPTOR, APP_PIPE, Reflector, APP_FILTER } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { AllExceptionsFilter } from './all-exceptions.filter';
import { customValidationPipe } from './custom-validation.pipe';
import { PinoLoggerModule } from './pino-logger.module';
import { LoggerErrorInterceptor } from 'nestjs-pino';

@Module({
  imports: [
    // !!! This import must be before any other !!!
    ConfigModule, // Custom config module
    PrismaModule,
    AuthModule,
    UserModule,
    AuthzModule,
    RoleModule,
    PinoLoggerModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      // Set validation for all incoming request using a DTO with class-validator
      useValue: customValidationPipe,
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
    {
      // Enable auto loggin of server errors in Tests
      provide: APP_INTERCEPTOR,
      useClass: LoggerErrorInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cookieParser()).forRoutes('*');
  }
}
