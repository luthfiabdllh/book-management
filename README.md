<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
  <a href="https://supabase.com/" target="blank"><img src="https://supabase.com/docs/img/supabase-logo.svg" width="120" alt="Supabase Logo" /></a>
</p>

# Book Management Service

A robust RESTful API backend for managing a library system, built with NestJS and Supabase.

**Live Demo URL:** [https://main-story-test-be.vercel.app/](https://main-story-test-be.vercel.app/)

## 🚀 Technical Stack
- **Framework:** NestJS (Node.js)
- **Database:** PostgreSQL (via Supabase)
- **ORM:** Prisma
- **Authentication:** Supabase Auth (JWT) guarded with Passport.js
- **Validation:** Class-validator & Class-transformer
- **Documentation:** Swagger (Scramble)
- **Testing:** Jest (Unit & End-to-End)

## 🛠️ Prerequisites
- Node.js (LTS version recommended)
- npm
- Supabase Project (with DATABASE_URL and DIRECT_URL)

## 📦 Installation
1. **Clone the repository**
   \`\`\`bash
   git clone <repository_url>
   cd book-management
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Environment Setup**
   Create a \`.env\` file in the root directory and configure the following variables:
   \`\`\`env
   DATABASE_URL="postgresql://postgres:[PASSWORD]@[HOST]:[PORT]/postgres?pgbouncer=true"
   DIRECT_URL="postgresql://postgres:[PASSWORD]@[HOST]:[PORT]/postgres"
   # Add your specific Supabase Secrets if applicable (e.g. JWT_SECRET)
   \`\`\`

4. **Database Migration & Seeding**
   \`\`\`bash
   # Run migrations
   npm run migrate

   # Seed database with dummy data (User & Books)
   npm run seed
   \`\`\`

## 🏃 Running the Application

### Local Development
\`\`\`bash
# Standard mode
npm run start

# Watch mode (Hot-reload)
npm run start:dev
\`\`\`

### Production Build
\`\`\`bash
npm run build
npm run start:prod
\`\`\`

The server will start on \`http://localhost:3000\`.

## 🧪 Testing

This project includes comprehensive automated tests ensuring reliability.

### Unit Tests
Tests individual components like Services and Controllers.
\`\`\`bash
npm run test
\`\`\`

### End-to-End (E2E) Tests
Tests complete API flows (Mocked DB for speed/reliability).
\`\`\`bash
npm run test:e2e
\`\`\`

### Test Coverage
View detailed coverage reports.
\`\`\`bash
npm run test:cov
\`\`\`

## 📖 API Documentation

The API is fully documented and deployed.

**Base URL:** \`https://main-story-test-be.vercel.app\`

### Authentication
All endpoints require a valid **Supabase JWT Token**.
- **Header:** \`Authorization: Bearer <your_access_token>\`

### Endpoints

### Endpoints

#### 1. Authentication
**`POST /auth/login`**
- **Description:** Login to receive JWT Access Token.
- **Body:**
  \`\`\`json
  {
    "email": "admin@example.com",
    "password": "password123"
  }
  \`\`\`

#### 2. Get All Books
**`GET /books`**
- **Description:** Retrieve a paginated list of books.
- **Query Parameters:**
  - `page` (optional): Page number (default: 1)
  - `limit` (optional): Items per page (default: 10)
- **Response:**
  \`\`\`json
  {
    "data": [ ... ],
    "meta": {
      "total": 100,
      "page": 1,
      "last_page": 10
    }
  }
  \`\`\`

#### 3. Get Book by ID
**`GET /books/:id`**
- **Description:** Retrieve details of a specific book.
- **Path Parameters:**
  - `id`: UUID of the book
- **Response:** object

#### 4. Create Book
**`POST /books`**
- **Description:** Add a new book to the library.
- **Body:**
  \`\`\`json
  {
    "title": "Clean Code",
    "author": "Robert C. Martin",
    "isbn": "978-0132350884",
    "published_year": 2008,
    "stock": 10
  }
  \`\`\`

#### 5. Update Book
**`PATCH /books/:id`**
- **Description:** Update an existing book.
- **Body:** (Partial update supported)
  \`\`\`json
  {
    "stock": 15,
    "title": "Clean Code (Updated)"
  }
  \`\`\`

#### 6. Delete Book
**`DELETE /books/:id`**
- **Description:** Remove a book permanently.
- **Path Parameters:**
  - `id`: UUID of the book

## ☁️ Deployment

This project is configured for Vercel deployment but can be deployed to any node-compatible host.
Refer to [NestJS Deployment Docs](https://docs.nestjs.com/deployment) for details.
