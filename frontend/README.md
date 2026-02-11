# Frontend - Online Course Management Platform

React application built with Vite for the student, instructor, admin, and analyst dashboards.

## Prerequisites
- Node.js 18+ and npm.

## Setup
```bash
npm install
```

Create a `.env` file in [frontend/.env](frontend/.env):
```dotenv
VITE_API_URL=http://localhost:5000/api
```

## Run
```bash
npm run dev
```

The app runs on `http://localhost:5173` by default.

## Build and Preview
```bash
npm run build
npm run preview
```

## Available Scripts
- `npm run dev` starts the Vite dev server.
- `npm run build` builds the production bundle.
- `npm run preview` serves the build locally.
- `npm run lint` runs ESLint.

## Structure
- [src/pages](src/pages): role-based pages and dashboards.
- [src/api](src/api): API services for backend endpoints.
- [src/styles](src/styles): global and role-specific styles.
