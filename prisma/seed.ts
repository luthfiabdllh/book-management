import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

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

  // Create Dummy Books
  const booksData = [
    { title: 'Clean Code', author: 'Robert C. Martin', isbn: '978-0132350884', published_year: 2008, stock: 10 },
    { title: 'The Pragmatic Programmer', author: 'Andy Hunt', isbn: '978-0201616224', published_year: 1999, stock: 5 },
    { title: 'Design Patterns', author: 'Erich Gamma', isbn: '978-0201633610', published_year: 1994, stock: 8 },
    { title: 'Refactoring', author: 'Martin Fowler', isbn: '978-0201485677', published_year: 1999, stock: 3 },
    { title: 'JavaScript: The Good Parts', author: 'Douglas Crockford', isbn: '978-0596517748', published_year: 2008, stock: 12 },
    { title: 'Effective Java', author: 'Joshua Bloch', isbn: '978-0134685991', published_year: 2018, stock: 7 },
    { title: 'Introduction to Algorithms', author: 'Thomas H. Cormen', isbn: '978-0262033848', published_year: 2009, stock: 4 },
    { title: 'Code Complete', author: 'Steve McConnell', isbn: '978-0735619678', published_year: 2004, stock: 6 },
    { title: 'Head First Design Patterns', author: 'Eric Freeman', isbn: '978-0596007126', published_year: 2004, stock: 9 },
    { title: 'You Don\'t Know JS', author: 'Kyle Simpson', isbn: '978-1491904244', published_year: 2014, stock: 11 },
  ];

  for (const b of booksData) {
    const book = await prisma.book.upsert({
      where: { isbn: b.isbn },
      update: {},
      create: {
        ...b,
        created_by: user.id,
      },
    });
    console.log(`Created book: ${book.title}`);
  }

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
