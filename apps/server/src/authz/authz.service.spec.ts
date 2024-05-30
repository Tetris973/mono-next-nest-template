import { describe, beforeEach, it, expect, vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthzService } from './authz.service';
import { UserRepository } from '@server/user/user.repository';
import { User } from '@prisma/client';

describe('AuthzService', () => {
  let service: AuthzService;

  const mockUserRepository = {
    findAllPermissions: vi.fn(),
    findAllRoles: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthzService],
    })
      .useMocker((token) => {
        if (token === UserRepository) {
          return mockUserRepository;
        }
      })
      .compile();

    service = module.get<AuthzService>(AuthzService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAllPermissionsOfUser', () => {
    it('should call findAllPermissions of UserRepository', async () => {
      // INIT
      const user = { id: 1 } as User;

      // RUN
      await service.findAllPermissionsOfUser(user);

      // CHECK RESULTS
      expect(mockUserRepository.findAllPermissions).toHaveBeenCalledWith(user.id);
    });
  });

  describe('findAllRolesOfUser', () => {
    it('should call findAllRoles of UserRepository', async () => {
      // INIT
      const user = { id: 1 } as User;

      // RUN
      await service.findAllRolesOfUser(user);

      // CHECK RESULTS
      expect(mockUserRepository.findAllRoles).toHaveBeenCalledWith(user.id);
    });
  });
});
