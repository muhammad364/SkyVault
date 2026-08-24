# SkyVault

> A secure, role-aware cloud-storage workspace built with React, ASP.NET Core, PostgreSQL, and Google Drive.

SkyVault is a full-stack storage platform for subscribing to storage, organising files and folders, sharing read-only files, recovering deleted content, and administering the underlying storage operation. The web client is a production-oriented React application; the API is a modular ASP.NET Core 9 service that remains the authority for data, authorization, quotas, and storage-provider work.

## What is implemented

### Personal workspace

- Account registration, email verification, sign-in/out, password recovery, profile updates, and password changes.
- JWT-based authentication, user/admin role separation, ownership checks, and protected routes.
- Storage-plan catalogue, subscriptions, renewal/cancellation, additional-storage purchases, quota reporting, and quota enforcement.
- Root and nested folders, uploads, replacement, rename, move, copy, download, preview, and move-to-Trash deletion.
- Exact **100 MiB** upload and replacement limit, with real browser transfer progress and safe cancellation boundaries.
- A Recycle Bin with API-provided expiry information, restore, permanent deletion, sequential bulk work, and 30-day backend retention cleanup.
- Read-only public share links with optional expiry, revocation, anonymous preview/download, and no client-side persistence of share tokens or generated URLs.
- Metadata search by keyword, extension/type, and upload-date range. Results preserve backend order and reuse real file actions.
- A responsive workspace home that composes real profile, file, folder, quota, subscription, sharing, and recycle-bin data.

### Administration

- Dedicated administrator sign-in mode and an isolated administration shell.
- User status management, storage allocation visibility, and subscription monitoring.
- All-status storage-plan management, including local Active/Inactive filtering and plan activation/deactivation.
- Storage-provider and storage-account management, SMTP configuration, audit-log browsing, and API-backed operational summaries.

### Platform behavior

- PostgreSQL stores application metadata; Google Drive stores physical file content through a provider abstraction.
- Background workers process queued email delivery, subscription-expiry checks, and Recycle Bin cleanup.
- The UI has typed API chains, cancellation-aware reads, safe normalized errors, responsive layouts, light/dark themes, keyboard-accessible controls, and lazy-loaded routes.

## Architecture

```text
React + Vite frontend (localhost:5173)
              |
              | HTTPS REST / JSON + Blob streams
              v
ASP.NET Core 9 Web API (https://localhost:7181)
              |
              +-- Controllers -> Services -> Repositories -> EF Core
              |                                      |
              |                                      v
              |                                  PostgreSQL
              |
              +-- Physical storage provider abstraction -> Google Drive API
              +-- Hosted workers -> email, subscriptions, Recycle Bin cleanup
```

The frontend follows a typed flow for every API interaction:

```text
DTO model -> endpoint function -> feature service -> React Query hook -> UI
```

The backend is a modular monolith rather than a set of independently deployed microservices. Controllers expose REST-style resource routes, while domain services and repositories keep business logic and persistence separate.

## Technology stack

| Area                | Implementation                                                                   |
| ------------------- | -------------------------------------------------------------------------------- |
| Frontend            | React 18, TypeScript, Vite, React Router                                         |
| UI                  | Tailwind CSS, Radix UI, React Day Picker, Lucide, Framer Motion                  |
| Client state/data   | TanStack React Query, Axios, Zustand, React Hook Form, Zod                       |
| Visualisation       | React Three Fiber/Three.js and Recharts, both lazy-loaded where used             |
| Frontend testing    | Vitest, Testing Library, jsdom                                                   |
| Backend             | ASP.NET Core Web API on .NET 9, C#                                               |
| Persistence         | Entity Framework Core, Npgsql, PostgreSQL                                        |
| Authentication      | JWT Bearer authentication, ASP.NET Identity password hashing, role authorization |
| Storage             | Google Drive API behind `IPhysicalStorageProvider`                               |
| Supporting services | MailKit, Swagger/OpenAPI, AutoMapper, Data Protection, hosted background workers |

## Repository layout

```text
Skyvault/
├── Frontend/                 # React application, UI system, tests, frontend handover docs
│   ├── src/
│   └── docs/
├── Backend/                  # ASP.NET Core API
│   ├── Controllers/          # REST endpoints
│   ├── DTOs/                 # Request/response contracts
│   ├── Services/             # Domain and infrastructure logic
│   ├── Repository/           # Persistence boundary
│   ├── Data/                 # EF Core DbContext and seeding
│   └── Scripts/skyvault_db.sql
├── docs/                     # SRS and backend implementation guide
└── README.md
```

## Run locally

### Prerequisites

