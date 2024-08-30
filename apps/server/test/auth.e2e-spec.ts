import { describe, beforeAll, beforeEach, it, expect } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '@server/app.module';
import { CreateUserDto } from '@server/modules/user/dto/create-user.dto';
import { seedRoles } from '@server/prisma/seeding/production/role.seed';
import { PrismaService } from '@server/prisma/prisma.service';
import { TestPrismaService } from './common/helpers/test-prisma.service';
import { LoginUserDto } from '@server/modules/user/dto/log-in-user.dto';
import { ConfigService } from '@nestjs/config';
import { loginAsTetris, loginAsTestUser } from './common/helpers/login-as.helpers';
import { Users, seedUsers } from '@server/prisma/seeding/user.seed';
import { seedUserRoleRelations } from '@server/prisma/seeding/user-role.seed';
import ms from 'ms';

describe('AuthController (e2e)', () => {
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
  });

  describe('/auth/profile (GET)', () => {
    it('should return 401 if no cookie token is provided', async () => {
      // RUN & CHECK RESULT
      await request(app.getHttpServer()).get('/auth/profile').expect(HttpStatus.UNAUTHORIZED);
    });

    it('should return 401 if an invalid cookie token is provided', async () => {
      // RUN & CHECK RESULT
      await request(app.getHttpServer())
        .get('/auth/profile')
        .set('Cookie', ['Authentication=invalid'])
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('/auth/signup (POST)', () => {
    it('should return 409 if username is already in use', async () => {
      // INIT
      const createUserDto: CreateUserDto = {
        username: 'testUser',
        password: 'Chocolat123!',
        confirmPassword: 'Chocolat123!',
      };
      await request(app.getHttpServer()).post('/auth/signup').send(createUserDto);

      // RUN & CHECK RESULT
      await request(app.getHttpServer()).post('/auth/signup').send(createUserDto).expect(HttpStatus.CONFLICT);
    });
  });

  describe('signup, login and profile', () => {
    it('should create a user, login and get the profile', async () => {
      // INIT
      const createUserDto: CreateUserDto = {
        username: 'newUser1234',
        password: 'Chocolat1234!',
        confirmPassword: 'Chocolat1234!',
      };

      const loginUserDto: LoginUserDto = {
        username: createUserDto.username,
        password: createUserDto.password,
      };

      // RUN & CHECK RESULT
      await request(app.getHttpServer()).post('/auth/signup').send(createUserDto).expect(HttpStatus.CREATED);

      // RUN & CHECK RESULT
      const loginRes = await request(app.getHttpServer()).post('/auth/login').send(loginUserDto).expect(HttpStatus.OK);

      // CHECK auth cookie attributes
      const cookie = loginRes.headers['set-cookie'][0];
      expect(cookie).toContain('Authentication=');
      expect(cookie).toContain('HttpOnly; Secure');

      const expiresMatch = cookie.match(/Expires=([^;]+)/);
      const cookieExpirationDate = new Date(expiresMatch![1]).getTime();
      expect(cookie.match(/Expires=([^;]+)/)).not.toBeNull();

      const jwtExpiration = app.get(ConfigService).getOrThrow<string>('JWT_EXPIRATION');
      const jwtExpirationTime = ms(jwtExpiration);
      const expirationTimeFromNow = new Date(Date.now() + jwtExpirationTime).getTime();
      expect(cookieExpirationDate).toBeLessThanOrEqual(expirationTimeFromNow);

      // RUN & CHECK RESULT
      await request(app.getHttpServer()).get('/auth/profile').set('Cookie', cookie).expect(HttpStatus.OK);
    });
  });

  describe('Manage valid token with deleted user', () => {
    it('should return Unauthorized if the user has been deleted, and appropriate message', async () => {
      // INIT
      await seedUsers(prisma);
      await seedUserRoleRelations(prisma);

      const adminAuthCookie = await loginAsTetris(app);
      const userAuthCookie = await loginAsTestUser(app);

      // Delete the user
      await request(app.getHttpServer())
        .delete(`/users/${Users.testUser}`)
        .set('Cookie', adminAuthCookie)
        .expect(HttpStatus.NO_CONTENT);

      // RUN & CHECK RESULT
      const result = await request(app.getHttpServer())
        .get('/auth/profile')
        .set('Cookie', userAuthCookie)
        .expect(HttpStatus.UNAUTHORIZED);

      // CHECK RESULT
      expect(result.body.message).toBe('User not found during JWT validation');
    });
  });
});
