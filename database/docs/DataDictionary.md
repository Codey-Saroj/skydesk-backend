# SkyDesk — Data Dictionary

## 1. Overview

This document describes the database tables, columns, data types, constraints, defaults, and relationships used by the SkyDesk application.

### Database

- **Database:** PostgreSQL
- **Hosting:** Supabase
- **ORM:** Prisma
- **Schema:** `public`
- **Tables:** 7
- **Enums:** 6

---

# 2. Users Table

Stores SkyDesk user account and authentication information.

| Column | Type | Nullable | Key / Constraint | Default | Description |
|---|---|---|---|---|---|
| `id` | Integer | No | Primary Key | Auto Increment | Unique user ID |
| `name` | VARCHAR(150) | No | — | — | User's name |
| `email` | VARCHAR(255) | No | Unique | — | User's email address |
| `password` | VARCHAR(255) | No | — | — | Hashed user password |
| `role` | `user_role` | No | Enum | `employee` | User authorization role |
| `avatar_url` | String | Yes | — | NULL | Profile image URL |
| `created_at` | TIMESTAMPTZ | No | — | `now()` | Account creation timestamp |
| `updated_at` | TIMESTAMPTZ | No | — | `now()` | Last update timestamp |

### Relationships

- One user → Many bookings
- One user → Many expenses
- One user → Many trips
- One user → Many support tickets

---

# 3. Flights Table

Stores available flight information.

| Column | Type | Nullable | Key / Constraint | Default | Description |
|---|---|---|---|---|---|
| `id` | Integer | No | Primary Key | Auto Increment | Unique flight ID |
| `flight_number` | VARCHAR(20) | No | — | — | Flight number |
| `airline` | VARCHAR(100) | No | — | — | Airline name |
| `origin` | VARCHAR(10) | No | — | — | Origin airport code |
| `destination` | VARCHAR(10) | No | — | — | Destination airport code |
| `origin_city` | VARCHAR(100) | Yes | — | NULL | Origin city |
| `destination_city` | VARCHAR(100) | Yes | — | NULL | Destination city |
| `departure_time` | TIMESTAMPTZ | No | Indexed | — | Departure date and time |
| `arrival_time` | TIMESTAMPTZ | No | — | — | Arrival date and time |
| `duration` | VARCHAR(20) | Yes | — | NULL | Flight duration |
| `stops` | VARCHAR(50) | No | — | `Non-stop` | Stop information |
| `price` | DECIMAL(10,2) | No | — | — | Flight ticket price |
| `cabin_class` | VARCHAR(50) | No | — | `Economy` | Cabin class |
| `available_seats` | Integer | No | — | `0` | Number of available seats |
| `created_at` | TIMESTAMPTZ | No | — | `now()` | Record creation timestamp |

### Relationships

- One flight → Many bookings

### Indexes

- `idx_flights_departure` → `departure_time`
- `idx_flights_route` → `origin`, `destination`

---

# 4. Bookings Table

Stores flight booking information.

| Column | Type | Nullable | Key / Constraint | Default | Description |
|---|---|---|---|---|---|
| `id` | Integer | No | Primary Key | Auto Increment | Booking ID |
| `user_id` | Integer | No | Foreign Key | — | User who made the booking |
| `flight_id` | Integer | No | Foreign Key | — | Booked flight |
| `booking_ref` | VARCHAR(20) | No | Unique | — | Unique booking reference |
| `pnr` | VARCHAR(10) | Yes | — | NULL | Passenger Name Record |
| `status` | `booking_status` | No | Enum | `confirmed` | Booking status |
| `passengers` | Integer | No | — | `1` | Number of passengers |
| `total_price` | DECIMAL(10,2) | No | — | — | Total booking price |
| `seat_number` | VARCHAR(10) | Yes | — | NULL | Passenger seat |
| `terminal` | VARCHAR(10) | Yes | — | NULL | Airport terminal |
| `gate` | VARCHAR(10) | Yes | — | NULL | Boarding gate |
| `booking_date` | TIMESTAMPTZ | No | — | `now()` | Booking date |
| `updated_at` | TIMESTAMPTZ | No | — | `now()` | Last update timestamp |
| `cabin_class` | VARCHAR(30) | Yes | — | NULL | Travel cabin class |

