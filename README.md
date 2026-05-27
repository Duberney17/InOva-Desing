<h1 align="center">InOva Design</h1>

<p align="center">
  <b>A full-stack educational platform for designing OVAs (Virtual Learning Objects) following the ADDIE pedagogical model.</b>
</p>

<p align="center">
  <a href="https://inovadesing.vercel.app">🌐 Live Demo</a>
  ·
  <a href="https://inova-design-api.onrender.com/api">📚 API Docs (Swagger)</a>
</p>

<p align="center">
  <img alt="React"      src="https://img.shields.io/badge/React-19-61dafb?style=flat&logo=react&logoColor=white">
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-6-3178c6?style=flat&logo=typescript&logoColor=white">
  <img alt="Vite"       src="https://img.shields.io/badge/Vite-8-646cff?style=flat&logo=vite&logoColor=white">
  <img alt="Tailwind"   src="https://img.shields.io/badge/Tailwind-v4-06b6d4?style=flat&logo=tailwindcss&logoColor=white">
  <img alt="NestJS"     src="https://img.shields.io/badge/NestJS-11-e0234e?style=flat&logo=nestjs&logoColor=white">
  <img alt="MongoDB"    src="https://img.shields.io/badge/MongoDB-Atlas-47a248?style=flat&logo=mongodb&logoColor=white">
  <img alt="JWT"        src="https://img.shields.io/badge/Auth-JWT-000000?style=flat&logo=jsonwebtokens&logoColor=white">
  <img alt="Supabase"   src="https://img.shields.io/badge/Storage-Supabase-3ecf8e?style=flat&logo=supabase&logoColor=white">
  <img alt="Deployed"   src="https://img.shields.io/badge/Deployed-Vercel%20%2B%20Render-000000?style=flat">
</p>

---

## ✨ What this project is

InOva Design helps **teachers and students** collaboratively build educational content using the **ADDIE instructional design model** (Analysis, Design, Development, Implementation, Evaluation). Students create OVAs through a guided 5-stage workflow, attach supporting files, and submit each stage for teacher review. Teachers approve or request changes with comments, and the system automatically tracks completion.

## 🚀 Key features

- 🔐 **JWT authentication** with role-based access (`student` / `teacher`)
- 👥 **Teacher–student linking** via shareable invite codes
- 📝 **5-stage ADDIE workflow** with phase-specific forms and validation
- 📁 **File uploads** to cloud storage (PDFs, images, Word, Excel)
- ✅ **Live teacher review** — approve/reject each stage with comments
- 🔁 **Automatic state machine** — OVAs transition `In progress → Finalized` when all stages are approved
- 🗑️ **Cascade delete** — removing an OVA cleans up all related records and files
- 🎨 **Responsive UI** with Tailwind v4 and a custom design system
- 🔄 **Continuous deployment** — every push to `main` redeploys both ends

## 🏗️ Architecture

```
┌────────────────────┐        ┌──────────────────┐        ┌──────────────────┐
│  Frontend (Vercel) │ ──────▶│ Backend (Render) │ ──────▶│ MongoDB Atlas    │
│  React 19 + Vite   │   HTTP │ NestJS 11 + JWT  │  Mongoose│ (5 collections)  │
│  Tailwind v4       │ ◀──────│  REST + Swagger  │ ◀──────│                  │
└────────────────────┘        └──────────────────┘        └──────────────────┘
                                       │
                                       │  S3-compatible API
                                       ▼
                              ┌──────────────────┐
                              │ Supabase Storage │
                              │  (file uploads)  │
                              └──────────────────┘
```

**Why this stack?** Separation of concerns: a stateless API serves both web (today) and mobile clients (tomorrow); a NoSQL document store fits the flexible OVA schema; Supabase keeps binary files out of the database; Vercel and Render give zero-config CI/CD.

## 🧱 Tech stack

| Layer        | Tech                                             |
|--------------|--------------------------------------------------|
| Frontend     | React 19, TypeScript, Vite, Tailwind v4, Zustand, React Hook Form, Zod, Axios, React Router |
| Backend      | NestJS 11, Mongoose, class-validator, Passport-JWT, Swagger |
| Database     | MongoDB Atlas (M0 free tier)                     |
| File storage | Supabase Storage (S3-compatible API)             |
| Hosting      | Vercel (frontend) + Render (backend)             |
| Dev tooling  | ESLint, Prettier, TypeScript strict             |

