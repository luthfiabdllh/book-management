import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('BooksController (e2e)', () => {
  let app: INestApplication;
  let jwtToken: string;

  beforeAll(async () => {
    // NOTE: In a real scenario, we would use a test database or mock the AuthGuard globally.
    // For this implementation verification, we will mock the behavior if possible or rely on the environment.
    // Since we don't have a real DB/Supabase connection in this environment, this test acts as a template
    // complying with the PRD requirements.
    
    // However, to make it passable in a CI/CD without secrets, we often mock the AuthGuard.
    // But PRD asks to test "Auth Fail" explicitly.

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();
    
    // In a real test, we would sign a token manually if we had the secret, or request one.
    // jwtToken = 'Bearer ...'; 
  });

  afterAll(async () => {
    await app.close();
  });

  it('/books (POST) - Fail without Auth', () => {
    return request(app.getHttpServer())
      .post('/books')
      .send({ title: 'New Book', author: 'Author' })
      .expect(401);
  });

  it('/books (GET) - Success public endpoint', () => {
    return request(app.getHttpServer())
      .get('/books')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('data');
        expect(res.body).toHaveProperty('meta');
      });
  });
});
