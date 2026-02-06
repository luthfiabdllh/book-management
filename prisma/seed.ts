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
  const booksData = Array.from({ length: 100 }).map((_, index) => ({
    title: faker.book.title(),
    author: faker.book.author(),
    isbn: faker.commerce.isbn(13),
    published_year: faker.date.past({ years: 50 }).getFullYear(),
    stock: faker.number.int({ min: 0, max: 100 }),
    cover_image: `https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop&q=80&sig=${index}`,
  }));

  // Delete existing books first to avoid conflicts
  await prisma.book.deleteMany({});
  console.log('Cleared existing books');

  // Create books using createMany (more efficient)
  await prisma.book.createMany({
    data: booksData.map((b) => ({
      ...b,
      created_by: user.id,
    })),
    skipDuplicates: true,
  });

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
