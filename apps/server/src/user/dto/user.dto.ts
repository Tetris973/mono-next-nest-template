import { Role, User } from '@prisma/client';
import { Expose } from 'class-transformer';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

export class UserDto implements User {
  @Expose()
  id: number;

  @Expose()
  username: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @ApiProperty({ enum: Role, isArray: true })
  @Expose()
  roles: Role[];

  @ApiHideProperty()
  password: string;
}
