import { NotFoundException } from '@nestjs/common';

// Mock Data Constants
export const MOCK_BOOK_ID = '123e4567-e89b-12d3-a456-426614174000';
export const NON_EXISTENT_ID = '00000000-0000-0000-0000-000000000000';
export const MOCK_USER_ID = 'user-id';

export const mockBook = {
  id: MOCK_BOOK_ID,
  title: 'Test Book',
  author: 'Test Author',
  isbn: '978-0-123456-47-2',
  published_year: 2023,
  stock: 10,
  created_at: new Date(),
  updated_at: new Date(),
  created_by: MOCK_USER_ID,
};

// Mock Service Factory
export const createMockBooksService = () => ({
  findAll: jest.fn().mockResolvedValue({
    data: [mockBook],
    meta: { total: 1, page: 1, last_page: 1 },
  }),
  findOne: jest.fn().mockImplementation((id: string) => {
    if (id === MOCK_BOOK_ID) return Promise.resolve(mockBook);
    throw new NotFoundException(`Book with ID ${id} not found`);
  }),
  create: jest.fn().mockImplementation((dto, userId) => Promise.resolve({
    id: 'new-uuid',
    ...dto,
    created_by: userId,
    created_at: new Date(),
    updated_at: new Date(),
  })),
  update: jest.fn().mockImplementation((id: string, dto) => {
    if (id === MOCK_BOOK_ID) return Promise.resolve({ ...mockBook, ...dto });
    throw new NotFoundException(`Book with ID ${id} not found`);
  }),
  remove: jest.fn().mockImplementation((id: string) => {
    if (id === MOCK_BOOK_ID) return Promise.resolve({ message: 'Book deleted successfully' });
    throw new NotFoundException(`Book with ID ${id} not found`);
  }),
});

// Mock AuthGuard
export const mockAuthGuard = {
  canActivate: jest.fn((context) => {
    const req = context.switchToHttp().getRequest();
    req.user = { id: MOCK_USER_ID, email: 'test@example.com' };
    return true;
  }),
};
