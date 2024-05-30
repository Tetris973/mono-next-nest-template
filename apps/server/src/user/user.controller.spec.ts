import { describe, beforeEach, it, expect, vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CaslAbilityFactory } from '@server/authz/casl-ability.factory/casl-ability.factory';
import { AuthzService } from '@server/authz/authz.service';
import { UserDto } from './dto/user.dto';
import { User } from '@prisma/client';
import { UpdateUserDto } from './dto/update-user.dto';
import { HttpStatus } from '@nestjs/common';

describe('UserController', () => {
  let controller: UserController;

  const mockedUserService = {
    findMany: vi.fn(),
    findOne: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  };

  const mockedAuthzService = {
    findAllPermissionsOfUser: vi.fn(),
    findAllRolesOfUser: vi.fn(),
  };

  const mockedCaslAbilityFactory = {
    createForUser: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        { provide: UserService, useValue: mockedUserService },
        { provide: AuthzService, useValue: mockedAuthzService },
        { provide: CaslAbilityFactory, useValue: mockedCaslAbilityFactory },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return a list of transformed UserDto objects', async () => {
      // INIT
      const users = [
        { id: 1, username: 'test1' },
        { id: 2, username: 'test2' },
      ];
      mockedUserService.findMany.mockResolvedValue(users);

      // RUN
      const result = await controller.findAll();

      // CHECK RESULT
      expect(mockedUserService.findMany).toHaveBeenCalled();
      expect(result).toHaveLength(2);
      expect(result[0]).toBeInstanceOf(UserDto);
      expect(result[1]).toBeInstanceOf(UserDto);
    });
  });

  describe('findOne', () => {
    it('should return a transformed UserDto object on successful find', async () => {
      // INIT
      const user = { id: 1, username: 'test' };
      mockedUserService.findOne.mockResolvedValue(user);

      // RUN
      const result = await controller.findOne('1');

      // CHECK RESULT
      expect(mockedUserService.findOne).toHaveBeenCalledWith({ id: 1 });
      expect(result).toBeInstanceOf(UserDto);
    });

    it('should throw an error when user is not found', async () => {
      // INIT
      mockedUserService.findOne.mockResolvedValue(null);

      // RUN
      const result = controller.findOne('1');

      // CHECK RESULT
      await expect(result).rejects.toThrow('User not found');
      await expect(result).rejects.toHaveProperty('status', HttpStatus.NOT_FOUND);
    });
  });

  describe('update', () => {
    it('should return a transformed UserDto object on successful update', async () => {
      // INIT
      const updateUserDto: UpdateUserDto = { username: 'test' };
      const user = { id: 1, username: 'test' } as User;
      mockedUserService.update.mockResolvedValue(user);

      // User has access to the ressource
      mockedCaslAbilityFactory.createForUser.mockResolvedValue({
        can: () => true,
      });

      // RUN
      const result = await controller.update('1', updateUserDto, user);

      // CHECK RESULT
      expect(mockedUserService.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updateUserDto,
      });
      expect(result).toBeInstanceOf(UserDto);
      expect(result).toEqual(user);
    });

    it('should throw an error when user has no access to the ressource', async () => {
      // INIT
      const updateUserDto: UpdateUserDto = { username: 'test' };
      const user = { id: 1, username: 'test' } as User;
      mockedUserService.update.mockResolvedValue(user);

      // User has no access to the ressource
      mockedCaslAbilityFactory.createForUser.mockResolvedValue({
        can: () => false,
      });

      // RUN
      const result = controller.update('1', updateUserDto, user);

      // CHECK RESULT
      await expect(result).rejects.toThrow('Unauthorized');
      await expect(result).rejects.toHaveProperty('status', HttpStatus.FORBIDDEN);
    });
  });

  describe('delete', () => {
    it('should delete the user', () => {
      // RUN
      controller.remove('1');

      // CHECK RESULT
      expect(mockedUserService.delete).toHaveBeenCalledWith({ id: 1 });
    });
  });
});
