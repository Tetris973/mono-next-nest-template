import { Module, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '@server/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LocalStrategy } from './passport/local.strategy';
import { JwtStrategy } from './passport/jwt.strategy';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './passport/jwt-auth.guard';
import { AuthzService } from '@server/authz/authz.service';
import { customValidationPipe } from '@server/custom-validation.pipe';

@Module({
  imports: [
    UserModule,
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '3600s' },
      }),
    }),
  ],
  providers: [
    AuthService,
    AuthzService,
    {
      // TODO: Maybe move this to the app module ?
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    } /* Bind the JwtAuth Guard globaly so all endpoint are protected by default */,
    LocalStrategy,
    JwtStrategy,
    {
      // Provide a custom validation pipe for at least LocalAuthGuard
      // The global APP_PIPE was not working for LocalAuthGuard
      provide: ValidationPipe,
      useValue: customValidationPipe,
    },
  ],
  controllers: [AuthController],
})
export class AuthModule {}
