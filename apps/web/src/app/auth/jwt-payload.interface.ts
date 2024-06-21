import { Role } from '@web/app/auth/role.interface';

export interface IJwtPayload {
  sub: number;
  roles: Role[];
}
