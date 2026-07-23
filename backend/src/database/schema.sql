

-- Drop existing tables in reverse dependency order (safe re-run)
DROP TABLE IF EXISTS support_tickets CASCADE;
DROP TABLE IF EXISTS expenses CASCADE;
DROP TABLE IF EXISTS trips CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS flights CASCADE;
DROP TABLE IF EXISTS offers CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Drop custom types so we can recreate them cleanly
DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS booking_status CASCADE;
DROP TYPE IF EXISTS trip_status CASCADE;
DROP TYPE IF EXISTS expense_category CASCADE;
DROP TYPE IF EXISTS expense_status CASCADE;
DROP TYPE IF EXISTS ticket_status CASCADE;

-- ─────────────────────────────────────────────────────────────
-- ENUM TYPES
-- ─────────────────────────────────────────────────────────────

CREATE TYPE user_role       AS ENUM ('employee', 'admin');
CREATE TYPE booking_status  AS ENUM ('confirmed', 'cancelled', 'completed', 'pending');
CREATE TYPE trip_status     AS ENUM ('upcoming', 'ongoing', 'completed', 'cancelled');
CREATE TYPE expense_category AS ENUM ('meals', 'transport', 'accommodation', 'communication', 'other');
CREATE TYPE expense_status  AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE ticket_status   AS ENUM ('open', 'in_progress', 'resolved', 'closed');

-- ─────────────────────────────────────────────────────────────
-- TABLE: users
-- ─────────────────────────────────────────────────────────────

CREATE TABLE users (
  id           SERIAL       PRIMARY KEY,
  name         VARCHAR(150) NOT NULL,
  email        VARCHAR(255) NOT NULL UNIQUE,
  password     VARCHAR(255) NOT NULL,          -- bcrypt hash
  role         user_role    NOT NULL DEFAULT 'employee',
  avatar_url   TEXT,
  created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- TABLE: flights
-- ─────────────────────────────────────────────────────────────

CREATE TABLE flights (
  id              SERIAL       PRIMARY KEY,
  flight_number   VARCHAR(20)  NOT NULL,          -- e.g. "6E 2291"
  airline         VARCHAR(100) NOT NULL,
  origin          VARCHAR(10)  NOT NULL,           -- IATA code, e.g. "DEL"
  destination     VARCHAR(10)  NOT NULL,           -- IATA code, e.g. "BOM"
  origin_city     VARCHAR(100),                    -- Full city name for display
  destination_city VARCHAR(100),
  departure_time  TIMESTAMPTZ  NOT NULL,
  arrival_time    TIMESTAMPTZ  NOT NULL,
  duration        VARCHAR(20),                     -- e.g. "2h 05m"
  stops           VARCHAR(50)  NOT NULL DEFAULT 'Non-stop',
  price           NUMERIC(10,2) NOT NULL,
  cabin_class     VARCHAR(50)  NOT NULL DEFAULT 'Economy',
  available_seats INT          NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Index for the most common search pattern: origin → destination
CREATE INDEX idx_flights_route ON flights (origin, destination);
CREATE INDEX idx_flights_departure ON flights (departure_time);

-- ─────────────────────────────────────────────────────────────
-- TABLE: bookings
-- ─────────────────────────────────────────────────────────────

CREATE TABLE bookings (
  id             SERIAL          PRIMARY KEY,
  user_id        INT             NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  flight_id      INT             NOT NULL REFERENCES flights(id) ON DELETE RESTRICT,
  booking_ref    VARCHAR(20)     NOT NULL UNIQUE, -- e.g. "SKD-20240101"
  pnr            VARCHAR(10),                      -- e.g. "X7QK9L"
  status         booking_status  NOT NULL DEFAULT 'confirmed',
  passengers     INT             NOT NULL DEFAULT 1,
  total_price    NUMERIC(10,2)   NOT NULL,
  seat_number    VARCHAR(10),
  terminal       VARCHAR(10),
  gate           VARCHAR(10),
  booking_date   TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_bookings_user ON bookings (user_id);

-- ─────────────────────────────────────────────────────────────
-- TABLE: trips
-- ─────────────────────────────────────────────────────────────

CREATE TABLE trips (
  id          SERIAL       PRIMARY KEY,
  user_id     INT          NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  booking_id  INT          REFERENCES bookings(id) ON DELETE SET NULL,
  title       VARCHAR(200) NOT NULL,
  destination VARCHAR(150),
  start_date  DATE,
  end_date    DATE,
  status      trip_status  NOT NULL DEFAULT 'upcoming',
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_trips_user ON trips (user_id);

-- ─────────────────────────────────────────────────────────────
-- TABLE: expenses
-- ─────────────────────────────────────────────────────────────

CREATE TABLE expenses (
  id          SERIAL            PRIMARY KEY,
  user_id     INT               NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  trip_id     INT               REFERENCES trips(id) ON DELETE SET NULL,
  title       VARCHAR(200)      NOT NULL,       -- description / merchant
  amount      NUMERIC(10,2)     NOT NULL,
  category    expense_category  NOT NULL DEFAULT 'other',
  status      expense_status    NOT NULL DEFAULT 'pending',
  expense_date DATE             NOT NULL DEFAULT CURRENT_DATE,
  receipt_url TEXT,
  notes       TEXT,
  created_at  TIMESTAMPTZ       NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ       NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_expenses_user ON expenses (user_id);
CREATE INDEX idx_expenses_trip ON expenses (trip_id);
CREATE INDEX idx_expenses_date ON expenses (expense_date);

-- ─────────────────────────────────────────────────────────────
-- TABLE: offers
-- ─────────────────────────────────────────────────────────────

CREATE TABLE offers (
  id           SERIAL       PRIMARY KEY,
  title        VARCHAR(200) NOT NULL,
  description  TEXT,
  code         VARCHAR(50)  NOT NULL UNIQUE,   -- promo code, e.g. "INTL20"
  discount     VARCHAR(50),                     -- display string, e.g. "20% OFF"
  badge        VARCHAR(50),                     -- e.g. "HOT", "LIMITED"
  valid_until  DATE,
  is_active    BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- TABLE: support_tickets
-- ─────────────────────────────────────────────────────────────

CREATE TABLE support_tickets (
  id          SERIAL        PRIMARY KEY,
  user_id     INT           NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subject     VARCHAR(300)  NOT NULL,
  message     TEXT          NOT NULL,
  status      ticket_status NOT NULL DEFAULT 'open',
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_tickets_user ON support_tickets (user_id);

-- ─────────────────────────────────────────────────────────────
-- Done
-- ─────────────────────────────────────────────────────────────