- .NET SDK 9
- Node.js 20+ with Corepack/pnpm
- PostgreSQL
- A Google Cloud OAuth client and an authorized Google Drive refresh token for the configured storage account

### 1. Prepare the database

Create a PostgreSQL database, then apply the supplied schema:

```bash
psql -U postgres -d skyvaultdb -f Backend/Scripts/skyvault_db.sql
```

### 2. Configure backend secrets

The API project already has a .NET User Secrets identifier. Keep connection strings, JWT signing material, and Google credentials outside source control in real environments.

```bash
dotnet user-secrets set --project Backend/SkyVault.csproj "ConnectionStrings:DefaultConnection" "Host=localhost;Port=5432;Database=skyvaultdb;Username=postgres;Password=replace-me"
dotnet user-secrets set --project Backend/SkyVault.csproj "JwtSettings:SecretKey" "replace-with-a-long-random-key"
dotnet user-secrets set --project Backend/SkyVault.csproj "GoogleDrive:ClientId" "your-google-oauth-client-id"
dotnet user-secrets set --project Backend/SkyVault.csproj "GoogleDrive:ClientSecret" "your-google-oauth-client-secret"
dotnet user-secrets set --project Backend/SkyVault.csproj "GoogleDrive:Accounts:0:RefreshToken" "your-google-refresh-token"
```

Also ensure `GoogleDrive:Accounts:0:AccountName` matches the storage account configured in the database. For production, use environment variables or a managed secret store instead of User Secrets.

### 3. Start the API

```bash
dotnet restore Backend/SkyVault.csproj
dotnet run --project Backend/SkyVault.csproj --launch-profile https
```

The local HTTPS API runs at `https://localhost:7181`; Swagger is available at `https://localhost:7181/swagger` in Development. The launch profile uses the local .NET development certificate and redirects HTTP to HTTPS.

### 4. Start the frontend

Create `Frontend/.env` from `Frontend/.env.example` and set:

```dotenv
VITE_API_BASE_URL=https://localhost:7181
VITE_RECOMMENDED_STORAGE_PLAN_ID=
```

Then run:

```bash
cd Frontend
corepack enable
corepack pnpm install
corepack pnpm dev
```

Vite runs at `http://localhost:5173`. The backend CORS policy explicitly allows this origin and `http://127.0.0.1:5173` during local development.

## Quality checks

Frontend commands, from `Frontend/`:

```bash
corepack pnpm lint
corepack pnpm test
corepack pnpm build
corepack pnpm format:check
```

Backend compilation:

```bash
dotnet build Backend/SkyVault.csproj --configuration Release
```

The frontend handover recorded **88 Vitest files / 184 tests** passing, strict TypeScript, zero-warning ESLint, production build, formatting, and backend Release compilation. The backend has no separate unit-test project, so Release compilation and source-contract inspection are recorded honestly rather than presented as backend unit-test coverage.

## Deployment notes

- Serve the frontend build over HTTPS and configure SPA fallback to `index.html` for `/vault/*`, `/admin/*`, and `/share/*`.
- Set `VITE_API_BASE_URL` to the production API origin when building the frontend.
- Update the backend CORS allowlist with the exact production frontend origin.
- Every reverse proxy, CDN, ingress, IIS, or Nginx layer must permit at least a **101 MiB** multipart request envelope for the product’s exact 100 MiB file limit.
- Do not log or persist access tokens, share URLs/tokens, payment fields, SMTP passwords, Google OAuth credentials, or file contents.
- Rotate any development credentials that may have been committed before publishing a public repository.

## Current scope and boundaries

SkyVault intentionally does **not** claim AI/semantic search, embeddings, natural-language search, file version history, resumable uploads, folder copy, server-side bulk-operation endpoints, or invented progress/status APIs. Where the backend exposes no contract, the frontend stays explicit about that limitation rather than fabricating behavior.

The implementation records Phase 0-10 as complete. Phase 11’s implementation and automated verification are complete; the remaining recorded gate is owner review of its final hardened UI surfaces.

## Documentation

- [Software Requirements Specification](docs/SkyVault_SRS.docx)
- [Backend Implementation Guide](docs/SkyVault_Backend_Implementation_Guide.md)
- [Frontend README](Frontend/README.md)
- [Frontend Phase Ledger](Frontend/docs/PHASE-LEDGER.md)
- [Frontend API Gaps](Frontend/docs/API-GAPS.md)
- [Frontend Handover](Frontend/docs/HANDOVER.md)
- [Frontend State Coverage](Frontend/docs/STATE-COVERAGE.md)

## Author

**Muhammad Haroon Khalid**

BS Software Engineering, COMSATS University Islamabad

## License

This project is currently provided for educational and portfolio purposes. Add an explicit license before redistributing or accepting external contributions.
