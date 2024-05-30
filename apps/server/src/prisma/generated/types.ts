import type { ColumnType } from 'kysely';
export type Generated<T> =
  T extends ColumnType<infer S, infer I, infer U> ? ColumnType<S, I | undefined, U> : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export const Action = {
  manage: 'manage',
  CREATE: 'CREATE',
  READ: 'READ',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
} as const;
export type Action = (typeof Action)[keyof typeof Action];
export type Permission = {
  id: Generated<number>;
  action: Action;
  resourceId: number;
  condition: unknown | null;
};
export type Resource = {
  id: Generated<number>;
  name: string;
};
export type Role = {
  id: Generated<number>;
  name: string;
};
export type RolePermission = {
  id: Generated<number>;
  roleId: number;
  permissionId: number;
};
export type User = {
  id: Generated<number>;
  username: string;
  password: string;
  createdAt: Generated<Timestamp>;
  updatedAt: Timestamp;
};
export type UserRole = {
  id: Generated<number>;
  userId: number;
  roleId: number;
};
export type DB = {
  Permission: Permission;
  Resource: Resource;
  Role: Role;
  RolePermission: RolePermission;
  User: User;
  UserRole: UserRole;
};
