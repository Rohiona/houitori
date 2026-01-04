# Houitori - Nine Star Ki Direction Fortune Calculator

**[日本語](README.ja.md)**

A web application that calculates Nine Star Ki (Kigaku) fortune based on your birth year and month, and determines the fortune of eight directions using yearly and monthly star charts. Built with Next.js 16 and TypeScript.

**Live**: https://houitori.vercel.app/

## Features

- **Personal Star Calculation**: Calculate Honmei-sei and Getsumei-sei from birth date
- **Direction Fortune**: Display fortune (good/bad) for 8 directions based on yearly and monthly charts
- **Multi-person Support**: Calculate for up to 5 people simultaneously
- **Responsive Design**: Works on both PC and mobile devices

## What is Nine Star Ki (Kigaku)?

Nine Star Ki is a traditional East Asian astrology system that assigns one of nine "stars" to individuals based on their birth date. Each star corresponds to specific personality traits and fortune predictions.

The nine stars are:

- 1: Ippaku Suisei (One White Water Star)
- 2: Nikoku Dosei (Two Black Earth Star)
- 3: Sanpeki Mokusei (Three Jade Wood Star)
- 4: Shiroku Mokusei (Four Green Wood Star)
- 5: Goo Dosei (Five Yellow Earth Star)
- 6: Roppaku Kinsei (Six White Metal Star)
- 7: Shichiseki Kinsei (Seven Red Metal Star)
- 8: Happaku Dosei (Eight White Earth Star)
- 9: Kyushi Kasei (Nine Purple Fire Star)

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Forms**: React Hook Form
- **Validation**: Zod
- **Testing**: Vitest
- **Formatter**: Prettier
- **CI/CD**: GitHub Actions (includes license check)
- **Deployment**: Vercel

## CI

GitHub Actions runs the following checks:

- Lint (ESLint)
- Tests (Vitest)
- Build (Next.js)
- **License Check**: Ensures no GPL/Copyleft licensed packages are included

### Blocked Licenses

To ensure commercial and portfolio use, the following Copyleft licenses are blocked in CI:

- GPL, GPL-2.0, GPL-3.0
- LGPL, LGPL-2.0, LGPL-2.1, LGPL-3.0
- AGPL, AGPL-3.0
- CC-BY-SA
- MPL-2.0

## Getting Started

### Prerequisites

- Docker and Docker Compose

### Development

```bash
make setup   # Configure git hooks (run after clone)
make dev     # Start development server
make test    # Run tests
make lint    # Run linter
make format  # Format code with Prettier
make build   # Production build
make clean   # Remove containers, images, volumes
```

The application will be available at `http://localhost:3000`.

## Architecture

### Design Philosophy

This project uses a **two-axis structure** to keep concerns separated:

- **features/**: UI-centric code (components, Server Actions, validation) organized by use case
- **core/**: Business logic following Clean Architecture (domain rules stay pure)
- **shared/**: Cross-cutting UI primitives (shadcn/ui) and utilities
- **app/**: Next.js routing only (minimal composition)

The key rule: `features` → `core/application` → `core/domain`. Features never import domain directly, ensuring business logic remains UI-agnostic and testable.

### Server Actions

Calculations are performed using Next.js Server Actions. When the user clicks the calculate button, the computation runs on the server side.

```typescript
// src/app/actions.ts
"use server";

export async function calculateDirections(input: DirectionRequest): Promise<ActionResult> {
  // Validate → Load data → Calculate → Return result
}
```

### Project Structure

Feature-based + Clean Architecture:

```
src/
├── app/                        # Next.js routing only
│   ├── page.tsx                # Entry point (calls features)
│   ├── layout.tsx
│   └── providers.tsx
│
├── features/                   # Feature modules (UI + API)
│   ├── home/ui/                # Home screen components
│   └── directions/search/      # Direction search feature
│       ├── ui/                 # React components
│       └── api/                # Server Actions
│
├── shared/                     # Cross-cutting concerns
│   ├── ui/                     # shadcn/ui components
│   ├── lib/                    # Utilities (i18n, cn)
│   └── hooks/                  # Shared hooks
│
└── core/                       # Business logic (Clean Architecture)
    ├── domain/
    │   ├── shared/             # Shared Kernel (StarNumber, Month)
    │   ├── personal/           # Personal star (Honmei/Getsumei)
    │   └── direction/          # Direction fortune (rules/)
    │
    ├── application/
    │   ├── dtos/               # Data Transfer Objects (+ type re-exports)
    │   ├── services/           # Application services
    │   └── usecases/           # Use cases
    │
    └── infrastructure/
        └── data/               # JSON data files
```

### Import Convention

Features import from application layer (not domain directly):

```typescript
// Good: features → core/application
import { DirectionCalculationUseCase } from "@/core/application/usecases/DirectionCalculationUseCase";
import type { DirectionResult, StarNumber } from "@/core/application/dtos/direction";

// Good: features → shared
import { useI18n } from "@/shared/lib/i18n";
import { Button } from "@/shared/ui/button";

// Avoid: features → core/domain (direct access)
import { calculateHonmeiSei } from "@/core/domain/personal";
```

## License

MIT
