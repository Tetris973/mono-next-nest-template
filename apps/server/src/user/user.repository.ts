import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User } from '@prisma/client';

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}

  async findOne(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
    showPassword: boolean = false,
  ): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: userWhereUniqueInput,
    });
    if (!showPassword && user) {
      user.password = 'password hidden';
    }
    return user;
  }

  async findMany(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    const { skip, take, cursor, where, orderBy } = params;
    const users = await this.prisma.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
    if (users) {
      users.map((user) => {
        user.password = 'password hidden';
      });
    }
    return users;
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    try {
      return await this.prisma.user.create({ data });
    } catch (error) {
      if (!(error instanceof Prisma.PrismaClientKnownRequestError)) {
        throw error;
      }

      switch (error.code) {
        case 'P2002':
          const field = Array.isArray(error.meta?.target)
            ? error.meta.target.join(', ')
            : '';
          throw new Error(
            `${field} ${data[field as keyof typeof data]} is already in use.`,
          );

        default:
          throw error;
      }
    }
  }

  async createWithRole(
    data: Prisma.UserCreateInput,
    roleId: Prisma.RoleWhereUniqueInput['id'],
  ): Promise<User> {
    try {
      return await this.create({
        ...data,
        userRoles: {
          create: {
            role: {
              connect: {
                id: roleId,
              },
            },
          },
        },
      });
    } catch (error) {
      if (!(error instanceof Prisma.PrismaClientKnownRequestError)) {
        throw error;
      }

      switch (error.code) {
        case 'P2025':
          throw new Error(
            `The role with ID ${roleId} does not exist when creating user.`,
          );

        default:
          throw error;
      }
    }
  }

  /**
   * @returns Updated user or null if the user was not found
   * @throws Error if the user to update was not found or if the unique constraint was violated
   */
  async update(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User | null> {
    const { where, data } = params;

    try {
      return await this.prisma.user.update({ where, data });
    } catch (error) {
      if (!(error instanceof Prisma.PrismaClientKnownRequestError)) {
        throw error;
      }

      switch (error.code) {
        // Handle "Record to update not found" case
        case 'P2025':
          throw new Error('The user to update was not found.');

        // Handle unique constraint violation
        case 'P2002':
          const field = Array.isArray(error.meta?.target)
            ? error.meta.target.join(', ')
            : '';
          throw new Error(
            `${field} ${data[field as keyof typeof data]} is already in use.`,
          );

        default:
          throw error;
      }
    }
  }

  /**
   * @returns Deleted user or null if the user was not found
   */
  async delete(where: Prisma.UserWhereUniqueInput): Promise<User | null> {
    try {
      return await this.prisma.user.delete({ where });
    } catch (error) {
      if (!(error instanceof Prisma.PrismaClientKnownRequestError)) {
        throw error;
      }

      switch (error.code) {
        // Record to delete not found
        case 'P2025':
          return null;

        default:
          throw error;
      }
    }
  }

  async findAllPermissions(userId: number) {
    const perimissions = await this.prisma.$kysely
      .selectFrom(['Permission as p'])
      .innerJoin('RolePermission as rp', 'rp.permissionId', 'p.id')
      .innerJoin('Role as r', 'rp.roleId', 'r.id')
      .innerJoin('UserRole as ur', 'r.id', 'ur.roleId')
      .innerJoin('User as u', 'ur.userId', 'u.id')
      .innerJoin('Resource as res', 'p.resourceId', 'res.id')
      .select([
        'p.id',
        'p.action',
        'p.condition',
        'p.resourceId',
        'res.name as resourceName',
      ])
      .distinctOn('p.id')
      .where('u.id', '=', userId)
      .execute();
    return perimissions;
  }

  async findAllRoles(userId: number) {
    const roles = await this.prisma.$kysely
      .selectFrom(['Role as r'])
      .innerJoin('UserRole as ur', 'r.id', 'ur.roleId')
      .innerJoin('User as u', 'ur.userId', 'u.id')
      .select(['r.id', 'r.name'])
      .distinctOn('r.id')
      .where('u.id', '=', userId)
      .execute();

    return roles;
  }
}
