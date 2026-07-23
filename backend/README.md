# SkyDesk Backend

REST API for the SkyDesk Travel & Expense Management System.

## Tech Stack

- **Runtime**: Node.js 18+ (ES Modules)
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Auth**: JWT + bcryptjs
- **Security**: Helmet, CORS

---

## Prerequisites

- Node.js v18 or higher
- PostgreSQL 14 or higher

---

## Setup

### 1. Install dependencies

```bash
cd backend
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

Open `.env` and fill in your values:

```env
PORT=5000
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/skydesk
JWT_SECRET=your_strong_secret_here
JWT_EXPIRES_IN=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### 3. Create the database

```bash
# Connect to PostgreSQL and create the database
psql -U postgres -c "CREATE DATABASE skydesk;"
```

### 4. Run the schema

```bash
psql -U postgres -d skydesk -f src/database/schema.sql
```

### 5. Seed initial data (flights + offers)

```bash
psql -U postgres -d skydesk -f src/database/seed.sql
```

### 6. Start the server

```bash
# Development (auto-restart on file changes)
npm run dev

# Production
npm start
```

---

## Verify it's working

```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "success": true,
  "message": "SkyDesk API is running",
  "data": {
    "environment": "development",
    "timestamp": "..."
  }
}
```

---

## Project Structure

```
backend/
├── server.js                   ← Express entry point
├── package.json
├── .env                        ← Your local env vars (git-ignored)
├── .env.example                ← Template
└── src/
    ├── config/
    │   ├── db.js               ← PostgreSQL connection pool
    │   └── env.js              ← Env var loader & validation
    ├── controllers/            ← Route handler functions (Phase 2+)
    ├── middleware/
    │   └── errorHandler.js     ← Centralized error handler
    ├── models/                 ← Database query functions (Phase 2+)
    ├── routes/                 ← Express routers (Phase 2+)
    ├── services/               ← Business logic (Phase 2+)
    ├── utils/
    │   └── response.js         ← sendSuccess / sendError helpers
    └── database/
        ├── schema.sql          ← All table definitions
        └── seed.sql            ← Sample data
```

---

## API Phases

| Phase | Area | Status |
|---|---|---|
| 1 | Scaffold + Server + DB | ✅ Complete |
| 2 | Authentication | 🔜 Next |
| 3 | Flights | 🔜 Pending |
| 4 | Bookings | 🔜 Pending |
| 5 | Trips | 🔜 Pending |
| 6 | Expenses | 🔜 Pending |
| 7 | Offers | 🔜 Pending |
| 8 | Support | 🔜 Pending |
| 9 | Testing | 🔜 Pending |
| 10 | Frontend Integration | 🔜 Pending |
