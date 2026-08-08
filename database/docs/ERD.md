# SkyDesk — Entity Relationship Diagram (ERD)

## 1. Database Entities

SkyDesk contains seven main database entities:

1. users
2. flights
3. bookings
4. trips
5. expenses
6. offers
7. support_tickets

---

## 2. Text-Based ERD

```text
                         ┌──────────────────────┐
                         │        USERS         │
                         ├──────────────────────┤
                         │ PK id                │
                         │    name              │
                         │ UK email             │
                         │    password          │
                         │    role              │
                         │    avatar_url        │
                         │    created_at        │
                         │    updated_at        │
                         └──────────┬───────────┘
                                    │
                  ┌─────────────────┼──────────────────┐
                  │                 │                  │
                1 │               1 │                1 │
                  │                 │                  │
                  ▼                 ▼                  ▼
          ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐
          │   BOOKINGS   │  │    TRIPS     │  │ SUPPORT_TICKETS  │
          ├──────────────┤  ├──────────────┤  ├──────────────────┤
          │ PK id        │  │ PK id        │  │ PK id            │
          │ FK user_id   │  │ FK user_id   │  │ FK user_id       │
          │ FK flight_id │  │ FK booking_id│  │    subject       │
          │ UK booking_ref│ │    title     │  │    message        │
          │    pnr       │  │    destination│ │    status         │
          │    status    │  │    start_date│  │    created_at     │
          │    passengers│  │    end_date  │  │    updated_at     │
          │    total_price│ │    status     │  └──────────────────┘
          │    seat_number│ │    created_at │
          │    terminal   │  │    updated_at │
          │    gate       │  └───────┬──────┘
          │    booking_date│          │
          │    updated_at │         1 │
          │    cabin_class│           │
          └───────┬──────┘           ▼
                  │             ┌──────────────┐
                  │             │   EXPENSES   │
                N │             ├──────────────┤
                  │             │ PK id        │
                  ▼             │ FK user_id   │
          ┌──────────────┐      │ FK trip_id   │
          │    FLIGHTS   │      │    title     │
          ├──────────────┤      │    amount    │
          │ PK id        │      │    category  │
          │    flight_number│   │    status    │
          │    airline   │      │    expense_date│
          │    origin    │      │    receipt_url│
          │    destination│     │    notes     │
          │    origin_city│     │    created_at│
          │    destination_city││    updated_at│
          │    departure_time│  └──────────────┘
          │    arrival_time│
          │    duration   │
          │    stops      │
          │    price      │
          │    cabin_class│
          │    available_seats│
          │    created_at │
          └──────────────┘


                 ┌──────────────────────┐
                 │        OFFERS        │
                 ├──────────────────────┤
                 │ PK id                │
                 │    title             │
                 │    description       │
                 │ UK code              │
                 │    discount          │
                 │    badge             │
                 │    valid_until       │
                 │    is_active         │
                 │    created_at        │
                 └──────────────────────┘

                 Independent Entity

3. Relationship Notation
1 ─────── N

means:

One record → Many records

Example:

users 1 ───────── N bookings

means one user can have multiple bookings.

4. Relationship Details
Users → Bookings
users.id
    │
    └──────────────< bookings.user_id

Cardinality: 1:N

One user can have multiple bookings.

Flights → Bookings
flights.id
    │
    └──────────────< bookings.flight_id

Cardinality: 1:N

One flight can be associated with multiple bookings.

Users → Trips
users.id
    │
    └──────────────< trips.user_id

Cardinality: 1:N

One user can have multiple trips.

Bookings → Trips
bookings.id
    │
    └──────────────< trips.booking_id

Cardinality: 1:N

trips.booking_id is optional, so a trip does not necessarily need an associated booking.

Users → Expenses
users.id
    │
    └──────────────< expenses.user_id

Cardinality: 1:N

One user can create multiple expenses.

Trips → Expenses
trips.id
    │
    └──────────────< expenses.trip_id

Cardinality: 1:N

One trip can contain multiple expenses.

trip_id is optional.

Users → Support Tickets
users.id
    │
    └──────────────< support_tickets.user_id

Cardinality: 1:N

One user can create multiple support tickets.

5. Foreign Key Map
Child Table	Foreign Key	Parent Table	Parent Key
bookings	user_id	users	id
bookings	flight_id	flights	id
trips	user_id	users	id
trips	booking_id	bookings	id
expenses	user_id	users	id
expenses	trip_id	trips	id
support_tickets	user_id	users	id
6. Independent Entity

The offers table currently has no foreign-key relationship.

OFFERS
  │
  ├── title
  ├── description
  ├── code
  ├── discount
  ├── badge
  ├── valid_until
  ├── is_active
  └── created_at

It stores promotional information independently.

7. Overall Application Data Flow
                         USER
                          │
              ┌───────────┼───────────┐
              │           │           │
              ▼           ▼           ▼
          BOOKINGS      TRIPS      SUPPORT
              │           │        TICKETS
              │           │
              ▼           ▼
           FLIGHTS     EXPENSES

The primary SkyDesk workflow is:

User
  ↓
Flight
  ↓
Booking
  ↓
Trip
  ↓
Expenses

Additional functionality:

User
  ↓
Support Ticket

Offers
  ↓
Promotional Information
8. Database Summary
Entity	Purpose
users	Stores user accounts
flights	Stores flight information
bookings	Stores flight bookings
trips	Stores travel plans
expenses	Stores travel expenses
offers	Stores promotional offers
support_tickets	Stores customer support requests
9. ERD Maintenance

This ERD should be updated whenever the Prisma schema changes.

The source of truth for the database structure is:

backend/prisma/schema.prisma

The ERD provides a human-readable representation of that database structure.