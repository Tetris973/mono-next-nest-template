import { Module, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '@server/modules/user/user.module';
import { LocalStrategy } from './passport/local.strategy';
import { JwtStrategy } from './passport/jwt.strategy';
import { AuthzService } from '@server/authz/authz.service';
import { customValidationPipe } from '@server/common/pipes/custom-validation.pipe';

@Module({
  imports: [UserModule],
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
