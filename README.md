# FMS - Financial Management System

Production-ready mobile-first full-stack accounting app for a Tent House / Shamiyana business.

## Stack

- Frontend: React, Vite, TailwindCSS, React Router, Axios, React Hook Form, Framer Motion, Recharts, Lucide React
- Backend: Node.js, Express.js, MongoDB, Mongoose, JWT
- Bonus: PWA shell, offline app cache, PDF/CSV/print reports, WhatsApp sharing, multi-user roles

## Setup

### Backend

```bash
cd backend
npm install
cp .env.example .env
npm run seed
npm run dev
```

Default seed values are in `backend/.env.example`. Change `JWT_SECRET` before production.

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Open `http://localhost:5173`.

## Business Logic

- Tent House Balance = Tent House Income - Tent House Expenses - Paid Common Expenses
- Chiti Balance = Chiti Income - Chiti Expenses
- Overall Balance = Tent House Balance + Chiti Balance
- Pending common expenses are tracked but not deducted.
- Paid common expenses are automatically deducted from Tent House balance.

## API Modules

- `POST /api/auth/login`
- `GET /api/dashboard`
- `GET|POST /api/transactions`
- `PUT|DELETE /api/transactions/:id`
- `GET|POST /api/common-expenses`
- `PUT|DELETE /api/common-expenses/:id`
- `GET /api/ledgers`
- `GET /api/ledgers/:personName`
- `GET /api/reports`
- `GET /api/reports/export.csv`
- `GET|POST /api/users` for Admin

## Mobile UX

The app uses bottom navigation, floating add buttons, full-screen bottom sheets, card lists instead of dense tables, large controls, loading states, dark mode, and fast animated route transitions.
