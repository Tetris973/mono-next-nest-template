import { describe, beforeEach, it } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { CreateUserDto } from '@server/user/dto/create-user.dto';
import { seedRoles } from '@server/prisma/seeding/role.seed';
import { PrismaService } from '@server/prisma/prisma.service';
import { TestPrismaService } from './testPrisma.service';
import { LogInUserDto } from '@server/user/dto/log-in-user.dto';

describe('AuthController (e2e)', () => {
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

    await app.init();
  });

  describe('/auth/profile (GET)', () => {
    it('should return 401 if no token is provided', async () => {
      // RUN & CHECK RESULT
      await request(app.getHttpServer()).get('/auth/profile').expect(HttpStatus.UNAUTHORIZED);
    });

    it('should return 401 if an invalid token is provided', async () => {
      // RUN & CHECK RESULT
      await request(app.getHttpServer())
        .get('/auth/profile')
        .set('Authorization', 'Bearer invalidToken')
        .expect(HttpStatus.UNAUTHORIZED);
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

      const loginUserDto: LogInUserDto = {
        username: createUserDto.username,
        password: createUserDto.password,
      };

      // RUN & CHECK RESULT
      await request(app.getHttpServer()).post('/auth/signup').send(createUserDto).expect(HttpStatus.CREATED);

      // RUN & CHECK RESULT
      const loginRes = await request(app.getHttpServer()).post('/auth/login').send(loginUserDto).expect(HttpStatus.OK);

      // RUN & CHECK RESULT
      await request(app.getHttpServer())
        .get('/auth/profile')
        .set('Authorization', `Bearer ${loginRes.body.accessToken}`)
        .expect(HttpStatus.OK);
    });
  });
});
