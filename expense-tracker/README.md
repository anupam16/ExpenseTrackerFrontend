# Expense Tracker Frontend

Frontend for a JWT-authenticated expense tracker built with React, TypeScript, Vite, Tailwind CSS, React Query, React Router, and Zod.

## Features

- Authentication: login, register, logout
- Protected routing: home page accessible only for authenticated users
- Access-token refresh flow for protected API calls
- Add entry modal with mode toggle:
  - Expense creation
  - Income creation
- Year dropdown + month tabs filtering
- Dynamic dashboard cards:
  - Monthly Income
  - Monthly Expense
  - Balance (Income - Expense)
- Expense chart section
- AI summary block with loading skeleton
- Navbar profile section using `/api/auth/me`

## Tech Stack

- React 19
- TypeScript
- Vite 8
- Tailwind CSS 4
- React Router DOM
- TanStack React Query
- Zod

## Project Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Create a `.env` file in the project root:

```bash
VITE_API_BASE_URL=http://localhost:5000
```

If omitted, the app defaults to `http://localhost:5000`.

### 3. Start development server

```bash
npm run dev
```

### 4. Build for production

```bash
npm run build
```

### 5. Preview production build

```bash
npm run preview
```

## Available Scripts

- `npm run dev` - start Vite dev server
- `npm run build` - TypeScript build + Vite production build
- `npm run lint` - run ESLint
- `npm run preview` - preview production build locally

## API Endpoints Used

### Auth

- `POST /api/auth/login`
- `POST /api/auth/register`
- `POST /api/auth/logout`
- `POST /api/auth/refresh-token`
- `GET /api/auth/me`

### Expenses

- `POST /api/expenses`
- `GET /api/expenses?year=YYYY`
- `GET /api/expenses/summary?month=YYYY-MM`

### Income

- `POST /api/income`
- `GET /api/income?year=YYYY`

## Folder Highlights

- `src/features/auth` - auth types, API, hooks, pages, storage
- `src/features/expenses` - expense types, API, hooks, schemas
- `src/features/income` - income types, API, hooks, schemas
- `src/components` - navbar, modal, dashboard, month tabs, chart area
- `src/pages/Home.tsx` - main dashboard orchestration and filtering logic

## Notes

- Protected API requests use a shared authenticated fetch utility.
- On `401`, the app attempts token refresh and retries the request once.
- If refresh fails, session is cleared and user is treated as logged out.
