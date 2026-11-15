# Tasks: Core Setup, Authentication, and Shop Settings

## 1. Project Scaffolding & Database Setup

- [x] 1.1 Initialize multi-package workspace structure (`package.json`, `client/`, `server/`) and verify dependencies install cleanly.
- [x] 1.2 Configure Prisma with SQLite schema (`User`, `Role`, `ShopSetting`, `ProductTypeCatalog`) and verify migration creates SQLite tables.
- [x] 1.3 Create database seed script (`server/prisma/seed.ts`) with default roles (Admin, Sales, Designer, Workshop, Installer, Cashier), default admin user, and workshop settings (چاپ آبرنگ میناب) and verify seed execution.

## 2. Server API & Authentication

- [x] 2.1 Implement password hashing utility with bcrypt and verify password hash & verification unit tests pass.
- [x] 2.2 Implement authentication controller (`/api/auth/login`, `/api/auth/me`, `/api/auth/logout`) with session/token cookie handling and verify successful & failed login tests.
- [x] 2.3 Implement role-based authorization middleware and verify 403 response for unauthorized role access.
- [x] 2.4 Implement shop settings endpoints (`GET /api/settings`, `PUT /api/settings`) and verify settings persistence.

## 3. Frontend Shell & Authentication Flow

- [x] 3.1 Setup React app with Tailwind CSS, RTL layout (`dir="rtl"`), and Vazirmatn Persian typography.
- [x] 3.2 Implement authentication context, login page, and protected route wrapper, verifying redirection for unauthenticated requests.
- [x] 3.3 Implement dashboard layout with Persian sidebar navigation, active user indicator, and role-based menu filtering.
- [x] 3.4 Implement shop settings view for Admin to edit workshop profile and verify updates render across the application.

## 4. Verification & Windows Execution

- [x] 4.1 Create `run-tablokar.bat` for one-click startup on Windows and verify server and client launch correctly.
- [x] 4.2 Verify acceptance criteria: log in as Admin, change shop name, log out, attempt invalid password, log in as restricted role (Installer), and verify permissions.

