import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Role } from '@prisma/client';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private repository: UserRepository,
  ) {}

  async findOne(userWhereUniqueInput: Prisma.UserWhereUniqueInput) {
    return this.repository.findOne(userWhereUniqueInput);
  }

  async userCredentials(userWhereUniqueInput: Prisma.UserWhereUniqueInput) {
    return this.repository.findOne(userWhereUniqueInput, true);
  }

  async findMany(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }) {
    return this.repository.findMany(params);
  }

  async create(data: Prisma.UserCreateInput) {
    return this.repository.create({ ...data, roles: { set: [Role.USER] } });
  }

  async update(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }) {
    return this.repository.update(params);
  }

  async delete(where: Prisma.UserWhereUniqueInput) {
    return this.repository.delete(where);
  }
}
