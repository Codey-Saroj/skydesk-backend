# SkyDesk — Database Design

## 1. Overview

SkyDesk uses a relational database architecture based on PostgreSQL.

The database is hosted on Supabase and accessed by the Node.js/Express backend through Prisma ORM.

### Technology Stack

| Component | Technology |
|---|---|
| Database | PostgreSQL |
| Database Hosting | Supabase |
| ORM | Prisma |
| Backend | Node.js + Express |
| Schema | `public` |

---

## 2. Database Architecture

```text
┌─────────────────────┐
│   React Frontend    │
└──────────┬──────────┘
           │ HTTP / REST API
           ▼
┌─────────────────────┐
│ Express.js Backend  │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│    Prisma Client    │
└──────────┬──────────┘
           │ PostgreSQL
           ▼
┌─────────────────────┐
│ Supabase PostgreSQL │
└─────────────────────┘

3. Database Entities

The database contains seven main entities:

users
flights
bookings
trips
expenses
offers
support_tickets
4. Entity Relationship Design
                         ┌──────────────┐
                         │    users     │
                         └──────┬───────┘
                                │
             ┌──────────────────┼──────────────────┐
             │                  │                  │
             │                  │                  │
             ▼                  ▼                  ▼
       ┌───────────┐      ┌───────────┐    ┌─────────────────┐
       │ bookings  │      │   trips   │    │ support_tickets │
       └─────┬─────┘      └─────┬─────┘    └─────────────────┘
             │                  │
             │                  ▼
             │            ┌───────────┐
             │            │ expenses  │
             │            └───────────┘
             │
             ▼
       ┌───────────┐
       │  flights  │
       └───────────┘

       ┌───────────┐
       │  offers   │
       └───────────┘
       Independent entity
5. Relationship Design
Users → Bookings

Relationship: One-to-Many

One user can create multiple bookings.

users.id
   │
   └──────< bookings.user_id
Users → Trips

Relationship: One-to-Many

One user can have multiple trips.

users.id
   │
   └──────< trips.user_id
Users → Expenses

Relationship: One-to-Many

One user can create multiple expenses.

users.id
   │
   └──────< expenses.user_id
Users → Support Tickets

Relationship: One-to-Many

One user can create multiple support tickets.

users.id
   │
   └──────< support_tickets.user_id
Flights → Bookings

Relationship: One-to-Many

One flight can have multiple booking records.

flights.id
   │
   └──────< bookings.flight_id
Trips → Expenses

Relationship: One-to-Many

One trip can contain multiple expenses.

trips.id
   │
   └──────< expenses.trip_id

trip_id is nullable, so an expense can exist without being associated with a specific trip.

Bookings → Trips

The trips.booking_id field optionally associates a trip with a booking.

bookings.id
      │
      └──────< trips.booking_id
6. Primary Key Design

Every main table uses an integer primary key:

id Int @id @default(autoincrement())
Primary Keys
Table	Primary Key
users	id
flights	id
bookings	id
trips	id
expenses	id
offers	id
support_tickets	id

Auto-incrementing IDs provide a simple unique identifier for each record.

7. Foreign Key Design

Foreign keys maintain referential integrity between related tables.

Table	Foreign Key	Referenced Table
bookings	user_id	users.id
bookings	flight_id	flights.id
expenses	user_id	users.id
expenses	trip_id	trips.id
trips	user_id	users.id
trips	booking_id	bookings.id
support_tickets	user_id	users.id
8. Cascade Delete

Several user relationships use:

onDelete: Cascade

This means dependent records are automatically deleted when their parent user is deleted.

Cascade Relationships
Delete User
    │
    ├──→ Bookings deleted
    ├──→ Expenses deleted
    ├──→ Trips deleted
    └──→ Support Tickets deleted

This prevents orphaned records associated with deleted users.

9. Index Design

Indexes are used on frequently queried columns.

Flights
@@index([departure_time])
@@index([origin, destination])

Purpose:

Faster departure-time searches
Faster route searches
Bookings
@@index([user_id])

Purpose:

Faster retrieval of user bookings
Trips
@@index([user_id])

Purpose:

Faster retrieval of user trips
Expenses
@@index([expense_date])
@@index([trip_id])
@@index([user_id])

Purpose:

Faster date filtering
Faster trip-based queries
Faster user-based queries
Support Tickets
@@index([user_id])

Purpose:

Faster retrieval of tickets belonging to a user
10. Unique Constraints

The database uses unique constraints where duplicate values should not be allowed.

Users
email String @unique

Two users cannot have the same email address.

Bookings
booking_ref String @unique

Every booking must have a unique booking reference.

Offers
code String @unique

Every promotional code must be unique.

11. Data Types

The database uses appropriate PostgreSQL data types.

Integer

Used for:

IDs
Foreign keys
Passenger counts
Available seats
VARCHAR

Used for bounded text such as:

Names
Emails
Flight numbers
Airport codes
Booking references
Decimal

Used for financial values:

DECIMAL(10,2)

Fields:

flights.price
bookings.total_price
expenses.amount
TIMESTAMPTZ

Used for time-sensitive records:

Flight departure
Flight arrival
Booking date
Creation timestamps
Update timestamps
DATE

Used when only the calendar date is required:

Trip start date
Trip end date
Expense date
Offer expiry date
Boolean

Used for:

offers.is_active
12. Nullable Field Design

Some fields are optional and therefore allow NULL.

Examples:

users.avatar_url

flights.origin_city
flights.destination_city
flights.duration

bookings.pnr
bookings.seat_number
bookings.terminal
bookings.gate

trips.booking_id
trips.destination
trips.start_date
trips.end_date

expenses.trip_id
expenses.receipt_url
expenses.notes

Nullable fields allow the application to store records when optional information is unavailable.

13. Enum Design

Enums restrict fields to predefined values.

Booking Status
confirmed
cancelled
completed
pending
Expense Category
meals
transport
accommodation
communication
other
Expense Status
pending
approved
rejected
Ticket Status
open
in_progress
resolved
closed
Trip Status
upcoming
ongoing
completed
cancelled
User Role
employee
admin

Enums improve data consistency by preventing arbitrary values.

14. Normalization

The SkyDesk database follows relational database normalization principles.

First Normal Form — 1NF

Each column stores a single logical value.

Example:

users.email
users.name
flights.flight_number

There are no repeating groups within a single field.

Second Normal Form — 2NF

Non-key attributes depend on the complete primary key.

Each table represents a specific entity such as:

User
Flight
Booking
Trip
Expense
Third Normal Form — 3NF

Non-key attributes depend on the primary key rather than unrelated non-key attributes.

For example, airline and flight information are stored in flights, while booking-specific information is stored in bookings.

This reduces unnecessary duplication.

15. Database Design Principles

The SkyDesk database follows these principles:

Use primary keys for entity identification.
Use foreign keys for relationships.
Use unique constraints where duplicates are invalid.
Use enums for controlled values.
Use indexes for frequently queried columns.
Use nullable fields only for genuinely optional data.
Use decimal types for monetary values.
Separate entities into dedicated tables.
Maintain referential integrity.
Use cascade deletion where appropriate.
16. Database Design Summary

The database is designed around the main SkyDesk travel workflow:

User
 │
 ├── Search / View Flights
 │
 ├── Create Booking
 │       │
 │       └── Flight
 │
 ├── Create Trip
 │       │
 │       └── Expenses
 │
 └── Create Support Ticket

Promotional offers are maintained independently:

Offers

The overall design provides a structured, normalized relational model suitable for the SkyDesk flight booking and travel management application.