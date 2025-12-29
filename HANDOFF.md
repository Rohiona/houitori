# Handoff Document - Houitori Project

## Project Overview

Nine Star Ki (Kigaku) calculator web application. Migrated from Excel VBA to Next.js + TypeScript.

## Completed Tasks

1. **Next.js Project Setup**
   - Next.js 16 with App Router
   - TypeScript strict mode
   - Tailwind CSS v4
   - pnpm package manager

2. **Docker Environment**
   - `Dockerfile` - Node.js 22 Alpine based
   - `docker-compose.yml` - Development environment with hot reload

3. **Core Logic Migration**
   - `src/lib/kigaku/types.ts` - Type definitions
   - `src/lib/kigaku/calculator.ts` - Calculation logic (pure functions)
   - `src/lib/kigaku/index.ts` - Module exports

4. **API Routes**
   - `src/app/api/kigaku/route.ts` - GET/POST endpoints

5. **Testing**
   - Vitest configured
   - `src/lib/kigaku/calculator.test.ts` - Unit tests (7 tests passing)

6. **CI/CD**
   - `.github/workflows/ci.yml` - Lint, test, build on push/PR

## Remaining Tasks

### High Priority

1. **UI Implementation**
   - Create input form (birth year/month selection)
   - Display calculation results
   - Responsive design

2. **Vercel Deployment**
   - Connect to GitHub
   - Configure environment
   - Deploy to production

### Medium Priority

3. **Additional Features (from VBA)**
   - Direction fortune display (方位の吉凶)
   - Yearly data management (`src/data/`)

4. **Testing**
   - Add API route tests
   - Add E2E tests with Playwright

### Low Priority

5. **Enhancements**
   - i18n (English/Japanese)
   - zod validation for API
   - OpenAPI documentation

## Commands

```bash
# Start development
docker compose up

# Run tests
docker compose exec web pnpm test:run

# Run linter
docker compose exec web pnpm lint

# Build
docker compose exec web pnpm build
```

## Original VBA Files Reference

Located at: `C:\Users\navyf\Dropbox\02_プライベート\03.方位\modules\`

- `Calc_Star.bas` - Calculation logic (migrated)
- `Replace_Kanji.bas` - Star name mapping (migrated)
- `OutPut_Result.bas` - Result output (partially migrated)
- `Main.bas` - Entry point
- `Set_Up.bas` - UI setup

## Notes

- Old repositories (`houitori-api`, `houitori-dev-env`, `houitori-web`) can be deleted
- Git initialized with `main` branch, no remote yet
- TypeScript strict mode enabled
- All 7 tests passing
