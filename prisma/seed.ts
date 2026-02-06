import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { faker } from '@faker-js/faker';

// @ts-ignore: Prisma Client types might not be generated in this environment yet
const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding ...');

  // Create Dummy User
  const user = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      id: uuidv4(),
      email: 'admin@example.com',
      name: 'Admin User',
      role: 'ADMIN',
    },
  });

  console.log(`Created user with id: ${user.id}`);

  // Create 100 Dummy Books
  const booksData = Array.from({ length: 100 }).map(() => ({
    title: faker.book.title(),
    author: faker.book.author(),
    isbn: faker.commerce.isbn(13),
    published_year: faker.date.past({ years: 50 }).getFullYear(),
    stock: faker.number.int({ min: 0, max: 100 }),
  }));

  for (const b of booksData) {
    // Unique check is implicitly handled by upsert on ISBN, 
    // but if faker generates duplicate, it just updates (no-op).
    const book = await prisma.book.upsert({
      where: { isbn: b.isbn },
      update: {},
      create: {
        ...b,
        created_by: user.id,
      },
    });
    // console.log(`Created book: ${book.title}`); // Commented out to reduce noise
  }
  
  console.log(`Seeded ${booksData.length} books.`);
  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
