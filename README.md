# 🏥 MediCore – Enterprise Hospital Management System (HMS)

> A modern, full-stack Hospital Management System built with **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS v4**, **Node.js**, **Express.js**, and native **MongoDB Driver (v7)**.

[![Next.js](https://img.shields.io/badge/Next.js-16.4-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.3-blue?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-v20-green?style=flat-square&logo=node.js)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-v5-black?style=flat-square&logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas_v7-47A248?style=flat-square&logo=mongodb)](https://www.mongodb.com/)

---

## 📋 System Overview

**MediCore HMS** is an integrated hospital information management platform designed for tertiary care hospitals, multi-specialty clinics, and research healthcare centers. It provides patient registration, clinical roster management, real-time consultation serial booking, digital doctor consultation pads, and automated official e-prescriptions with direct PDF generation.

---

## ✨ Implemented Core Modules

### 1. 🔐 Role-Based Authentication & Authorization (RBAC)
- Multi-tier role permissions: **`ADMIN`**, **`DOCTOR`**, **`PATIENT`**, and **`STAFF`**.
- Stateless authentication with signed **JWT (Bearer tokens)**.
- Secure password hashing using **`bcryptjs`** with auto-salting.
- Zod schema validation across all authentication endpoints.
- Role-protected client-side dashboard views and server-side route guards.

### 2. 👨‍⚕️ Specialist Physician & Chamber Directory
- Public directory of international hospital consultants across 15+ specialties.
- Search engine filtering by physician name, symptom, clinical department, and chamber.
- Detailed doctor profiles with qualifications, consultation fees, chamber room, and visiting hours.
- Admin portal to add, update, and manage hospital medical consultants.

### 3. 🎫 Real-Time Appointment & Serial Booking System
- Dynamic serial token generation (e.g., `#01`, `#02`, `#03` for the consultation day).
- Live chamber schedule validation preventing overbooking.
- Printable digital appointment token slip with QR/reference code and visiting instructions.
- Real-time status lifecycle: `CONFIRMED` ➔ `COMPLETED` ➔ `CANCELLED`.
- Patient dashboard integration to view scheduled doctor visits and tokens.

### 4. 📝 Doctor Consultation & Digital Prescription System (E-Prescription Pad)
- Dedicated doctor consultation pad interface with live patient queue.
- Patient clinical vitals entry (Blood Pressure, Pulse Rate, Body Temperature, Weight).
- Primary diagnosis, presenting symptoms, and diagnostic laboratory test recommendations.
- Dynamic **℞ (Rx)** medication table with dosage frequency (`1+0+1`), duration, and dietary instructions.
- Auto-completion of linked appointments upon issuing an official prescription.
- **Direct Vector PDF Download**: Instant client-side PDF document generation (`Prescription_RX-XXXXX.pdf`) with zero external dependencies.
- **Single-Sheet A4 Native Printing**: Standardized letterhead prescription pad fitting on 1 A4 page with hospital branding, doctor credentials, and digital verification seal.

---

## 🏗️ Project Architecture

```
MediCore-HMS/
├── frontend/                        # Next.js 16 Web Client
│   ├── src/
│   │   ├── app/                     # Next.js App Router (Home, Doctors, Dashboard, Auth)
│   │   ├── components/
│   │   │   ├── appointments/        # Appointment booking modal & printable slips
│   │   │   ├── prescriptions/       # E-Prescription consultation pad & PDF viewer
│   │   │   └── ui/                  # Reusable UI primitives (Button, Card, Badge, Input)
│   │   ├── services/api/            # Modular Axios API clients (Auth, Doctor, Appointment, Rx)
│   │   ├── store/                   # Zustand authentication & session store
│   │   ├── types/                   # TypeScript interfaces & API payload schemas
│   │   └── lib/                     # Tailwind merge & utility functions
│   ├── .env.example                 # Frontend environment blueprint
│   ├── package.json
│   └── tsconfig.json
│
├── backend/                         # Node.js & Express REST API
│   ├── src/
│   │   ├── config/                  # Native MongoDB driver connection & DB indexes
│   │   ├── constants/               # System roles and clinical departments
│   │   ├── controllers/             # Express request/response controllers
│   │   ├── middlewares/             # JWT auth guard, RBAC authorization, error handler
│   │   ├── models/                  # Native MongoDB collection models & typed documents
│   │   ├── routes/                  # Express route routers
│   │   ├── services/                # Business logic & database operations
│   │   └── validations/             # Zod input validation schemas
│   ├── .env.example                 # Backend environment blueprint
│   ├── package.json
│   └── tsconfig.json
│
├── .gitignore                       # Repository-wide ignore rules (secrets, env, builds)
└── README.md                        # Project documentation
```

---

## 💻 Tech Stack

| Domain | Technology | Description |
| :--- | :--- | :--- |
| **Frontend Framework** | Next.js 16.4 (App Router) | Server Components & Client Components |
| **UI Library** | React 19.3 | Component architecture |
| **Styling** | Tailwind CSS v4 | Utility-first responsive CSS styling |
| **UI Components** | shadcn/ui & @base-ui/react | Accessible design primitives |
| **State Management** | Zustand 5.1 | Client authentication and user session state |
| **PDF Generation** | jsPDF | Pure client-side vector prescription document export |
| **Icons & Alerts** | Lucide React & Sonner | Crisp icons and toast notifications |
| **Backend Runtime** | Node.js v20 | Server-side JavaScript runtime |
| **Web Framework** | Express.js | RESTful HTTP API services |
| **Database** | MongoDB Atlas (Native v7) | Direct `MongoClient` without ODM overhead |
| **Validation** | Zod | Runtime schema validation |
| **Language** | TypeScript 5 | Strict static typing across entire stack |

---

## 🚀 Quick Setup & Installation

### 1. Prerequisites
- **Node.js**: v20 or higher
- **npm** or **pnpm**
- **MongoDB**: Local MongoDB instance or free MongoDB Atlas cloud cluster

---

### 2. Backend Setup

1. Open a terminal and navigate to `backend`:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file from the example:
   ```bash
   cp .env.example .env
   ```

4. Configure your `.env` variables:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://127.0.0.1:27017/medicore_hms
   JWT_SECRET=your_secure_jwt_secret_key_here
   JWT_EXPIRES_IN=7d
   CLIENT_URL=http://localhost:3000
   ```

5. Start the backend development server:
   ```bash
   npm run dev
   ```
   *The API will be running at `http://localhost:5000`.*

---

### 3. Frontend Setup

1. Open a second terminal and navigate to `frontend`:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env.local` file from the example:
   ```bash
   cp .env.example .env.local
   ```

4. Configure your `.env.local`:
   ```env
   NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
   ```

5. Start the frontend development server:
   ```bash
   npm run dev
   ```
   *The application will be accessible at `http://localhost:3000`.*

---

## 📡 REST API Reference

### Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new patient or staff user |
| `POST` | `/api/auth/login` | Public | User authentication returning JWT token |
| `GET` | `/api/auth/me` | Authenticated | Retrieve authenticated user profile |
| `GET` | `/api/auth/users` | Admin | Get list of all registered system accounts |

### Doctor Management (`/api/doctors`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/doctors` | Public | Search and filter doctors by department/query |
| `GET` | `/api/doctors/departments` | Public | List summary of active clinical departments |
| `GET` | `/api/doctors/profile/me` | Doctor | Get doctor profile for current logged-in user |
| `GET` | `/api/doctors/:id` | Public | Get detailed profile of specific physician |
| `POST` | `/api/doctors` | Admin | Register new doctor and create login credentials |
| `PUT` | `/api/doctors/:id` | Admin / Doctor | Update doctor details, fee, or schedule |
| `DELETE` | `/api/doctors/:id` | Admin | Remove doctor from hospital registry |

### Appointments & Serials (`/api/appointments`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/appointments` | Public / Patient | Book consultation serial & receive token |
| `GET` | `/api/appointments/my` | Patient | Get patient's booked appointments |
| `GET` | `/api/appointments/doctor/:doctorId` | Doctor / Admin | Get doctor chamber queue for date |
| `GET` | `/api/appointments` | Admin / Staff | Global hospital appointment registry |
| `PATCH` | `/api/appointments/:id/status` | Staff / Doctor | Update status (`COMPLETED`, `CANCELLED`) |

### Digital Prescriptions (`/api/prescriptions`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/prescriptions` | Doctor / Admin | Generate e-prescription & complete appointment |
| `GET` | `/api/prescriptions/my` | Patient | Retrieve patient prescription history |
| `GET` | `/api/prescriptions/doctor/:doctorId` | Doctor / Admin | Get all prescriptions authored by physician |
| `GET` | `/api/prescriptions/:id` | Authenticated | Get prescription details for view and print |
| `GET` | `/api/prescriptions` | Admin / Staff | Central electronic prescription repository |

---

## 🔒 Security Best Practices

- **Zero Hardcoded Secrets**: All sensitive keys, connection URIs, and tokens are read exclusively through environment variables (`.env`).
- **Git Protection**: Sensitive configuration files (`.env`, `.env.local`, credentials, and private notes) are strictly excluded via `.gitignore`.
- **Database Safety**: Parameterized MongoDB native queries and Zod input validation prevent NoSQL injection and malformed payloads.
- **Stateless Tokens**: JWTs are verified cryptographically with expiration timestamps.

---

## 📄 License & Credits

Developed with precision for modern healthcare delivery.  
© 2026 MediCore Hospitals. All rights reserved.
