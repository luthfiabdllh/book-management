import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe, HttpStatus } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { BooksService } from './../src/books/books.service';
import { AuthGuard } from '@nestjs/passport';
import {
  MOCK_BOOK_ID,
  NON_EXISTENT_ID,
  MOCK_USER_ID,
  mockBook,
  createMockBooksService,
  mockAuthGuard,
} from './mocks/books.mock';

describe('BooksController (e2e)', () => {
  let app: INestApplication;
  let booksService: Partial<BooksService>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(BooksService)
      .useValue(createMockBooksService())
      .overrideGuard(AuthGuard('jwt'))
      .useValue(mockAuthGuard)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();
    booksService = moduleFixture.get<BooksService>(BooksService);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /books', () => {
    it('should return a list of books', () => {
      return request(app.getHttpServer())
        .get('/books')
        .expect(HttpStatus.OK)
        .expect((res) => {
          expect(res.body).toHaveProperty('data');
          expect(res.body.data).toBeInstanceOf(Array);
          expect(res.body.meta).toBeDefined();
        });
    });
  });

  describe('GET /books/:id', () => {
    it('should return a book if found', () => {
      return request(app.getHttpServer())
        .get(`/books/${MOCK_BOOK_ID}`)
        .expect(HttpStatus.OK)
        .expect((res) => {
          expect(res.body.id).toEqual(MOCK_BOOK_ID);
        });
    });

    it('should return 404 if book not found', () => {
      return request(app.getHttpServer())
        .get(`/books/${NON_EXISTENT_ID}`)
        .expect(HttpStatus.NOT_FOUND);
    });
  });

  describe('POST /books', () => {
    it('should create a new book', () => {
      const newBookDto = {
        title: 'New Book',
        author: 'New Author',
        isbn: '978-0-13-235088-4',
        published_year: 2024,
        stock: 5,
      };

      return request(app.getHttpServer())
        .post('/books')
        .send(newBookDto)
        .expect(HttpStatus.CREATED)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.title).toEqual(newBookDto.title);
        });
    });

    it('should fail with 400 if validation fails', () => {
      return request(app.getHttpServer())
        .post('/books')
        .send({ author: 'New Author' }) // Missing title
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  describe('PATCH /books/:id', () => {
    it('should update a book', () => {
      return request(app.getHttpServer())
        .patch(`/books/${MOCK_BOOK_ID}`)
        .send({ title: 'Updated Title' })
        .expect(HttpStatus.OK)
        .expect((res) => {
          expect(res.body.title).toEqual('Updated Title');
        });
    });

    it('should return 404 if updating non-existent book', () => {
      return request(app.getHttpServer())
        .patch(`/books/${NON_EXISTENT_ID}`)
        .send({ title: 'Updated Title' })
        .expect(HttpStatus.NOT_FOUND);
    });
  });

  describe('DELETE /books/:id', () => {
    it('should delete a book', () => {
      return request(app.getHttpServer())
        .delete(`/books/${MOCK_BOOK_ID}`)
        .expect(HttpStatus.OK);
    });

    it('should return 404 if deleting non-existent book', () => {
      return request(app.getHttpServer())
        .delete(`/books/${NON_EXISTENT_ID}`)
        .expect(HttpStatus.NOT_FOUND);
    });
  });
});
