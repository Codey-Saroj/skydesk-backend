# SkyDesk — Prisma Documentation

## 1. Prisma Overview

### What is Prisma?

Prisma is an Object-Relational Mapper (ORM) for Node.js applications. It provides a structured and developer-friendly way to interact with relational databases such as PostgreSQL.

In SkyDesk, Prisma is used as the database access layer between the Express.js backend and the PostgreSQL database hosted on Supabase.

### SkyDesk Database Stack

| Technology | Purpose |
|---|---|
| Node.js | Backend runtime |
| Express.js | REST API framework |
| Prisma ORM | Database access layer |
| PostgreSQL | Relational database |
| Supabase | Cloud PostgreSQL hosting |

### Database Architecture

```text
React Frontend
      ↓
Express.js API
      ↓
Controllers
      ↓
Services
      ↓
Prisma Client
      ↓
PostgreSQL
      ↓
Supabase

## 5. Users Model

The `users` model stores SkyDesk user account information.

### Prisma Model

```prisma
model users {
  id              Int               @id @default(autoincrement())
  name            String            @db.VarChar(150)
  email           String            @unique @db.VarChar(255)
  password        String            @db.VarChar(255)
  role            user_role         @default(employee)
  avatar_url      String?
  created_at      DateTime          @default(now()) @db.Timestamptz(6)
  updated_at      DateTime          @default(now()) @db.Timestamptz(6)
}

## 6. Flights Model

The `flights` model stores flight information available in the SkyDesk system.

### Fields

| Field | Type | Description |
|---|---|---|
| `id` | Int | Primary key |
| `flight_number` | String | Flight number |
| `airline` | String | Airline name |
| `origin` | String | Origin airport code |
| `destination` | String | Destination airport code |
| `origin_city` | String? | Origin city |
| `destination_city` | String? | Destination city |
| `departure_time` | DateTime | Flight departure time |
| `arrival_time` | DateTime | Flight arrival time |
| `duration` | String? | Flight duration |
| `stops` | String | Number/type of stops |
| `price` | Decimal | Ticket price |
| `cabin_class` | String | Cabin class |
| `available_seats` | Int | Available seats |
| `created_at` | DateTime | Record creation time |

### Relationship

One flight can have multiple bookings.

```text
flights
   │
   └── bookings[]

   ## 7. Bookings Model

The `bookings` model stores flight booking records created by users.

### Fields

| Field | Type | Description |
|---|---|---|
| `id` | Int | Primary key |
| `user_id` | Int | ID of the user who made the booking |
| `flight_id` | Int | ID of the booked flight |
| `booking_ref` | String | Unique booking reference |
| `pnr` | String? | Passenger Name Record |
| `status` | booking_status | Booking status |
| `passengers` | Int | Number of passengers |
| `total_price` | Decimal | Total booking price |
| `seat_number` | String? | Assigned seat |
| `terminal` | String? | Airport terminal |
| `gate` | String? | Airport gate |
| `booking_date` | DateTime | Booking creation date |
| `updated_at` | DateTime | Last update time |
| `cabin_class` | String? | Travel cabin class |

### Relationships

A booking belongs to:

- One user
- One flight

```text
users ──────< bookings >────── flights

## 8. Trips Model

The `trips` model stores travel plans created by SkyDesk users.

### Fields

| Field | Type | Description |
|---|---|---|
| `id` | Int | Primary key |
| `user_id` | Int | Owner of the trip |
| `booking_id` | Int? | Optional associated booking |
| `title` | String | Trip title |
| `destination` | String? | Trip destination |
| `start_date` | DateTime? | Trip start date |
| `end_date` | DateTime? | Trip end date |
| `status` | trip_status | Current trip status |
| `created_at` | DateTime | Record creation time |
| `updated_at` | DateTime | Last update time |

### Relationships

A trip belongs to one user:

```text
users ──────< trips

## 9. Expenses Model

The `expenses` model stores expenses associated with users and trips.

| Field | Type | Description |
|---|---|---|
| `id` | Int | Primary key |
| `user_id` | Int | Expense owner |
| `trip_id` | Int? | Optional trip |
| `title` | String | Expense title |
| `amount` | Decimal | Expense amount |
| `category` | expense_category | Expense category |
| `status` | expense_status | Approval status |
| `expense_date` | DateTime | Expense date |
| `receipt_url` | String? | Receipt URL |
| `notes` | String? | Additional notes |
| `created_at` | DateTime | Creation time |
| `updated_at` | DateTime | Last update time |

### Relationships

```text
users ──────< expenses
trips ──────< expenses

