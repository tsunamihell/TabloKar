# Technical Design: Core Setup, Authentication, and Shop Settings

## Context

See `proposal.md` for background and motivation. The system operates primarily in an offline or local area network (LAN) inside the signboard workshop on a Windows host machine.

## Goals / Non-Goals

**Goals:**
- Single-command startup on Windows (`run-tablokar.bat` or `npm run dev`).
- Robust zero-configuration embedded database (SQLite) using Prisma ORM.
- Secure, server-validated role-based authentication without requiring internet connectivity.
- Responsive, RTL-first Arabic/Persian user interface utilizing Vazirmatn font.
- Default seeding for Tablosazi Abrand (چاپ آبرنگ میناب) and predefined user roles.

**Non-Goals:**
- Cloud-hosted database or remote OAuth providers (Google/GitHub login).
- Full accounting double-entry ledger in this stage.
- Live internet sync or SMS gateway integrations (deferred to later phases).

## Decisions

### 1. Project Organization
- **Choice**: Multi-package workspace with `client/` (Vite + React) and `server/` (Express + TypeScript + Prisma).
- **Rationale**: Clean separation of concerns, fast frontend HMR with Vite, simple build scripts, and direct sharing of TypeScript interfaces.
- **Alternatives considered**: Next.js full-stack (heavier build process and potential caching/standalone deployment quirks on local Windows networks).

### 2. Embedded Database & ORM
- **Choice**: SQLite with Prisma in WAL (Write-Ahead Logging) mode.
- **Rationale**: Requires no background daemon installation on Windows, portable single-file database (`tablokar.db`), straightforward backups, and instant migration path to PostgreSQL via Prisma if scaling to cloud later.
- **Alternatives considered**: PostgreSQL (requires installing and managing Postgres service on Windows host).

### 3. Authentication & Password Security
- **Choice**: HttpOnly cookie / Bearer token session authentication with `bcryptjs` hashing (10 salt rounds).
- **Rationale**: Simple, secure across LAN browsers, resistant to XSS token theft, works fully offline.
- **Alternatives considered**: Plain JWT in localStorage (vulnerable to XSS).

### 4. UI Framework & Typography
- **Choice**: Tailwind CSS with RTL plugin, Lucide React icons, and `@fontsource/vazirmatn`.
- **Rationale**: Standardized utility classes, clean aesthetics, and native right-to-left layout alignment.

## Risks / Trade-offs

- **[Risk] Multiple LAN users writing concurrently to SQLite** → **Mitigation**: Enable WAL mode (`PRAGMA journal_mode=WAL;`) and configure appropriate SQLite busy timeout (5000ms).
- **[Risk] Forgotten admin password on local machine** → **Mitigation**: Provide CLI reset command (`npm run reset-admin`) runnable directly in the host terminal.

## Migration Plan

1. Initialize repository root and project scaffolding.
2. Setup Prisma schema with models: `User`, `Role`, `ShopSetting`, and `ProductTypeCatalog`.
3. Run initial Prisma migration creating SQLite database.
4. Execute database seed script inserting default roles, admin user, and workshop settings.
5. Provide Windows batch script for automated development launch.

