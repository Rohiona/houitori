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
- **CI/CD**: GitHub Actions
- **Deployment**: Vercel

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

Clean Architecture with three layers:

```
src/
├── app/                                    # Presentation Layer (Next.js)
│   ├── actions.ts                          # Server Actions
│   ├── components/                         # Page components
│   └── page.tsx                            # Main page
│
├── data/                                   # Static data
│   ├── boards/                             # Yearly/monthly chart data (JSON)
│   └── compatibility.json                  # Compatibility table
│
└── modules/
    ├── domain/
    │   ├── shared/                         # Shared Kernel (StarNumber, Month)
    │   ├── personal/                       # Personal star (Honmei/Getsumei)
    │   └── direction/                      # Direction fortune (rules/ + services/)
    │
    ├── application/
    │   ├── dtos/                           # DTOs (API output format)
    │   ├── services/                       # Application services
    │   └── usecases/                       # Use cases
    │
    ├── infrastructure/                     # Data loaders
    │
    └── presentation/
        └── validators/                     # Input validation (Zod)
```

### Import Convention

Application layer imports from Domain public API (`index.ts`):

```typescript
// Good: Import from public API
import { calculateHonmeiSei, type Month } from "@/modules/domain/personal";
import { decideDirectionStatus, type BoardData } from "@/modules/domain/direction";

// Avoid: Deep imports (except for tests)
import { calculateHonmeiSei } from "@/modules/domain/personal/services/calculator";
```

## License

MIT
