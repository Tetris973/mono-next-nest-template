import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User } from '@prisma/client';

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}

  async findOne(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
    password: boolean = false,
  ): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: userWhereUniqueInput,
    });
    if (!password && user) {
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
    return this.prisma.user.create({ data });
  }

  async createWithRole(
    data: Prisma.UserCreateInput,
    roleId: Prisma.RoleWhereUniqueInput['id'],
  ): Promise<User> {
    return this.prisma.user.create({
      data: {
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
      },
    });
  }

  async update(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    const { where, data } = params;
    return this.prisma.user.update({ where, data });
  }

  async delete(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prisma.user.delete({
      where,
    });
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
