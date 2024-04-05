import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { UserRepository } from './user.repository';
import { RoleService } from '@server/role/role.service';
import { BaseRoles } from '@server/authz/baseRoles.enum';

@Injectable()
export class UserService {
  constructor(
    private repository: UserRepository,
    private roleService: RoleService,
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
    const role = await this.roleService.findOne({
      name: BaseRoles[BaseRoles.USER],
    });
    if (!role) {
      throw new Error('Unexpected Error: Basic Role USER not found');
    }
    return this.repository.createWithRole(data, role.id);
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
