import { describe, beforeAll, beforeEach, it } from 'vitest';
import request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import { AppModule } from '@server/app.module';
import { seedRoles } from '@server/prisma/seeding/production/role.seed';
import { PrismaService } from '@server/prisma/prisma.service';
import { TestPrismaService } from './utils/testPrisma.service';
import { Users, seedUsers } from '@server/prisma/seeding/user.seed';
import { seedUserRoleRelations } from '@server/prisma/seeding/user-role.seed';
import { loginAsTetris, loginAsTestUser } from './utils/login-as.utils';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [{ provide: PrismaService, useValue: TestPrismaService.getInstance() }],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get<PrismaService>(PrismaService);

    await app.init();
  });

  beforeEach(async () => {
    await seedRoles(prisma);
    await seedUsers(prisma);
    await seedUserRoleRelations(prisma);
  });

  describe('/users (GET)', () => {
    it('should return OK for all logged user', async () => {
      // INIT
      const authCookie = await loginAsTestUser(app);

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
      const authCookie = await loginAsTestUser(app);

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
      const authCookie = await loginAsTestUser(app);

      // RUN & CHECK RESULT
      await request(app.getHttpServer())
        .patch(`/users/${Users.testUser}`)
        .send({ username: 'newUsername' })
        .set('Cookie', authCookie)
        .expect(HttpStatus.OK);
    });

    it('should return OK when the user is an admin and patch another user', async () => {
      // INIT
      const authCookie = await loginAsTetris(app);

      // RUN & CHECK RESULT
      await request(app.getHttpServer())
        .patch(`/users/${Users.testUser}`)
        .send({ username: 'newUsername' })
        .set('Cookie', authCookie)
        .expect(HttpStatus.OK);
    });

    it('should return Forbidden when the user patch another user', async () => {
      // INIT
      const authCookie = await loginAsTestUser(app);

      // RUN & CHECK RESULT
      await request(app.getHttpServer())
        .patch(`/users/${Users.tetris}`)
        .send({ username: 'newUsername' })
        .set('Cookie', authCookie)
        .expect(HttpStatus.FORBIDDEN);
    });

    it('should return Conflict when the username already exists', async () => {
      // INIT
      const authCookie = await loginAsTestUser(app);

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
      const authCookie = await loginAsTetris(app);

      // RUN & CHECK RESULT
      await request(app.getHttpServer())
        .delete(`/users/${Users.testUser}`)
        .set('Cookie', authCookie)
        .expect(HttpStatus.NO_CONTENT);
    });

    it('should return No_Content when the admin delete itself', async () => {
      // INIT
      const authCookie = await loginAsTetris(app);

      // RUN & CHECK RESULT
      await request(app.getHttpServer())
        .delete(`/users/${Users.tetris}`)
        .set('Cookie', authCookie)
        .expect(HttpStatus.NO_CONTENT);
    });

    it('should return Forbidden when the user delete itself', async () => {
      // INIT
      const authCookie = await loginAsTestUser(app);

      // RUN & CHECK RESULT
      await request(app.getHttpServer())
        .delete(`/users/${Users.testUser}`)
        .set('Cookie', authCookie)
        .expect(HttpStatus.FORBIDDEN);
    });

    it('should return Forbidden when the user delete another user', async () => {
      // INIT
      const authCookie = await loginAsTestUser(app);

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

    it('should return Bad Request when param is not a number', async () => {
      // INIT
      const authCookie = await loginAsTetris(app);

      // RUN & CHECK RESULT
      await request(app.getHttpServer())
        .delete('/users/not-a-number')
        .set('Cookie', authCookie)
        .expect(HttpStatus.BAD_REQUEST);
    });
  });
});
