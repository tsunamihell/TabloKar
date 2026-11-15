# Contributing to TabloKar

Thank you for your interest in contributing to TabloKar! TabloKar is an open-source workshop management platform designed for signage, fabrication, and custom craft workshops.

## Getting Started

1. Fork the repository on GitHub.
2. Clone your fork locally:
   ```bash
   git clone https://github.com/<your-username>/TabloKar.git
   cd TabloKar
   ```
3. Install dependencies:
   ```bash
   npm ci
   ```
4. Copy the environment configuration:
   ```bash
   cp server/.env.example server/.env
   ```
5. Generate the Prisma database client and run migrations:
   ```bash
   npm run prisma:generate --workspace=server
   npm exec --workspace=server -- prisma migrate deploy
   npm run prisma:seed --workspace=server
   ```

## Development & Testing

- **Start dev server:** `npm run dev`
- **Run automated tests:** `npm test`
- **Build assets:** `npm run build`

Before submitting a Pull Request, ensure that all tests pass cleanly (`npm test`) and that your TypeScript code compiles without errors (`npm run build`).

## Pull Request Guidelines

- Create a feature branch with a descriptive name (`git checkout -b feat/order-lifecycle`).
- Commit messages should follow conventional commits (`feat: ...`, `fix: ...`, `docs: ...`).
- If you are modifying architectural specifications, update the corresponding OpenSpec files in `openspec/`.