### Relationships

- Many bookings → One user
- Many bookings → One flight
- Booking → Optional trip association

### Foreign Keys

```text
user_id   → users.id
flight_id → flights.id

5. Trips Table

Stores user travel plans.

Column	Type	Nullable	Key / Constraint	Default	Description
id	Integer	No	Primary Key	Auto Increment	Trip ID
user_id	Integer	No	Foreign Key	—	Trip owner
booking_id	Integer	Yes	Foreign Key	NULL	Associated booking
title	VARCHAR(200)	No	—	—	Trip title
destination	VARCHAR(150)	Yes	—	NULL	Trip destination
start_date	DATE	Yes	—	NULL	Trip start date
end_date	DATE	Yes	—	NULL	Trip end date
status	trip_status	No	Enum	upcoming	Trip status
created_at	TIMESTAMPTZ	No	—	now()	Creation timestamp
updated_at	TIMESTAMPTZ	No	—	now()	Last update timestamp
Relationships
Many trips → One user
Trip → Optional booking
One trip → Many expenses
Foreign Keys
user_id     → users.id
booking_id  → bookings.id
Indexes
idx_trips_user → user_id
6. Expenses Table

Stores user and trip-related expenses.

Column	Type	Nullable	Key / Constraint	Default	Description
id	Integer	No	Primary Key	Auto Increment	Expense ID
user_id	Integer	No	Foreign Key	—	Expense owner
trip_id	Integer	Yes	Foreign Key	NULL	Related trip
title	VARCHAR(200)	No	—	—	Expense title
amount	DECIMAL(10,2)	No	—	—	Expense amount
category	expense_category	No	Enum	other	Expense category
status	expense_status	No	Enum	pending	Approval status
expense_date	DATE	No	—	Current date	Date of expense
receipt_url	String	Yes	—	NULL	Receipt location
notes	String	Yes	—	NULL	Additional information
created_at	TIMESTAMPTZ	No	—	now()	Creation timestamp
updated_at	TIMESTAMPTZ	No	—	now()	Last update timestamp
Relationships
Many expenses → One user
Many expenses → Optional trip
Foreign Keys
user_id → users.id
trip_id → trips.id
Indexes
idx_expenses_date → expense_date
idx_expenses_trip → trip_id
idx_expenses_user → user_id
7. Offers Table

Stores promotional offers and discount information.

Column	Type	Nullable	Key / Constraint	Default	Description
id	Integer	No	Primary Key	Auto Increment	Offer ID
title	VARCHAR(200)	No	—	—	Offer title
description	String	Yes	—	NULL	Offer description
code	VARCHAR(50)	No	Unique	—	Promotional code
discount	VARCHAR(50)	Yes	—	NULL	Discount information
badge	VARCHAR(50)	Yes	—	NULL	Promotional badge
valid_until	DATE	Yes	—	NULL	Offer expiry date
is_active	Boolean	No	—	true	Whether offer is active
created_at	TIMESTAMPTZ	No	—	now()	Creation timestamp
Relationships

The offers table currently has no foreign-key relationships with other tables.

8. Support Tickets Table

Stores user support requests.

Column	Type	Nullable	Key / Constraint	Default	Description
id	Integer	No	Primary Key	Auto Increment	Ticket ID
user_id	Integer	No	Foreign Key	—	Ticket creator
subject	VARCHAR(300)	No	—	—	Ticket subject
message	String	No	—	—	Support message
status	ticket_status	No	Enum	open	Ticket status
created_at	TIMESTAMPTZ	No	—	now()	Creation timestamp
updated_at	TIMESTAMPTZ	No	—	now()	Last update timestamp
Relationship
Many support tickets → One user
Foreign Key
user_id → users.id
Index
idx_tickets_user → user_id
9. Enum Dictionary
9.1 booking_status
Value	Meaning
confirmed	Booking is confirmed
cancelled	Booking has been cancelled
completed	Journey/booking is completed
pending	Booking is awaiting confirmation
9.2 expense_category
Value	Meaning
meals	Food and meals
transport	Transportation
accommodation	Hotel or accommodation
communication	Communication expenses
other	Other expenses
9.3 expense_status
Value	Meaning
pending	Waiting for approval
approved	Expense approved
rejected	Expense rejected
9.4 ticket_status
Value	Meaning
open	Newly created ticket
in_progress	Ticket is being handled
resolved	Issue resolved
closed	Ticket closed
9.5 trip_status
Value	Meaning
upcoming	Trip has not started
ongoing	Trip is currently active
completed	Trip completed
cancelled	Trip cancelled
9.6 user_role
Value	Meaning
employee	Standard SkyDesk user
admin	Administrator
10. Primary Keys

Every SkyDesk table has an integer primary key.

Table	Primary Key
users	id
flights	id
bookings	id
trips	id
expenses	id
offers	id
support_tickets	id

All primary keys use:

@id @default(autoincrement())
11. Foreign Key Summary
Table	Foreign Key	References
bookings	user_id	users.id
bookings	flight_id	flights.id
expenses	user_id	users.id
expenses	trip_id	trips.id
support_tickets	user_id	users.id
trips	user_id	users.id
trips	booking_id	bookings.id
12. Index Summary
Index	Table	Column(s)	Purpose
idx_flights_departure	flights	departure_time	Faster departure-time searches
idx_flights_route	flights	origin, destination	Faster route searches
idx_bookings_user	bookings	user_id	Faster user booking queries
idx_expenses_date	expenses	expense_date	Faster date filtering
idx_expenses_trip	expenses	trip_id	Faster trip expense queries
idx_expenses_user	expenses	user_id	Faster user expense queries
idx_tickets_user	support_tickets	user_id	Faster user ticket queries
idx_trips_user	trips	user_id	Faster user trip queries
13. Database Relationship Overview
                         ┌──────────────┐
                         │    users     │
                         └──────┬───────┘
                                │
              ┌─────────────────┼─────────────────┐
              │                 │                 │
              ▼                 ▼                 ▼
        ┌───────────┐     ┌───────────┐    ┌─────────────────┐
        │ bookings  │     │   trips   │    │    expenses     │
        └─────┬─────┘     └─────┬─────┘    └─────────────────┘
              │                 │
              ▼                 ▼
        ┌───────────┐     ┌───────────┐
        │  flights  │     │ expenses  │
        └───────────┘     └───────────┘

                         users
                           │
                           ▼
                   support_tickets

                         offers
                    (independent)
14. Data Integrity Rules

The database uses several mechanisms to maintain data integrity:

Primary keys uniquely identify records.
Unique constraints prevent duplicate values.
Foreign keys maintain relationships between tables.
Enum fields restrict values to predefined options.
Default values provide sensible initial values.
Indexes improve query performance.
Cascade deletion removes dependent user records where configured.
15. Monetary Data

Financial values such as flight prices, booking totals, and expenses use:

DECIMAL(10,2)

This provides two decimal places and is preferable to floating-point types for monetary values.

Affected fields:

flights.price
bookings.total_price
expenses.amount
16. Timestamp and Date Handling

SkyDesk uses PostgreSQL date/time types through Prisma.

TIMESTAMPTZ

Used for timestamps that require time-zone awareness:

created_at
updated_at
booking_date
departure_time
arrival_time
DATE

Used when only the calendar date is required:

start_date
end_date
expense_date
valid_until
17. Nullable Fields

Nullable fields are represented by ? in Prisma.

Example:

avatar_url String?

This means the field may contain NULL.

Examples of nullable fields include:

users.avatar_url
flights.origin_city
flights.destination_city
flights.duration
bookings.pnr
bookings.seat_number
bookings.terminal
bookings.gate
bookings.cabin_class
trips.booking_id
trips.destination
trips.start_date
trips.end_date
expenses.trip_id
expenses.receipt_url
expenses.notes
Offer optional fields
18. Data Dictionary Summary

SkyDesk's PostgreSQL database contains seven primary tables:

users
flights
bookings
trips
expenses
offers
support_tickets

The database is designed around the core travel-management workflow:

User
 ↓
Flight Search
 ↓
Booking
 ↓
Trip
 ↓
Expenses

Additional functionality includes:

User → Support Tickets
Offers → Promotional Information

This data dictionary should be updated whenever the Prisma schema or PostgreSQL database structure changes.