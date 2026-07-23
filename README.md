# SkyDesk – Travel & Expense Management Monorepo

SkyDesk is a modern **Travel & Expense Management System** built with **React + Vite** on the frontend, **Express + Node.js** on the backend, and **Supabase PostgreSQL** using a direct SQL client (`pg` Pool).

This repository is structured as a professional, production-ready monorepo using **npm workspaces**.

---

## 1. Project Architecture

The architecture consists of an Express REST API backend and a React single-page app (SPA) frontend. 

Database flow is simple and direct:
```text
React (Vite)  ↔  Express Server  ↔  pg Pool (Direct SQL)  ↔  Supabase PostgreSQL
```

### Folder Structure
```text
skydesk/
├── frontend/             ← React + Vite frontend application
│   ├── public/           ← Static client assets (logos, icons)
│   ├── src/              ← React components, pages, context, and hooks
│   ├── package.json      ← Client-specific dependencies
│   └── vite.config.js    ← Vite configurations & Tailwind CSS setup
│
├── backend/              ← Express REST API & Database layer
│   ├── src/
│   │   ├── config/       ← Environment validation & pg connection pool
│   │   ├── controllers/  ← Request/response handlers (Auth, Trips, Bookings, Expenses, Chat)
│   │   ├── middleware/   ← Global handlers, Rate Limiters, JWT Auth verification
│   │   ├── routes/       ← Express Router configuration (bundled at /api)
│   │   ├── services/     ← Pure business logic & database queries
│   │   ├── utils/        ← Response formatters, Custom Errors, JWT helpers
│   │   ├── validators/   ← Request input validations (express-validator)
│   │   └── server.js     ← Express server entry point
│   └── package.json      ← Server-specific dependencies
│
├── package.json          ← Workspaces root container & shared scripts
├── .gitignore            ← Global file exclusions (node_modules, .env)
└── README.md             ← Monorepo documentation
```

---

## 2. Environment Variables

Create `.env` files in both the `frontend` and `backend` workspace directories.

### Backend (`backend/.env`)
* `PORT` (e.g. `5000`): Port number for the server to listen on.
* `DATABASE_URL` (e.g. `postgresql://...`): Connection URL for Supabase PostgreSQL.
* `JWT_SECRET` (e.g. `your_strong_secret`): Secret key used to sign JWTs.
* `JWT_EXPIRES_IN` (e.g. `7d`): Token expiration length.
* `NODE_ENV` (e.g. `development` or `production`): Node runtime environment.
* `FRONTEND_URL` (e.g. `http://localhost:5173`): URL of the React client (used for CORS).

### Frontend (`frontend/.env`)
* `VITE_API_URL` (e.g. `http://localhost:5000/api`): Consolidated prefix of the Express backend API.

---

## 3. Installation & Setup

### 1. Install Dependencies
Run the install command from the root workspace directory to install dependencies for both the `frontend` and `backend` subprojects:
```bash
npm install
```

### 2. Configure Local Database
Ensure your PostgreSQL database is running, create the database, and execute the SQL schema and seed files using the `pg` client or psql:
```bash
# 1. Connect to PostgreSQL and create the database
psql -U postgres -c "CREATE DATABASE skydesk;"

# 2. Run the table schema definitions
psql -U postgres -d skydesk -f backend/src/database/schema.sql

# 3. Seed initial data (airports, flights, offers)
psql -U postgres -d skydesk -f backend/src/database/seed.sql
```

---

## 4. Local Development

Start both packages directly from the root repository directory using workspace scripts:

### Start Frontend Dev Server
```bash
npm run dev:frontend
```
*Runs the React application on [http://localhost:5173](http://localhost:5173).*

### Start Backend API Server
```bash
npm run dev:backend
```
*Runs the Express server with Nodemon on [http://localhost:5000](http://localhost:5000).*

---

## 5. Deployment

### Database (Supabase)
1. Provision a free PostgreSQL database on [Supabase](https://supabase.com/).
2. Run `backend/src/database/schema.sql` and `backend/src/database/seed.sql` in the Supabase SQL editor to initialize tables and populate seed data.
3. Retrieve the Connection String (`DATABASE_URL`) from your Supabase Project Settings.

### Backend (Render)
1. Create a new Web Service on [Render](https://render.com/) pointing to this repository.
2. Set the root directory to `backend/` and build/start commands:
   * **Build Command**: `npm install`
   * **Start Command**: `npm start`
3. Configure the environment variables (`DATABASE_URL`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `NODE_ENV=production`, `FRONTEND_URL`).

### Frontend (Vercel)
1. Deploy a new project on [Vercel](https://vercel.com/) pointing to this repository.
2. Select the `frontend/` directory as the project root.
3. Configure the build environment variable `VITE_API_URL` to point to your Render backend URL (e.g. `https://your-backend.onrender.com/api`).
