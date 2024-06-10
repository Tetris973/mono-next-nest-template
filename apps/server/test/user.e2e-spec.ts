import { describe, beforeEach, it } from 'vitest';
import request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import { AppModule } from './../src/app.module';
import { seedRoles } from '@server/prisma/seeding/role.seed';
import { PrismaService } from '@server/prisma/prisma.service';
import { TestPrismaService } from './testPrisma.service';
import { Users, seedUsers } from '@server/prisma/seeding/user.seed';
import { seedUserRoleRelations } from '@server/prisma/seeding/user-role.seed';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [{ provide: PrismaService, useValue: TestPrismaService.getInstance() }],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get<PrismaService>(PrismaService);

    await seedRoles(prisma);
    await seedUsers(prisma);
    await seedUserRoleRelations(prisma);

    await app.init();
  });

  /**
   * Login as user tetris with role ADMIN
   * @returns the JWT authCookie
   */
  async function loginAsTetris() {
    const loginResponse = await request(app.getHttpServer()).post('/auth/login').send({
      username: Users[Users.tetris],
      password: 'Chocolat123!',
    });
    return loginResponse.headers['set-cookie'][0];
  }

  /**
   * Login as user testUser with role USER
   * @returns the JWT authCookie
   */
  async function loginAsTestUser() {
    const loginResponse = await request(app.getHttpServer()).post('/auth/login').send({
      username: Users[Users.testUser],
      password: 'Chocolat123!',
    });

    return loginResponse.headers['set-cookie'][0];
  }

  describe('/users (GET)', () => {
    it('should return OK for all logged user', async () => {
      // INIT
      const authCookie = await loginAsTestUser();

      // RUN & CHECK RESULT
      await request(app.getHttpServer()).get('/users').set('Cookie', authCookie).expect(HttpStatus.OK);
    });

    it('should return Unauthorized for all not logged user', async () => {
      // RUN & CHECK RESULT
      await request(app.getHttpServer()).get('/users').expect(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('/users/:id (GET)', () => {
    it('should return OK for all logged user', async () => {
      // INIT
      const authCookie = await loginAsTestUser();

      // RUN & CHECK RESULT
      await request(app.getHttpServer()).get('/users/1').set('Cookie', authCookie).expect(HttpStatus.OK);
    });

    it('should return Unauthorized for all not logged user', async () => {
      // RUN & CHECK RESULT
      await request(app.getHttpServer()).get('/users/1').expect(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('/users/:id (PATCH)', () => {
    it('should return OK when the user patch itself', async () => {
      // INIT
      const authCookie = await loginAsTestUser();

      // RUN & CHECK RESULT
      await request(app.getHttpServer())
        .patch(`/users/${Users.testUser}`)
        .send({ username: 'newUsername' })
        .set('Cookie', authCookie)
        .expect(HttpStatus.OK);
    });

    it('should return OK when the user is an admin and patch another user', async () => {
      // INIT
      const authCookie = await loginAsTetris();

      // RUN & CHECK RESULT
      await request(app.getHttpServer())
        .patch(`/users/${Users.testUser}`)
        .send({ username: 'newUsername' })
        .set('Cookie', authCookie)
        .expect(HttpStatus.OK);
    });

    it('should return Forbidden when the user patch another user', async () => {
      // INIT
      const authCookie = await loginAsTestUser();

      // RUN & CHECK RESULT
      await request(app.getHttpServer())
        .patch(`/users/${Users.tetris}`)
        .send({ username: 'newUsername' })
        .set('Cookie', authCookie)
        .expect(HttpStatus.FORBIDDEN);
    });

    it('should return Conflict when the username already exists', async () => {
      // INIT
      const authCookie = await loginAsTestUser();

      // RUN & CHECK RESULT
      await request(app.getHttpServer())
        .patch(`/users/${Users.testUser}`)
        .send({ username: Users[Users.tetris] })
        .set('Cookie', authCookie)
        .expect(HttpStatus.CONFLICT);
    });

    it('should return Unauthorized when the user is not logged', async () => {
      // RUN & CHECK RESULT
      await request(app.getHttpServer())
        .patch(`/users/${Users.tetris}`)
        .send({ username: 'newUsername' })
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('/users/:id (DELETE)', () => {
    it('should return No_Content when the user is an admin and delete another user', async () => {
      // INIT
      const authCookie = await loginAsTetris();

      // RUN & CHECK RESULT
      await request(app.getHttpServer())
        .delete(`/users/${Users.testUser}`)
        .set('Cookie', authCookie)
        .expect(HttpStatus.NO_CONTENT);
    });

    it('should return No_Content when the admin delete itself', async () => {
      // INIT
      const authCookie = await loginAsTetris();

      // RUN & CHECK RESULT
      await request(app.getHttpServer())
        .delete(`/users/${Users.tetris}`)
        .set('Cookie', authCookie)
        .expect(HttpStatus.NO_CONTENT);
    });

    it('should return Forbidden when the user delete itself', async () => {
      // INIT
      const authCookie = await loginAsTestUser();

      // RUN & CHECK RESULT
      await request(app.getHttpServer())
        .delete(`/users/${Users.testUser}`)
        .set('Cookie', authCookie)
        .expect(HttpStatus.FORBIDDEN);
    });

    it('should return Forbidden when the user delete another user', async () => {
      // INIT
      const authCookie = await loginAsTestUser();

      // RUN & CHECK RESULT
      await request(app.getHttpServer())
        .delete(`/users/${Users.adrien}`)
        .set('Cookie', authCookie)
        .expect(HttpStatus.FORBIDDEN);
    });

    it('should return Unauthorized when the user is not logged', async () => {
      // RUN & CHECK RESULT
      await request(app.getHttpServer()).delete(`/users/${Users.testUser}`).expect(HttpStatus.UNAUTHORIZED);
    });
  });
});