## 10. Offers Model

The `offers` model stores promotional offers available in SkyDesk.

| Field | Type | Description |
|---|---|---|
| `id` | Int | Primary key |
| `title` | String | Offer title |
| `description` | String? | Offer description |
| `code` | String | Unique promotional code |
| `discount` | String? | Discount information |
| `badge` | String? | Promotional badge |
| `valid_until` | DateTime? | Offer expiry date |
| `is_active` | Boolean | Whether the offer is active |
| `created_at` | DateTime | Creation timestamp |

### Constraints

- `id` is the primary key.
- `code` is unique.
- Optional fields can be `NULL`.
- `is_active` defaults to `true`.

### Default

```prisma id="d3x8kc"
is_active Boolean @default(true)

## 11. Support Tickets Model

The `support_tickets` model stores user support requests.

| Field | Type | Description |
|---|---|---|
| `id` | Int | Primary key |
| `user_id` | Int | User who created the ticket |
| `subject` | String | Ticket subject |
| `message` | String | Support request details |
| `status` | ticket_status | Current ticket status |
| `created_at` | DateTime | Creation timestamp |
| `updated_at` | DateTime | Last update timestamp |

### Relationship

```text
users ──────< support_tickets

## 12. Enums

SkyDesk uses six Prisma enums to restrict fields to predefined values.

### 12.1 booking_status

```prisma
enum booking_status {
  confirmed
  cancelled
  completed
  pending
}

## 13. Relationships and Foreign Keys

SkyDesk uses relational mappings between users, flights, bookings, trips, expenses, and support tickets.

### Main Relationships

| Relationship | Type | Description |
|---|---|---|
| Users → Bookings | 1:N | One user can have many bookings |
| Users → Trips | 1:N | One user can have many trips |
| Users → Expenses | 1:N | One user can have many expenses |
| Users → Support Tickets | 1:N | One user can have many tickets |
| Flights → Bookings | 1:N | One flight can have many bookings |
| Trips → Expenses | 1:N | One trip can have many expenses |
| Bookings → Trips | 1:0..N | A booking can be associated with trips |

### Foreign Keys

```text
bookings.user_id       → users.id
bookings.flight_id     → flights.id

expenses.user_id       → users.id
expenses.trip_id       → trips.id

support_tickets.user_id → users.id

trips.user_id          → users.id
trips.booking_id       → bookings.id

## 14. Prisma CRUD Operations

Prisma Client provides methods for common database operations.

### Create

Create a new user:

```javascript
const user = await prisma.users.create({
  data: {
    name: "John",
    email: "john@example.com",
    password: "hashed_password"
  }
});

## 15. Filtering, Sorting and Selecting Data

Prisma provides options to filter, sort, and select specific database fields.

### Filtering with `where`

Find all expenses for a specific user:

```javascript
const expenses = await prisma.expenses.findMany({
  where: {
    user_id: 1
  }
});

## 16. Pagination

Pagination limits the amount of data returned from the database.

Prisma supports pagination using `skip` and `take`.

### Offset Pagination

```javascript
const flights = await prisma.flights.findMany({
  skip: 0,
  take: 10
});

## 17. Prisma Migrations

Prisma Migrations are used to track and apply changes to the database structure.

### Create a Migration

When the Prisma schema is changed:

```bash
npx prisma migrate dev --name add_new_field

## 18. Database Introspection

Database introspection allows Prisma to read an existing database and generate/update the Prisma schema based on the database structure.

SkyDesk uses:

```bash
npx prisma db pull
## 19. Prisma Client

Prisma Client is the generated database client used by the SkyDesk backend to communicate with PostgreSQL.

### Generate Prisma Client

Run:

```bash
npx prisma generate

## 20. Prisma Studio

Prisma Studio is a visual database browser provided by Prisma. It allows developers to view and manage database records through a web interface.

### Start Prisma Studio

Run from the backend directory:

