import { describe, beforeEach, it, expect } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { RoleService } from '@server/role/role.service';
import { PrismaService } from '@server/prisma/prisma.service';
import { RoleRepository } from '@server/role/role.repository';
import { CaslAbilityFactory } from '@server/authz/casl-ability.factory/casl-ability.factory';
import { AuthzService } from '@server/authz/authz.service';

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        UserRepository,
        RoleService,
        PrismaService,
        RoleRepository,
        CaslAbilityFactory,
        AuthzService,
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
