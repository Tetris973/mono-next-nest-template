import { Users } from '@server/prisma/seeding/user.seed';
import request from 'supertest';
import { INestApplication } from '@nestjs/common';

/**
 * Login as user tetris with role ADMIN
 * @returns the JWT authCookie
 */
export async function loginAsTetris(app: INestApplication) {
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
export async function loginAsTestUser(app: INestApplication) {
  const loginResponse = await request(app.getHttpServer()).post('/auth/login').send({
    username: Users[Users.testUser],
    password: 'Chocolat123!',
  });

  return loginResponse.headers['set-cookie'][0];
}
