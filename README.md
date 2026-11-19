<div align="center">

# 🏥 MediCore – Hospital Management System

**An enterprise-grade Hospital Management System architecture built with Next.js, TypeScript, and Tailwind CSS.**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-UI_Primitives-black?style=flat-square)](https://ui.shadcn.com/)
[![Status](https://img.shields.io/badge/Status-Initial_Setup_Complete-brightgreen?style=flat-square)](#)

</div>

---

## 📌 Project Summary

MediCore HMS is designed to handle hospital operations including patient registration, doctor schedules, appointment management, billing, and lab records. The repository is partitioned into independent frontend and backend workspaces for maintainability and scalability.

---

## 🏗️ System Architecture

```
MediCore/
├── frontend/                  # Next.js frontend workspace
│   ├── src/
│   │   ├── app/               # App Router pages and root layout
│   │   ├── components/        # ui, shared, and layout component library
│   │   ├── config/            # Site metadata and environment configuration
│   │   ├── constants/         # Storage keys, routes, and endpoints
│   │   ├── hooks/             # Reusable custom React hooks
│   │   ├── lib/               # Utility functions and Zod validations
│   │   ├── services/api/      # HTTP client configured for REST/JWT backend
│   │   ├── store/             # Zustand application state management
│   │   ├── types/             # TypeScript definitions and API interfaces
│   │   ├── providers/         # Global application providers and Sonner toaster
│   │   └── mock-data/         # Test fixtures and mock datasets
│   ├── .env.example           # Environment variables blueprint
│   ├── package.json           # Dependencies and project scripts
│   └── tsconfig.json          # Strict TypeScript compiler options
├── backend/                   # Node.js / Express.js REST API (Upcoming)
├── .gitignore                 # Root ignore for environment and build files
└── README.md                  # Project documentation
```

---

## 💻 Frontend Technology Stack

| Technology | Purpose |
| :--- | :--- |
| **Next.js 16** | Server/Client rendering, App Router, metadata management |
| **TypeScript** | Strict type safety across components and services |
| **Tailwind CSS v4** | Modern theme styling with OKLCH variables |
| **shadcn/ui** | Accessible UI primitives built on Radix / Base UI |
| **Zustand** | Lightweight global client state management |
| **TanStack React Table** | High-performance headless data tables |
| **React Hook Form + Zod** | Controlled form workflows with schema validation |
| **Recharts** | Medical metrics and analytics charts |
| **Sonner** | Clean toast notifications for user interactions |
| **date-fns** | Medical scheduling and timestamp formatting |

---

## ⚡ Quick Start Guide

### Prerequisites
- Node.js (version 20 or higher)
- npm package manager

### Steps to Run Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/siam114/MediCore-HMS.git
   cd MediCore-HMS/frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment:**
   ```bash
   cp .env.example .env.local
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```
   *(On Windows PowerShell, if script execution is restricted, run `npm.cmd run dev`)*

5. **Open in browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📋 Available Commands

Inside the `frontend` folder:

- `npm run dev`: Launch local Next.js development server
- `npm run build`: Compile and optimize production build
- `npm run start`: Serve built production artifacts
- `npm run lint`: Perform ESLint code quality checks
- `npx tsc --noEmit`: Execute full TypeScript type validation

---

## 🎯 Development Roadmap

- [x] Initial Next.js + TypeScript environment setup
- [x] Complete directory structure and core utilities
- [x] REST API client setup with JWT auth header preparation
- [ ] Backend workspace initialization (Node.js, Express, MongoDB)
- [ ] Authentication and Role-Based Access Control (Admin, Doctor, Staff, Patient)
- [ ] Appointment scheduling and patient management modules
- [ ] Hospital billing, prescription, and pharmacy management
