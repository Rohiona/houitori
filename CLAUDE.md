# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Nine Star Ki (Kigaku / 九星気学) calculator web application. Calculates honmei-sei (本命星) and getsumei-sei (月命星) based on birth year and month.

## Commands

```bash
make dev      # Start dev server at http://localhost:3000
make test     # Run tests
make lint     # Run ESLint
make build    # Production build
make clean    # Remove containers, images, volumes
```

## Architecture

Clean Architecture with three layers:

```
src/
├── app/                                        # Presentation Layer (Next.js)
│   ├── api/personal/route.ts                   # REST API (GET/POST)
│   └── page.tsx                                # Main page
│
└── modules/
    ├── domain/
    │   └── personal/                           # Personal star (本命星・月命星)
    │       ├── services/
    │       │   ├── calculator.ts               # calculateHonmeiSei, calculateGetsumeiSei
    │       │   └── starName.ts                 # getStarName
    │       └── types/
    │           └── index.ts                    # StarNumber, Month, KigakuResult
    │
    ├── application/usecases/                   # Application Layer
    │   └── PersonalStarCalculationUseCase.ts   # Orchestration
    │
    └── infrastructure/                         # Infrastructure Layer (future use)
```

### Key Modules

- **`src/modules/domain/personal/`**: Personal star calculation (pure functions). Contains `services/` and `types/`.
- **`src/modules/application/usecases/`**: Use cases that orchestrate domain functions.
- **`src/app/api/personal/route.ts`**: REST API supporting both GET (query params) and POST (JSON body).

### Import Examples

```typescript
import { PersonalStarCalculationUseCase } from "@/modules/application/usecases/PersonalStarCalculationUseCase";
import { calculateHonmeiSei } from "@/modules/domain/personal/services/calculator";
import { getStarName } from "@/modules/domain/personal/services/starName";
import type { Month, KigakuResult } from "@/modules/domain/personal/types";
```

### Type System

- `StarNumber`: 1-9 (literal union type)
- `Month`: 1-12 (literal union type)
- `KigakuResult`: Contains honmeiSei, getsumeiSei, and their Japanese names

## Testing

Tests are co-located with source files (`*.test.ts`). Run a single test file:
```bash
make test  # Run all tests

# Or run specific test file:
docker compose run --rm web pnpm vitest run src/modules/domain/personal/services/calculator.test.ts
```