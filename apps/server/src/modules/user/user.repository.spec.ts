import { describe, it, expect, beforeEach } from 'vitest';
import { UserRepository } from './user.repository';
import { TestingModule, Test } from '@nestjs/testing';
import { PrismaService } from '@server/prisma/prisma.service';
import { ConfigModule } from '@server/config/config.module';
import { Users, seedUsers } from '@server/prisma/seeding/user.seed';
import { seedUserRoleRelations } from '@server/prisma/seeding/user-role.seed';
import { seedRoles } from '@server/prisma/seeding/production/role.seed';
import { seedResources } from '@server/prisma/seeding/resource.seed';
import { seedPermissions, Permissions } from '@server/prisma/seeding/permission.seed';
import { seedRolePermission } from '@server/prisma/seeding/role-permission.seed';
import { StaticRoles } from '@server/authz/static-roles.enum';
import { TestPrismaService } from '@testServer/common/helpers/test-prisma.service';

describe('UserRepository', () => {
  let repository: UserRepository;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [{ provide: PrismaService, useValue: TestPrismaService.getInstance() }, UserRepository],
    }).compile();

    repository = module.get<UserRepository>(UserRepository);
    prisma = module.get<PrismaService>(PrismaService);
    await seedRoles(prisma);
    await seedUsers(prisma);
    await seedUserRoleRelations(prisma);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('findOne', () => {
    it('should return a user with hidden password by default', async () => {
      const user = await repository.findOne({ id: Users.tetris });
      expect(user?.username).toBe(Users[Users.tetris]);
      expect(user?.password).toBe('password hidden');
    });

    it('should return a user with password if requested', async () => {
      const user = await repository.findOne({ id: Users.tetris }, true);
      expect(user?.username).toBe(Users[Users.tetris]);
      expect(user?.password).toBeDefined();
      expect(user?.password).not.toBe('password hidden');
    });
  });

  describe('findMany', () => {
    it('should return a list of users', async () => {
      const users = await repository.findMany({});
      expect(users.length).toBeGreaterThan(0);
    });
  });

  describe('create', () => {
    it('should create a user', async () => {
      // INIT
      const user = {
        username: 'test',
        password: 'password',
      };

      // RUN
      const createdUser = await repository.create(user);

      // CHECK RESULTS
      expect(createdUser.username).toBe(user.username);
    });

    it('should throw an error if the username is already in use', async () => {
      // INIT
      const user = {
        username: Users[Users.tetris],
        password: 'password',
      };

      // RUN
      try {
        await repository.create(user);
      } catch (error) {
        // CHECK RESULTS
        expect((error as Error).message).toBe(`username ${Users[Users.tetris]} is already in use.`);
      }
    });
  });

  describe('createWithRole', () => {
    it('should create a user with a role', async () => {
      // INIT
      const user = {
        username: 'test',
        password: 'password',
      };
      const roleId = StaticRoles.USER;

      // RUN
      const createdUser = await repository.createWithRole(user, roleId);
      const userRoles = await repository.findAllRoles(createdUser.id);

      // CHECK RESULTS
      expect(createdUser.username).toBe(user.username);
      expect(userRoles[0]?.name).toBe(StaticRoles[StaticRoles.USER]);
    });

    it('should throw an error if the role does not exist', async () => {
      // INIT
      const user = {
        username: 'test',
        password: 'password',
      };
      const roleId = 999;

      // RUN
      try {
        await repository.createWithRole(user, roleId);
      } catch (error) {
        // CHECK RESULTS
        expect((error as Error).message).toBe(`role with id ${roleId} not found`);
      }
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      // INIT
      const user = {
        id: Users.tetris,
        username: 'test',
      };

      // RUN
      const { id, ...userData } = user;
      const updatedUser = await repository.update({
        where: { id },
        data: userData,
      });

      // CHECK RESULTS
      expect(updatedUser?.username).toBe(user.username);
    });

    it('should throw an error if the user does not exist', async () => {
      // INIT
      const user = {
        id: 999,
        username: 'test',
      };

      // RUN
      try {
        const { id, ...userData } = user;
        await repository.update({
          where: { id },
          data: userData,
        });
      } catch (error) {
        // CHECK RESULTS
        expect((error as Error).message).toBe(`user with id ${user.id} not found`);
      }
    });

    it('should throw an error if the username is already in use', async () => {
      // INIT
      const user = {
        id: Users.tetris,
        username: Users[Users.victor],
      };

      // RUN
      try {
        const { id, ...userData } = user;
        await repository.update({
          where: { id },
          data: userData,
        });
      } catch (error) {
        // CHECK RESULTS
        expect((error as Error).message).toBe(`username ${Users[Users.victor]} is already in use.`);
      }
    });
  });

  describe('delete', () => {
    it('should delete a user', async () => {
      // INIT
      const user = {
        id: Users.tetris,
      };

      // RUN
      const deletedUser = await repository.delete(user);

      // CHECK RESULTS
      expect(deletedUser?.id).toBe(user.id);
    });

    it('should return null if the user does not exist', async () => {
      // INIT
      const user = {
        id: 999,
      };

      // RUN
      const deletedUser = await repository.delete(user);

      // CHECK RESULTS
      expect(deletedUser).toBeNull();
    });
  });

  describe('findAllPermissions', () => {
    beforeEach(async () => {
      await seedResources(prisma);
      await seedPermissions(prisma);
      await seedRolePermission(prisma);
    });

    it('should return a list of permissions', async () => {
      // RUN
      const permissions = await repository.findAllPermissions(Users.tetris);

      // CHECK RESULTS
      expect(permissions[0].id).toBe(Permissions.USER_MANAGE);
      expect(permissions[0].action).toBe('manage');
      expect(permissions[0].resourceName).toBe('User');
    });
  });

  describe('findAllRoles', () => {
    beforeEach(async () => {
      await seedRoles(prisma);
      await seedUserRoleRelations(prisma);
    });

    it('should return a list of roles', async () => {
      // RUN
      const roles = await repository.findAllRoles(Users.tetris);

      // CHECK RESULTS
      expect(roles[0].id).toBe(StaticRoles.ADMIN);
      expect(roles[0].name).toBe(StaticRoles[StaticRoles.ADMIN]);
    });
  });
});
