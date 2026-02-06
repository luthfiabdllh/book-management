import { Test, TestingModule } from '@nestjs/testing';
import { BooksService } from './books.service';
import { PrismaService } from '../prisma/prisma.service';

const mockPrismaService = {
  book: {
    findMany: jest.fn(),
    count: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  $transaction: jest.fn((promises) => Promise.all(promises)),
};

describe('BooksService', () => {
  let service: BooksService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<BooksService>(BooksService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated books', async () => {
      const mockBooks = [{ id: '1', title: 'Test Book' }];
      const mockCount = 1;

      (prisma.book.findMany as jest.Mock).mockResolvedValue(mockBooks);
      (prisma.book.count as jest.Mock).mockResolvedValue(mockCount);
      // Mock transaction return
      (prisma.$transaction as jest.Mock).mockResolvedValue([mockBooks, mockCount]);

      const result = await service.findAll(1, 10);
      expect(result).toEqual({
        data: mockBooks,
        meta: { total: 1, page: 1, last_page: 1 },
      });
    });
  });
});
