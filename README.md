# TabloKar (تابلوکار)

[![Tests: 26 Passed](https://img.shields.io/badge/tests-26%20passed-brightgreen.svg)](#-testing--verification)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6.svg?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB.svg?logo=react)](https://react.dev/)
[![Prisma](https://img.shields.io/badge/Prisma-SQLite-2D3748.svg?logo=prisma)](https://www.prisma.io/)

**TabloKar** is an open-source, modular Workshop & Production Management System (ERP/MES) purpose-built for custom signage, laser cutting, acrylic fabrication, and metalcraft workshops.

It provides micro-enterprises and artisan workshops with an accessible, lightweight alternative to monolithic enterprise software, covering user roles, shop configuration, catalog pricing, and end-to-end order lifecycles.

---

## 🌟 Key Highlights

- **Role-Based Access Control (RBAC):** Granular permissions for Workshop Administrators, Operators, and Field Installers.
- **Parametric Workshop Catalog:** Dynamic material and labor pricing engines adapted to custom dimensions, substrates, and lighting setups.
- **Contract-Driven Evolution:** Built using [OpenSpec](openspec/) to ensure rigorous, traceable schema and workflow changes.
- **Comprehensive Test Coverage:** 26+ automated regression, acceptance, and security unit tests validating database migrations, permission boundaries, and session handling.
- **Lightweight & Self-Hostable:** Single-command setup using SQLite with zero external database dependencies.

---

## 🏗️ Architecture

```
TabloKar
├── client/              # React 18 SPA (Vite, Tailwind CSS, TypeScript)
├── server/              # Express API (TypeScript, Prisma ORM, SQLite)
│   ├── prisma/          # Database schema, migrations, and seeding scripts
│   └── src/             # Controllers, middlewares, and business logic
├── openspec/            # Architectural change proposals and specifications
├── docs/                # Architecture decisions, audit logs, and guidelines
└── .github/workflows/   # Continuous Integration (CI) automated workflows
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v20+ recommended)
- **npm** (v9+)

### Installation & Launch

1. Clone the repository:
   ```bash
   git clone https://github.com/tsunamihell/TabloKar.git
   cd TabloKar
   ```

2. Install dependencies:
   ```bash
   npm ci
   ```

3. Setup environment configuration:
   ```bash
   # On Linux / macOS:
   cp server/.env.example server/.env

   # On Windows (PowerShell):
   Copy-Item server/.env.example server/.env
   ```

4. Initialize database and seed default data:
   ```bash
   npm run prisma:generate --workspace=server
   npm exec --workspace=server -- prisma migrate deploy
   npm run prisma:seed --workspace=server
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

- **Web UI:** [http://localhost:5173](http://localhost:5173)
- **API Health Check:** [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 🧪 Testing & Verification

TabloKar features automated unit, regression, and acceptance test suites.

```bash
# Run all tests across server and client
npm test

# Build production bundles
npm run build
```

---

## 🗺️ Roadmap & Codex / AI Integration

- [x] Core Authentication, RBAC, and Session Security
- [x] Workshop Settings & Material/Service Catalog
- [ ] **AI-Assisted Cost & BOM Estimation:** Leveraging OpenAI Codex / LLMs to parse custom signage design briefs into structured bills of materials.
- [ ] **Job Queue & Shop-Floor Tracking:** Real-time production milestone tracking for CNC, laser, assembly, and field installation teams.
- [ ] **Automated Test Generation:** Maintaining contract specifications and edge-case regression tests via Codex agent workflows.

---

## 🇮🇷 راهنمای فارسی (Persian Documentation)

نسخهٔ فعلی هستهٔ مدیریت کارگاه شامل ورود کاربران، نقش‌های دسترسی، تنظیمات مغازه و نمایش کاتالوگ خدمات است.

### راه‌اندازی سریع در ویندوز:
پس از ایجاد و تنظیم فایل `server/.env`، می‌توانید فایل `run-tablokar.bat` را اجرا نمایید. این اسکریپت دیتابیس را ارتقا داده و سرور و کلاینت را به صورت خودکار اجرا می‌کند.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
