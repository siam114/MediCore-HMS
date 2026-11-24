# 🏥 MediCore HMS – Backend API

RESTful API backend for **MediCore – Hospital Management System**, built with Node.js, Express.js, TypeScript, and native MongoDB Driver.

---

## 🚀 Features

- **Native MongoDB Driver**: Direct, high-performance database connectivity via `MongoClient` without ODM overhead.
- **Role-Based Access Control (RBAC)**: Support for `ADMIN`, `DOCTOR`, `STAFF`, and `PATIENT`.
- **JWT Authentication**: JSON Web Tokens for stateless authentication.
- **Password Hashing**: `bcryptjs` with auto-salting on user creation/updates.
- **Input Validation**: Request validation powered by `zod`.
- **CORS & Security**: Configured for Next.js frontend with credentials support.
- **Centralized Error Handling**: Unified API responses and HTTP status codes.

---

## 📁 Architecture Overview

```
backend/
├── src/
│   ├── config/
│   │   ├── db.ts               # MongoDB Mongoose connection handler
│   │   └── env.ts              # Type-safe environment variables
│   ├── constants/
│   │   └── roles.ts            # User roles (ADMIN, DOCTOR, STAFF, PATIENT)
│   ├── controllers/
│   │   └── auth.controller.ts  # Register, Login, GetMe, Logout handlers
│   ├── middlewares/
│   │   ├── auth.middleware.ts  # JWT verify & RBAC authorize middlewares
│   │   ├── error.middleware.ts # Global error handling
│   │   └── validate.middleware.ts # Zod request body validation
│   ├── models/
│   │   └── user.model.ts       # Mongoose User model with password hashing
│   ├── routes/
│   │   ├── auth.routes.ts      # Authentication routes
│   │   └── index.ts            # Root API router & /health endpoint
│   ├── services/
│   │   └── auth.service.ts     # Business logic for auth workflows
│   ├── types/
│   │   └── index.ts            # Express Request extensions & interfaces
│   ├── utils/
│   │   └── jwt.utils.ts        # Sign & verify JWT tokens
│   ├── validations/
│   │   └── auth.validation.ts  # Zod schemas for register & login
│   ├── app.ts                  # Express application setup
│   └── server.ts               # Server startup & DB connection listener
├── .env.example                # Sample environment variables
├── package.json
└── tsconfig.json
```

---

## 📡 API Endpoints

### 1. Health Check
- **`GET /api/health`**
  - Response:
    ```json
    {
      "success": true,
      "message": "MediCore HMS API is running",
      "database": "connected",
      "timestamp": "2026-11-20T16:00:00.000Z"
    }
    ```

### 2. Authentication (`/api/auth`)
- **`POST /api/auth/register`**
  - **Body**:
    ```json
    {
      "name": "Dr. Rahim Ahmed",
      "email": "dr.rahim@medicore.com",
      "password": "Password123",
      "role": "DOCTOR",
      "phone": "+8801700000000"
    }
    ```
  - **Response (201 Created)**:
    ```json
    {
      "success": true,
      "message": "Registration successful",
      "data": {
        "user": {
          "id": "67...",
          "name": "Dr. Rahim Ahmed",
          "email": "dr.rahim@medicore.com",
          "role": "DOCTOR",
          "status": "ACTIVE"
        },
        "token": "eyJhbGciOi..."
      }
    }
    ```

- **`POST /api/auth/login`**
  - **Body**:
    ```json
    {
      "email": "dr.rahim@medicore.com",
      "password": "Password123"
    }
    ```
  - **Response (200 OK)**:
    ```json
    {
      "success": true,
      "message": "Login successful",
      "data": {
        "user": { ... },
        "token": "eyJhbGciOi..."
      }
    }
    ```

- **`GET /api/auth/me`** *(Protected - Requires `Authorization: Bearer <token>`)*
  - Returns authenticated user's profile.

- **`POST /api/auth/logout`**
  - Clears auth session.

---

## 🛠️ How to Run

1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```

2. Configure environment variables in `.env` based on `.env.example`:
   Set up your private database connection string and authentication secrets (excluded from Git).

3. Start development server (with hot-reload):
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   npm start
   ```
