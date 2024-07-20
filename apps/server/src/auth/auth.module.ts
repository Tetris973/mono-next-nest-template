import { Module, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '@server/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LocalStrategy } from './passport/local.strategy';
import { JwtStrategy } from './passport/jwt.strategy';
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
