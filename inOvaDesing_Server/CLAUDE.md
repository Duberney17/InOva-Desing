# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
npm run start:dev       # Start with hot-reload (watch mode)
npm run start:debug     # Start with debugger + watch mode
npm run start:prod      # Run compiled production build

# Build
npm run build           # Compile TypeScript via NestJS CLI

# Testing
npm run test            # Run all unit tests
npm run test:watch      # Run tests in watch mode
npm run test:cov        # Run tests with coverage report
npm run test:e2e        # Run end-to-end tests
# Run a single test file:
npx jest src/ovas/ovas.service.spec.ts

# Code quality
npm run lint            # ESLint with auto-fix
npm run format          # Prettier formatting
```

The server runs on port 3000 by default (overridable via `PORT` env var).
Swagger UI is available at `http://localhost:3000/api`.

## Architecture

This is a **NestJS** REST API server for **inOvaDesign** — a platform for creating OVAs (Objetos Virtuales de Aprendizaje / Virtual Learning Objects). It uses **MongoDB** via `@nestjs/mongoose` and exposes a **Swagger** API.

### Domain Structure

The domain is organized around two main concerns:

**OVA Lifecycle (ADDIE model phases):**
- `ovas` — Core OVA entity (title, description, state)
- `analysis-phase` — Problem, objectives, context analysis
- `design-phase` — OVA instructional design
- `development-phase` — Content development
- `implentation-phase` — Deployment phase (note: intentional typo in folder/module name — `implentation`, not `implementation`)
- `evaluation-phase` — Assessment and evaluation

**OVA Content & Assessment:**
- `form` / `question` / `answer` — Quiz/form structure hierarchy
- `resource-ova` — Learning resources (exposed as `LearningResource` internally)
- `instructor-eval` — Instructor evaluations
- `user-progress` — Tracks user progress through OVAs

**SCORM Packaging (learning object standard):**
- `scorm-package` → `scorm-manifest` → `scorm-organization` → `sco` → `scorm-resource`
- `lom-metadata` — Learning Object Metadata (LOM standard)

**Users:**
- `users` — User accounts with roles (`rol: string[]`), email, password

### Module Pattern

Every feature module follows the same structure:
```
src/<module-name>/
  <module-name>.module.ts      # Registers Mongoose schema, declares controller/service
  <module-name>.controller.ts  # REST endpoints: POST, GET, GET/:id, PATCH/:id, DELETE/:id
  <module-name>.service.ts     # Business logic using @InjectModel
  schemas/<name>.schema.ts     # Mongoose @Schema class + SchemaFactory
  dto/create-<name>.dto.ts
  dto/update-<name>.dto.ts
  entities/<name>.entity.ts    # Currently empty placeholder classes
  <name>.controller.spec.ts
  <name>.service.spec.ts
```

### Database

MongoDB Atlas is used. The connection string is currently hardcoded in `src/app.module.ts` — it should be moved to an environment variable via `@nestjs/config`.

All schemas use `{ timestamps: true }` so `createdAt` and `updatedAt` fields are automatically added by Mongoose.

Relations between documents are handled via string ID references (e.g., `idOVA: string` on phase documents), not Mongoose `ref`/`populate`.
