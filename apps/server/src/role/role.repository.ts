import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Role } from '@prisma/client';

@Injectable()
export class RoleRepository {
  constructor(private prisma: PrismaService) {}

  async findOne(roleWhereUniqueInput: Prisma.RoleWhereUniqueInput): Promise<Role | null> {
    const role = await this.prisma.role.findUnique({
      where: roleWhereUniqueInput,
    });
    return role;
  }
}
