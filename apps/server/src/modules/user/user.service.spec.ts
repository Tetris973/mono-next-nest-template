import { describe, beforeEach, it, expect, vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { RoleService } from '@server/modules/role/role.service';
import { Prisma } from '@prisma/client';
import { StaticRoles } from '@server/authz/static-roles.enum';

describe('UserService', () => {
  let service: UserService;

  const mockedUserRepository = {
    findOne: vi.fn(),
    findMany: vi.fn(),
    createWithRole: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  };

  const mockedRoleRepository = {
    findOne: vi.fn().mockResolvedValue({ id: 1 }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService],
    })
      .useMocker((token) => {
        if (token === RoleService) {
          return mockedRoleRepository;
        }
        if (token === UserRepository) {
          return mockedUserRepository;
        }
      })
      .compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should call findOne method of UserRepository', async () => {
      // INIT
      const user = { id: 1 };

      // RUN
      await service.findOne(user);

      // CHECK RESULTS
      expect(mockedUserRepository.findOne).toHaveBeenCalledWith(user);
    });
  });

  describe('userCredentials', () => {
    it('shoud call findOne method of UserRepository with true', async () => {
      // INIT
      const user = { id: 1 };

      // RUN
      await service.userCredentials(user);

      // CHECK RESULTS
      expect(mockedUserRepository.findOne).toHaveBeenCalledWith(user, true);
    });
  });

  describe('findMany', () => {
    it('should call findMany method of UserRepository', async () => {
      // INIT
      const params = { where: { id: 1 } };

      // RUN
      await service.findMany(params);

      // CHECK RESULTS
      expect(mockedUserRepository.findMany).toHaveBeenCalledWith(params);
    });
  });

  describe('create', () => {
    it('should call createWithRole method of UserRepository', async () => {
      // INIT
      const data: Prisma.UserCreateInput = {
        username: 'test',
        password: 'pass',
      };

      // RUN
      await service.create(data);

      // CHECK RESULTS
      expect(mockedRoleRepository.findOne).toHaveBeenCalledWith({
        name: StaticRoles[StaticRoles.USER],
      });
      expect(mockedUserRepository.createWithRole).toHaveBeenCalledWith(data, StaticRoles.USER);
    });

    it('should throw an error if default role is not found', async () => {
      // INIT
      mockedRoleRepository.findOne.mockResolvedValue(null);
      const data: Prisma.UserCreateInput = {
        username: 'test',
        password: 'pass',
      };

      // RUN & CHECK RESULTS
      await expect(service.create(data)).rejects.toThrow('Unexpected Error: Basic Role USER not found');
    });
  });

  describe('update', () => {
    it('should call update method of UserRepository', async () => {
      // INIT
      const params = { where: { id: 1 }, data: { username: 'test' } };

      // RUN
      await service.update(params);

      // CHECK RESULTS
      expect(mockedUserRepository.update).toHaveBeenCalledWith(params);
    });
  });

  describe('delete', () => {
    it('should call delete method of UserRepository', async () => {
      // INIT
      const where = { id: 1 };

      // RUN
      await service.delete(where);

      // CHECK RESULTS
      expect(mockedUserRepository.delete).toHaveBeenCalledWith(where);
    });
  });
});
