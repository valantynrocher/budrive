import { AppModule } from '@/app.module';
import { SignUpDto } from '@/auth/dto/sign-up.dto';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';

describe('Auth features (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/auth/sign-up (POST) → should create a user', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/sign-up')
      .send({
        email: 'testuser@example.com',
        password: 'strongPassword123',
      })
      .expect(201);

    expect((response.body as SignUpDto).email).toBe('testuser@example.com');
  });

  it('/auth/sign-up (POST) → should not allow duplicate email', async () => {
    await request(app.getHttpServer())
      .post('/auth/sign-up')
      .send({
        email: 'testuser@example.com',
        password: 'anotherPassword',
      })
      .expect(409);
  });
});
