import { describe, it, expect, beforeEach } from 'vitest';
import { TestingModule, Test } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigModule } from '@server/config/config.module';
import { seedRoles } from '@server/prisma/seeding/role.seed';
import { BaseRoles } from '@server/authz/baseRoles.enum';
import { RoleRepository } from './role.repository';
import { TestPrismaService } from '@testServer/utils/testPrisma.service';

describe('RoleRepository', () => {
  let repository: RoleRepository;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [RoleRepository, { provide: PrismaService, useValue: TestPrismaService.getInstance() }],
    }).compile();

    repository = module.get<RoleRepository>(RoleRepository);
    prisma = module.get<PrismaService>(PrismaService);

    await seedRoles(prisma);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('findOne', () => {
    it('should return a role', async () => {
      const role = await repository.findOne({ id: BaseRoles.ADMIN });
      expect(role?.name).toBe(BaseRoles[BaseRoles.ADMIN]);
    });
  });
});
