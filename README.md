# Online Course Management Platform

Full-stack web application for managing courses, enrollments, and role-based dashboards for students, instructors, admins, and analysts.

## Features
- Role-based authentication and authorization (student, instructor, admin, analyst).
- Course catalog, enrollment, and course management.
- Instructor tools for grading and course content management.
- Analyst dashboards and reporting exports.
- Admin management of users, universities, and textbooks.

## Tech Stack
- Backend: Node.js, Express, PostgreSQL, JWT auth.
- Frontend: React, Vite, React Router, Chart.js.

## Prerequisites
- Node.js 18+ and npm.
- PostgreSQL 14+ (local or hosted).

## Setup

### 1) Backend
```bash
cd backend
npm install
```

Create a `.env` file in [backend/.env](backend/.env) and set the database and app values:
```dotenv
DB_USER=your_db_user
DB_HOST=localhost
DB_PORT=5432
DB_NAME=your_db_name
DB_PASSWORD=your_db_password
DATABASE_URL=
FRONTEND_URL=http://localhost:5173
PORT=5000
NODE_ENV=development
JWT_SECRET=change_me
JWT_EXPIRY=7d
```

Notes:
- Use `DATABASE_URL` for a hosted database, or the `DB_*` variables for local PostgreSQL.
- `FRONTEND_URL` is required for CORS.

### 2) Database
Run the schema and seed scripts:
```bash
# From your SQL client or psql, run in order:
backend/db/schema.sql
backend/db/insertData.sql
```

### 3) Frontend
```bash
cd frontend
npm install
```

Create a `.env` file in [frontend/.env](frontend/.env):
```dotenv
VITE_API_URL=http://localhost:5000/api
```

## Run the App

### Backend
```bash
cd backend
npm run dev
```

### Frontend
```bash
cd frontend
npm run dev
```

Open `http://localhost:5173` in your browser.

## API Routes
Base URL: `http://localhost:5000/api`
- `/auth`
- `/public`
- `/courses`
- `/student`
- `/instructor`
- `/admin`
- `/analyst`

## Project Structure
- [backend](backend): Express API and PostgreSQL access.
- [frontend](frontend): React UI and dashboards.

## Scripts
Backend:
- `npm run dev` starts the API with nodemon.
- `npm start` starts the API with node.

Frontend:
- `npm run dev` starts the Vite dev server.
- `npm run build` builds for production.
- `npm run preview` serves the production build locally.
