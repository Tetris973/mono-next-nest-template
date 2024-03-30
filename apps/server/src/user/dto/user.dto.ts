import { Role, User } from '@prisma/client';
import { Expose } from 'class-transformer';

export class UserDto implements User {
  @Expose()
  id: number;

  @Expose()
  username: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  roles: Role[];

  password: string;
}
