import { describe, beforeEach, it, expect, vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { RoleService } from './role.service';
import { RoleRepository } from './role.repository';

describe('RoleService', () => {
  let service: RoleService;
  const mockRoleRepository = {
    findOne: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoleService],
    })
      .useMocker((token) => {
        if (token === RoleRepository) {
          return mockRoleRepository;
        }
      })
      .compile();

    service = module.get<RoleService>(RoleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should call findOne on the RoleRepository', async () => {
      // INIT
      const roleId = { id: 1 };

      // RUN
      await service.findOne(roleId);

      // CHECK RESULTS
      expect(mockRoleRepository.findOne).toHaveBeenCalledWith(roleId);
    });
  });
});
