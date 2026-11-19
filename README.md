# MediCore – Hospital Management System

**MediCore HMS** is a modern, scalable Hospital Management System built with enterprise-grade architecture.

---

## 🏗️ Architecture Overview

The project is structured into modular layers designed for independent scaling:

- **`frontend/`**: Next.js 16 (App Router), TypeScript, Tailwind CSS, shadcn/ui, Zustand, TanStack Table, React Hook Form, Zod.
- **`backend/`** *(Upcoming)*: Node.js, Express.js, MongoDB, REST API, JWT Authentication.

---

## 🚀 Frontend Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript (Strict Mode)
- **Styling:** Tailwind CSS & shadcn/ui
- **State Management:** Zustand
- **Forms & Validation:** React Hook Form + Zod
- **Data Tables:** TanStack React Table
- **Charts:** Recharts
- **Icons:** Lucide React
- **Notifications:** Sonner

---

## 📁 Frontend Directory Structure

```
frontend/src/
  ├── app/                  # App Router pages and layout
  ├── components/
  │   ├── ui/               # shadcn/ui primitives
  │   ├── shared/           # Reusable UI components
  │   └── layout/           # Page and layout wrappers
  ├── config/               # App and environment configs
  ├── constants/            # Application constants and API endpoints
  ├── hooks/                # Custom React hooks
  ├── lib/
  │   ├── utils/            # Utility helpers (cn, etc.)
  │   └── validations/      # Zod validation schemas
  ├── services/
  │   └── api/              # Fetch API client with JWT support
  ├── store/                # Zustand global state
  ├── types/                # TypeScript type definitions
  ├── providers/            # Global context providers
  └── mock-data/            # Mock fixtures for testing
```

---

## 🛠️ Getting Started

### Prerequisites

- Node.js (v20+ recommended)
- npm

### Installation & Running Frontend

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```

4. Run development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📜 Available Scripts (Frontend)

- `npm run dev`: Starts the Next.js development server.
- `npm run build`: Compiles production build.
- `npm run start`: Runs the built production server.
- `npm run lint`: Executes ESLint code quality checks.
