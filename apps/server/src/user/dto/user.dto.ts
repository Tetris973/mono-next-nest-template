import { OmitType } from '@nestjs/swagger';
import { FullUserDto } from './full-user.dto';

export class UserDto extends OmitType(FullUserDto, ['password'] as const) {}
