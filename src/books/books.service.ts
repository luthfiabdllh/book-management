import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BooksService {
  constructor(private prisma: PrismaService) {}

  async create(createBookDto: CreateBookDto, userId: string) {
    return this.prisma.book.create({
      data: {
        ...createBookDto,
        created_by: userId,
      },
    });
  }

  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [data, total] = await this.prisma.$transaction([
      this.prisma.book.findMany({
        skip,
        take: limit,
        orderBy: { title: 'asc' },
      }),
      this.prisma.book.count(),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        last_page: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const book = await this.prisma.book.findUnique({
      where: { id },
    });
    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
    return book;
  }

  async update(id: string, updateBookDto: UpdateBookDto) {
    await this.findOne(id); // Ensure exists
    return this.prisma.book.update({
      where: { id },
      data: updateBookDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id); // Ensure exists
    await this.prisma.book.delete({
      where: { id },
    });
    return { message: 'Book deleted successfully' };
  }
}
