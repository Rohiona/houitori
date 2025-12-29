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

```
src/
├── app/                    # Next.js App Router
│   ├── api/kigaku/         # API routes (GET/POST)
│   └── page.tsx            # Main page
└── domain/kigaku/          # Core calculation logic (pure functions)
    ├── calculator.ts       # calculateHonmeiSei, calculateGetsumeiSei, calculateKigaku
    ├── types.ts            # StarNumber, Month, KigakuResult, STAR_NAMES
    └── index.ts            # Public exports
```

### Key Modules

- **`src/domain/kigaku/`**: Pure calculation functions with no side effects. Import from `@/domain/kigaku`.
- **`src/app/api/kigaku/route.ts`**: REST API supporting both GET (query params) and POST (JSON body).

### Type System

- `StarNumber`: 1-9 (literal union type)
- `Month`: 1-12 (literal union type)
- `KigakuResult`: Contains honmeiSei, getsumeiSei, and their Japanese names

## Testing

Tests are in `*.test.ts` files next to the source. Run a single test file:
```bash
pnpm vitest run src/domain/kigaku/calculator.test.ts
```