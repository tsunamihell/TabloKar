# Proposal: Setup Core Infrastructure, Authentication, and Shop Settings

## Why

To establish the foundational runtime, local database, and security layer for the TabloKar workshop management system, enabling multi-user access across the shop's local network (LAN) with role-based permissions and customizable shop identity.

## What Changes

- Initialize full-stack TypeScript workspace with React (Vite, Tailwind CSS, Vazirmatn font) and Node.js/Express.
- Configure embedded SQLite database with Prisma ORM, foreign keys, and WAL mode.
- Implement authentication and session management with bcrypt password hashing.
- Seed default roles: Admin (مدیر), Sales (پذیرش/فروش), Designer (طراح), Workshop (کارگاه/تولید), Installer (نصاب), and Cashier (امور مالی/صندوق).
- Implement initial shop profile and operational settings (name, contact details, logo placeholder, default currency in Toman, and base pricing catalog).
- Provide local execution scripts (`run-tablokar.bat`) for single-click launch on Windows without internet dependency.

## Capabilities

### New Capabilities
- `user-auth`: Local authentication, password security, session handling, and role-based access control.
- `shop-settings`: Workshop profile management, currency & regional formatting, and base product/service catalog settings.

### Modified Capabilities
*(None - initial change)*

## Impact

- Core workspace scaffolding (root, `client`, `server`, and shared types).
- Database migrations for `User`, `Role`, `Permission`, `ShopSetting`, and `ProductTypeCatalog`.
- Local HTTP API endpoints for auth (`/api/auth/*`) and settings (`/api/settings/*`).
- Base responsive UI shell with RTL layout, Persian typography, navigation sidebar, and auth gate.

