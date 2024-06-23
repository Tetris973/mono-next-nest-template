import { Role } from '@web/app/auth/role.enum';

export interface IJwtPayload {
  sub: number;
  roles: Role[];
}