## 📁 Project structure

```
├── inOvaDesing_Server/        # NestJS API
│   ├── src/
│   │   ├── auth/              # Authentication module (JWT, guards, strategies)
│   │   ├── ovas/              # OVA CRUD + cascade delete
│   │   ├── ova-files/         # Supabase Storage integration
│   │   ├── instructor-eval/   # Teacher evaluations with auto-sync of OVA state
│   │   ├── user-progress/     # Progress tracking per OVA
│   │   └── *-phase/           # 5 ADDIE phase modules
│   └── docs/SUPABASE_STORAGE_SETUP.md
│
└── innova-design-client/      # React SPA
    └── src/
        ├── lib/               # Axios client + helpers
        ├── store/             # Zustand auth store (persisted)
        ├── router/            # Route guards
        ├── components/ui/     # Design-system primitives
        └── features/
            ├── auth/          # Login, register, role chip
            ├── dashboard/     # Student + teacher dashboards
            ├── ova/           # Create / edit / preview OVAs
            ├── ova-files/     # File uploads UI
            ├── instructor-eval/ # Teacher review panel
            └── users/         # User-related services
```

The frontend follows a **feature-based architecture**: each business capability owns its components, hooks, services, schemas and types. Cross-cutting code lives in `lib/`, `store/`, and `components/ui/`.

## 🛠️ Local development

### Prerequisites

- Node.js 22+
- A MongoDB Atlas account (or a local MongoDB instance)
- A Supabase account (free tier is enough)

### 1. Clone and install

```bash
git clone https://github.com/Duberney17/InOva-Desing.git
cd InOva-Desing
```

### 2. Backend

```bash
cd inOvaDesing_Server
cp .env.example .env
# Fill in MONGODB_URI, JWT_SECRET, SUPABASE_* values
npm install
npm run start:dev
# API: http://localhost:3001
# Swagger: http://localhost:3001/api
```

### 3. Frontend

```bash
cd ../innova-design-client
echo "VITE_API_URL=http://localhost:3001" > .env.local
npm install
npm run dev
# App: http://localhost:5173
```

## 🔐 Environment variables

### Backend (`inOvaDesing_Server/.env`)

| Variable | Purpose |
|---|---|
| `MONGODB_URI`           | Mongo connection string |
| `JWT_SECRET`            | Secret for signing JWTs |
| `JWT_EXPIRES_IN`        | Token TTL (e.g. `7d`) |
| `CORS_ORIGINS`          | Comma-separated allowed origins |
| `SUPABASE_URL`          | Supabase project URL |
| `SUPABASE_SERVICE_KEY`  | Supabase secret key (backend only) |
| `SUPABASE_BUCKET`       | Storage bucket name |
| `PORT`                  | Optional, defaults to 3001 |

### Frontend (`innova-design-client/.env.local`)

| Variable | Purpose |
|---|---|
| `VITE_API_URL` | Backend base URL (no trailing slash) |

## 🚢 Deployment

| Service    | What lives here              | Free tier             |
|------------|------------------------------|-----------------------|
| **Vercel** | React SPA (frontend)          | Unlimited bandwidth   |
| **Render** | NestJS API (backend)          | 512 MB RAM, sleeps after 15 min |
| **Atlas**  | MongoDB database              | 512 MB storage        |
| **Supabase** | File storage                | 1 GB storage + 2 GB egress |

Both Vercel and Render are wired to the `main` branch, so every push triggers an automatic redeploy. Total monthly cost: **$0**.

## 📐 Use cases covered

| # | Use case                                | Status |
|---|-----------------------------------------|--------|
| 1 | Register user (student/teacher)          | ✅     |
| 2 | Sign in with JWT                         | ✅     |
| 3 | Load an ADDIE phase section              | ✅     |
| 4 | Per-phase interactive form               | ✅     |
| 5 | Teacher review & feedback per phase      | ✅     |
| 6 | Automatic AI feedback                    | ⏸ Out of scope |
| 7 | Save user progress                       | ✅     |
| 8 | Visualize progress                       | ✅     |
| 9 | OVA preview (5 phases at a glance)       | ✅     |
| 10 | Reset progress from scratch             | ✅     |

## 🤝 Authors

Built as a university capstone project. Special thanks to the InOva Design team for the design and ADDIE methodology guidance.

## 📄 License

Educational use. Not licensed for commercial deployment without permission.
