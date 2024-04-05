import { Injectable } from '@nestjs/common';
import { RoleRepository } from './role.repository';
import { Role, Prisma } from '@prisma/client';

@Injectable()
export class RoleService {
  constructor(private roleRepository: RoleRepository) {}

  async findOne(
    roleWhereUniqueInput: Prisma.RoleWhereUniqueInput,
  ): Promise<Role | null> {
    return this.roleRepository.findOne(roleWhereUniqueInput);
  }
}
