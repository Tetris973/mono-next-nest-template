import { describe, beforeEach, it, expect } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '@server/user/user.repository';
import { RoleService } from '@server/role/role.service';
import { PrismaService } from '@server/prisma/prisma.service';
import { RoleRepository } from '@server/role/role.repository';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
