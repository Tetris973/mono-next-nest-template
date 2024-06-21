import { User } from '@prisma/client';
import { Expose } from 'class-transformer';
import { ApiHideProperty } from '@nestjs/swagger';

export class UserDto implements User {
  @Expose()
  readonly id!: number;

  @Expose()
  readonly username!: string;

  @Expose()
  readonly createdAt!: Date;

  @Expose()
  readonly updatedAt!: Date;

  @ApiHideProperty()
  readonly password!: string;
}
