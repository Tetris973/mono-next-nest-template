import { Role } from '@web/app/auth/profile/role.interface';

export interface IJwtPayload {
  sub: number;
  roles: Role[];
}
