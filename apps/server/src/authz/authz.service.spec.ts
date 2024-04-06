import { describe, beforeEach, it, expect } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthzService } from './authz.service';
import { UserRepository } from '@server/user/user.repository';
import { PrismaService } from '@server/prisma/prisma.service';

describe('AuthzService', () => {
  let service: AuthzService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthzService, UserRepository, PrismaService],
    }).compile();

    service = module.get<AuthzService>(AuthzService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
