# SkyDesk — Supabase Setup

## 1. Overview

SkyDesk uses Supabase as the cloud-hosted PostgreSQL database.

Supabase provides the PostgreSQL database infrastructure, while Prisma is used by the backend as the ORM.

### Architecture

```text
React Frontend
      ↓
Express.js Backend
      ↓
Prisma Client
      ↓
PostgreSQL
      ↓
Supabase

2. Supabase Project

The SkyDesk PostgreSQL database is hosted inside a Supabase project.

Supabase provides:

PostgreSQL database
Database management dashboard
SQL Editor
Table management
Database connection information
Authentication and other optional services

For SkyDesk, Prisma connects directly to the PostgreSQL database.

3. Database Configuration

The database provider in Prisma is PostgreSQL:

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

The connection string is stored in the backend environment file.

DATABASE_URL="postgresql://USERNAME:PASSWORD@HOST:5432/DATABASE"

Never commit the real connection string to GitHub.

4. Environment Variables

The backend uses environment variables for configuration.

Example:

PORT=5000

DATABASE_URL="postgresql://USERNAME:PASSWORD@HOST:5432/DATABASE"

JWT_SECRET="your_secure_secret"

JWT_EXPIRES_IN=7d

NODE_ENV=development

FRONTEND_URL="http://localhost:5173"

GEMINI_API_KEY="your_api_key"
Important

The actual .env file should remain private.

The repository should contain:

.env.example

instead of the real .env file.

5. Supabase Database Connection

Supabase provides a PostgreSQL connection string.

The general format is:

postgresql://USERNAME:PASSWORD@HOST:PORT/DATABASE

Example structure:

postgresql://postgres:PASSWORD@db.PROJECT.supabase.co:5432/postgres

The actual password should never be included in documentation or committed to Git.

6. Prisma and Supabase

Prisma connects to Supabase PostgreSQL through DATABASE_URL.

DATABASE_URL
     ↓
Prisma Datasource
     ↓
Supabase PostgreSQL

Prisma Client is then used by backend services:

Express Controller
       ↓
Service
       ↓
Prisma Client
       ↓
Supabase PostgreSQL
7. Database Introspection

If the Supabase database already contains tables, Prisma can read its structure using:

npx prisma db pull

This updates:

backend/prisma/schema.prisma
SkyDesk Result

The existing database was successfully introspected and contains:

7 models
6 enums

The models are:

users
flights
bookings
trips
expenses
offers
support_tickets
8. Generate Prisma Client

After pulling the database schema:

npx prisma generate

This generates Prisma Client based on the current Prisma schema.

9. Verify Database Connection

From the backend directory, run:

npx prisma validate

A valid configuration should pass Prisma schema validation.

You can also run:

npx prisma db pull

to verify that Prisma can communicate with the configured PostgreSQL database.

10. Prisma Studio

Prisma Studio provides a visual interface for inspecting database records.

Run:

npx prisma studio

It can be used during development to inspect:

Users
Flights
Bookings
Trips
Expenses
Offers
Support tickets
11. Supabase SQL Editor

Supabase provides an SQL Editor that can be used to inspect or modify the PostgreSQL database.

Typical uses include:

Running SQL queries
Checking tables
Inspecting indexes
Checking constraints
Debugging database issues

For normal application operations, SkyDesk uses Prisma rather than manually executing SQL from the backend.

12. Database Schema

The current SkyDesk database contains seven main tables:

users
flights
bookings
trips
expenses
offers
support_tickets
Main Relationships
users
 ├── bookings
 ├── trips
 ├── expenses
 └── support_tickets

flights
 └── bookings

trips
 └── expenses

bookings
 └── trips
13. Supabase Security
Never expose database credentials

Do not place the PostgreSQL connection string in:

React frontend code
Public GitHub repositories
Client-side JavaScript
Screenshots
Documentation

The database connection string belongs only on the backend.

Environment Variables

Use:

DATABASE_URL="..."

and keep .env out of version control.

14. Git Configuration

The backend .gitignore should contain:

.env

The .env.example file can be committed because it contains placeholders instead of real secrets.

Example:

DATABASE_URL="your_database_connection_string"
JWT_SECRET="your_jwt_secret"
GEMINI_API_KEY="your_gemini_api_key"
15. Local Development Workflow

Start the backend:

npm run dev

The backend runs on:

http://localhost:5000

Prisma communicates with the Supabase PostgreSQL database using DATABASE_URL.

Development Flow
Developer
    ↓
React Frontend
    ↓
Express API
    ↓
Prisma Client
    ↓
Supabase PostgreSQL
16. Schema Synchronization
Database → Prisma

When changes are made directly in Supabase:

npx prisma db pull

Then:

npx prisma generate
Prisma → Database

When using Prisma migrations:

npx prisma migrate dev --name migration_name

For production:

npx prisma migrate deploy
17. Common Connection Problems
Error: Empty Host

Example:

Error parsing connection string:
empty host in database URL

Check that DATABASE_URL follows:

postgresql://USER:PASSWORD@HOST:PORT/DATABASE
Error: Cannot Reach Database

Check:

Internet connection
Supabase project status
Database hostname
Port
Username
Password
DATABASE_URL
Error: Authentication Failed

Verify the PostgreSQL password in the Supabase database settings.

Do not paste the password into source code.

18. Production Considerations

Before production deployment:

Use a secure database password.
Store secrets in deployment environment variables.
Do not commit .env.
Use HTTPS.
Apply migrations using:
npx prisma migrate deploy
Generate Prisma Client using:
npx prisma generate
Restrict database access appropriately.
Back up important production data.
19. Supabase + Prisma Workflow Summary
Supabase PostgreSQL
        ↓
DATABASE_URL
        ↓
Prisma
        ↓
schema.prisma
        ↓
Prisma Client
        ↓
Express Backend
        ↓
SkyDesk Application

For an existing database:

Supabase
   ↓
npx prisma db pull
   ↓
schema.prisma
   ↓
npx prisma generate
   ↓
Prisma Client

For schema-driven development:

schema.prisma
   ↓
npx prisma migrate dev
   ↓
Supabase PostgreSQL
20. Setup Checklist
 Supabase PostgreSQL database configured
 Prisma configured for PostgreSQL
 DATABASE_URL configured
 Database introspected using prisma db pull
 7 database models available
 Prisma Client generated
 Database documentation created
 .env kept private
 .env.example available for configuration reference
21. Important Security Note

The actual Supabase database password, JWT secret, Gemini API key, and other credentials must never be included in this documentation.

Use placeholders such as:

PASSWORD
YOUR_DATABASE_URL
YOUR_JWT_SECRET
YOUR_API_KEY

The real values should remain in environment variables or the deployment platform's secret-management system.