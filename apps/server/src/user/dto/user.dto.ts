import { User } from '@prisma/client';
import { Expose } from 'class-transformer';
import { ApiHideProperty } from '@nestjs/swagger';

export class UserDto implements User {
  @Expose()
  id: number;

  @Expose()
  username: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @ApiHideProperty()
  password: string;
}