```bash
npx prisma studio

## 21. Transactions

A transaction ensures that multiple database operations succeed or fail together.

Prisma provides `$transaction()` for this purpose.

### Example

```javascript
const result = await prisma.$transaction(async (tx) => {
  const booking = await tx.bookings.create({
    data: {
      user_id: 1,
      flight_id: 10,
      booking_ref: "SKY123",
      passengers: 1,
      total_price: 5000
    }
  });

  const trip = await tx.trips.create({
    data: {
      user_id: 1,
      booking_id: booking.id,
      title: "Delhi Trip"
    }
  });

  return { booking, trip };
});

## 23. Database Seeding

Database seeding is used to insert initial or test data into the database.

SkyDesk can use:

```text
backend/prisma/seed.ts

## 24. Supabase Integration

SkyDesk uses Supabase as the cloud-hosted PostgreSQL database.

### Connection Architecture

```text
SkyDesk Backend
      ↓
Prisma Client
      ↓
PostgreSQL Connection
      ↓
Supabase

## 25. Security

Database credentials and application secrets must not be committed to GitHub.

Sensitive information is stored in:

backend/.env

Examples:

DATABASE_URL="..."
JWT_SECRET="..."
GEMINI_API_KEY="..."

### Security Rules

- Never commit database passwords.
- Never expose database credentials in frontend code.
- Never hard-code secrets inside source files.
- Use environment variables for sensitive configuration.
- Passwords stored in the database should be hashed.
- Use HTTPS in production.

---

## 26. Production Deployment

Before deploying SkyDesk to production, configure the production database connection through environment variables.

### Apply Existing Migrations

```bash
npx prisma migrate deploy

27. Prisma Troubleshooting
Invalid Database URL

Example error:

Error parsing connection string:
empty host in database URL

Cause:

The DATABASE_URL was incorrectly formatted.

Incorrect:

DATABASE_URL="postgres://user:password@://supabase.com"

Correct structure:

DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE"
Database Connection Error

Run:

npx prisma validate

Check:

DATABASE_URL
Database host
Database port
Database password
Supabase project status
Network connectivity
Prisma Client Not Generated

Run:

npx prisma generate
Schema Validation Error

Run:

npx prisma validate
Database Schema Changed

If the database was modified directly in Supabase:

npx prisma db pull

Then:

npx prisma generate
28. Useful Prisma Commands
Command	Purpose
npx prisma -v	Show Prisma versions
npx prisma validate	Validate Prisma schema
npx prisma generate	Generate Prisma Client
npx prisma db pull	Import database structure
npx prisma db push	Push schema changes without migrations
npx prisma migrate dev	Create development migration
npx prisma migrate deploy	Apply production migrations
npx prisma migrate status	Check migration status
npx prisma migrate reset	Reset development database
npx prisma db seed	Run seed script
npx prisma studio	Open visual database browser
29. SkyDesk Prisma Workflow
Existing Database Workflow
Supabase PostgreSQL
       ↓
npx prisma db pull
       ↓
schema.prisma
       ↓
npx prisma generate
       ↓
Prisma Client
Development Workflow
Update schema.prisma
       ↓
npx prisma validate
       ↓
npx prisma migrate dev
       ↓
npx prisma generate
       ↓
Backend Services
       ↓
PostgreSQL / Supabase
30. SkyDesk Database Summary

SkyDesk currently uses:

PostgreSQL as the relational database.
Supabase for cloud database hosting.
Prisma 6.19.3 as the ORM.
Prisma Client for database operations.
7 database models.
6 Prisma enums.
Foreign-key relationships between major entities.
Indexes for frequently queried fields.
Environment variables for secure database configuration.
Database Models
users
 ├── bookings
 ├── trips
 ├── expenses
 └── support_tickets

flights
 └── bookings

bookings
 └── trips

trips
 └── expenses

offers
31. Prisma Documentation Checklist
 Prisma overview
 Prisma configuration
 Database provider
 Environment configuration
 7 database models
 Fields and data types
 Relationships
 Foreign keys
 Enums
 Indexes
 CRUD operations
 Filtering and sorting
 Pagination
 Migrations
 Database introspection
 Prisma Client
 Prisma Studio
 Transactions
 Error handling
 Database seeding
 Supabase integration
 Security
 Production deployment
 Troubleshooting
 Command reference