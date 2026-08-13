# Pennywise Web

The frontend application for **Pennywise**, a personal finance management platform that helps users track income, expenses, transactions, and understand their financial activity through a clean and intuitive interface.

Built with React and Vite, the application communicates with the Pennywise Spring Boot backend through a REST API.

## Tech Stack

- React
- Vite
- JavaScript (JSX)
- Tailwind CSS
- shadcn/ui
- React Router
- TanStack Query
- Zustand
- Zod
- Lucide React
- pnpm

## Features

- User registration and authentication
- Protected and guest-only routes
- Automatic access-token refresh
- Persistent authentication through HTTP-only cookies
- Dashboard
- Transaction management
- Income and expense tracking
- Financial data visualization
- Responsive UI
- Light and dark theme support

## Project Structure

```text
src/
├── assets/
├── components/
│   ├── layout/
│   ├── common/
│   └── ui/
├── features/
│   └── auth/
├── layouts/
├── lib/
│   ├── api/
│   └── query-client.js
├── pages/
│   ├── auth/
│   └── app/
├── routes/
├── App.jsx
├── index.css
└── main.jsx
```
