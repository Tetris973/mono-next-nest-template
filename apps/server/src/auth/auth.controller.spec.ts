import { describe, beforeEach, expect, it } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserService } from '@server/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '@server/user/user.repository';
import { RoleService } from '@server/role/role.service';
import { PrismaService } from '@server/prisma/prisma.service';
import { RoleRepository } from '@server/role/role.repository';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        UserService,
        JwtService,
        UserRepository,
        RoleService,
        PrismaService,
        RoleRepository,
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
