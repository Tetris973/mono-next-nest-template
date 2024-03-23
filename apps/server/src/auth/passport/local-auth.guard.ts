import {
  Injectable,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { LogInUserDto } from '@server/user/dto/log-in-user.dto';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    // Transform the request body to a LogInUserDto instance and strip unknown properties
    const dto = plainToClass(LogInUserDto, request.body, {});
    const errors = await validate(dto);

    // If there are validation errors, throw a BadRequestException with the validation messages
    if (errors.length > 0) {
      const errorMessages = errors.flatMap((error) =>
        Object.values(error.constraints || {}),
      );
      throw new BadRequestException(errorMessages);
    }

    return super.canActivate(context) as boolean | Promise<boolean>;
  }
}
