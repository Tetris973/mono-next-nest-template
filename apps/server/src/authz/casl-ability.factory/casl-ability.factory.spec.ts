import { describe, beforeEach, it, expect } from 'vitest';
import { CaslAbilityFactory } from './casl-ability.factory';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthzService } from '../authz.service';
import { UserRepository } from '@server/user/user.repository';
import { PrismaService } from '@server/prisma/prisma.service';

describe('CaslAbilityFactory', () => {
  let casl: CaslAbilityFactory;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CaslAbilityFactory,
        AuthzService,
        UserRepository,
        PrismaService,
      ],
    }).compile();

    casl = module.get<CaslAbilityFactory>(CaslAbilityFactory);
  });

  it('should be defined', () => {
    expect(casl).toBeDefined();
  });
});
