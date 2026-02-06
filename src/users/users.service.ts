import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOne(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async syncUser(data: { id: string; email: string; name?: string; role?: string }) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser && existingUser.id !== data.id) {
      // Conflict: Email exists but ID differs (Seed/Local vs Supabase).
      // Strategy: Migrate ownership of books and replace the user.
      return this.prisma.$transaction(async (tx) => {
        // 1. Find books owned by the old user
        const userBooks = await tx.book.findMany({
          where: { created_by: existingUser.id },
          select: { id: true },
        });
        const bookIds = userBooks.map((b) => b.id);

        // 2. Detach books to allow user deletion
        if (bookIds.length > 0) {
          await tx.book.updateMany({
            where: { id: { in: bookIds } },
            data: { created_by: null },
          });
        }

        // 3. Delete the old user
        await tx.user.delete({
          where: { id: existingUser.id },
        });

        // 4. Create the new user with correct ID
        await tx.user.create({
          data: {
            id: data.id,
            email: data.email,
            name: data.name,
            role: data.role || 'MEMBER',
          },
        });

        // 5. Re-attach books
        if (bookIds.length > 0) {
          await tx.book.updateMany({
            where: { id: { in: bookIds } },
            data: { created_by: data.id },
          });
        }

        return tx.user.findUnique({ where: { id: data.id } });
      });
    }

    // No conflict, standard upsert
    return this.prisma.user.upsert({
      where: { id: data.id },
      update: {
        email: data.email,
        name: data.name,
        role: data.role,
      },
      create: {
        id: data.id, // Supabase ID
        email: data.email,
        name: data.name,
        role: data.role || 'MEMBER',
      },
    });
  }
}
