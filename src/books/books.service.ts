import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class BooksService {
  constructor(private prisma: PrismaService) {}

  async create(createBookDto: CreateBookDto, userId: string) {
    try {
      return await this.prisma.book.create({
        data: {
          ...createBookDto,
          created_by: userId,
        },
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    search?: string,
    orderBy: string = 'title',
    order: 'asc' | 'desc' = 'asc',
  ) {
    const skip = (page - 1) * limit;

    // Validate orderBy field
    const allowedFields = ['title', 'author', 'published_year', 'stock', 'created_at'];
    const sortField = allowedFields.includes(orderBy) ? orderBy : 'title';

    const where: Prisma.BookWhereInput = search
      ? {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { author: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    const [data, total] = await this.prisma.$transaction([
      this.prisma.book.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortField]: order },
      }),
      this.prisma.book.count({ where }),
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
    try {
      return await this.prisma.book.update({
        where: { id },
        data: updateBookDto,
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async remove(id: string) {
    await this.findOne(id); // Ensure exists
    await this.prisma.book.delete({
      where: { id },
    });
    return { message: 'Book deleted successfully' };
  }

  private handlePrismaError(error: any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        const target = (error.meta?.target as string[]) || [];
        if (target.includes('isbn')) {
          throw new ConflictException('ISBN sudah terdaftar');
        }
      }
      if (error.code === 'P2003') {
        throw new BadRequestException('Data referensi tidak ditemukan (User/Author tidak valid)');
      }
    }
    throw error;
  }
}
