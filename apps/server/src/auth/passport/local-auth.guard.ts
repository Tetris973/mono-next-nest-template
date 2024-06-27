import { Injectable, ExecutionContext, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { plainToClass } from 'class-transformer';
import { LoginUserDto } from '@server/user/dto/log-in-user.dto';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  // Injecting APP_PIPE did not work, so we inject the Validation pipe provided my auth.module
  constructor(private readonly validationPipe: ValidationPipe) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    // Transform the request body to a LogInUserDto instance and strip unknown properties
    const dto = plainToClass(LoginUserDto, request.body, {});

    // Use the global validation pipe to validate the DTO
    await this.validationPipe.transform(dto, {
      type: 'body',
      metatype: LoginUserDto,
    });

    return super.canActivate(context) as boolean | Promise<boolean>;
  }
}
