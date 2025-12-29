# ADR-001: Architecture Decisions for Houitori

## Status
Accepted

## Context

Houitori is a Nine Star Ki (九星気学) calculator web application. The core functionality is:
- Input: Birth year and month
- Output: Honmei-sei (本命星) and Getsumei-sei (月命星) with their Japanese names
- No database, no external API calls, no user authentication

This document explains the architectural decisions made and, importantly, the decisions to NOT adopt certain patterns.

## Decisions

### 1. Layered Architecture (Adopted)

**Decision**: Adopt a simplified Clean Architecture with Domain, Application, and Presentation layers.

```
src/
├── app/                    # Presentation (Next.js)
└── modules/
    ├── domain/             # Business logic
    ├── application/        # Use cases
    └── infrastructure/     # External services (currently empty)
```

**Rationale**:
- Clear separation of concerns
- Domain logic is testable in isolation
- Easy to understand for new contributors
- Provides extension points for future features

**Trade-off**: Slight overhead for a simple app, but the clarity benefits outweigh the cost.

---

### 2. Dependency Injection Container (NOT Adopted)

**Decision**: Do not use a DI container (tsyringe, inversify, etc.).

**Rationale**:

The primary purpose of DI containers is **improving testability** by allowing dependencies to be swapped with mocks. However, testability is already ensured in this app without DI for the following reasons:

1. **Domain layer is pure functions**: `calculateHonmeiSei()`, `calculateGetsumeiSei()` are pure functions that always return the same output for a given input. No external dependencies, so they can be tested directly without mocks.

2. **No external I/O**: No database connections, HTTP calls, or file system access that would need to be swapped during testing.

3. **UseCase directly calls domain functions**: The UseCase simply orchestrates pure domain functions, so it can also be tested without mocks.

```typescript
// Current: Simple, sufficient, AND testable
const useCase = new CalculateKigakuUseCase();
const result = useCase.execute(1985, 6);
expect(result.honmeiSei).toBe(6);  // Direct test without mocks

// Overkill for this app (no dependencies to mock)
@injectable()
class CalculateKigakuUseCase {
  constructor(@inject('KigakuRepository') private repo: IKigakuRepository) {}
}
```

**When DI becomes necessary**:
- Adding `KigakuRepository` to persist calculation results to a database
- Calling an external calendar API to get seasonal transition dates
- When these dependencies need to be mocked during testing

**When to reconsider**: When I/O-bound dependencies are added and mocking becomes necessary for testing.

---

### 3. Result Type / Either Pattern (NOT Adopted)

**Decision**: Use traditional `throw` for error handling instead of Result/Either types.

**Rationale**:
- Only one error case: invalid birth year (< 1900)
- Error is truly exceptional, not a normal flow
- TypeScript's type system doesn't enforce Result handling anyway
- Adds cognitive overhead without proportional benefit

```typescript
// Current: Clear and idiomatic
if (birthYear < 1900) {
  throw new Error("生年は1900年以降の整数を指定してください");
}

// Overkill for this app
function calculateHonmeiSei(year: number): Result<StarNumber, ValidationError>
```

**When to reconsider**: If error handling becomes complex with multiple error types or if errors are expected outcomes (not exceptions).

---

### 4. Input Validation with Zod (NOT Adopted)

**Decision**: Use manual validation in API routes instead of schema validation libraries.

**Rationale**:
- Only 2 fields to validate (birthYear, birthMonth)
- Validation rules are simple (integer ranges)
- Adding zod increases bundle size
- Manual validation is readable and maintainable at this scale

**When to reconsider**: If input complexity grows (nested objects, many fields, complex rules).

---

### 5. Barrel Files / Index Exports (NOT Adopted)

**Decision**: Import directly from source files instead of re-exporting through index.ts.

```typescript
// Adopted: Direct imports
import { calculateHonmeiSei } from "@/modules/domain/kigaku/calculator";
import type { Month } from "@/modules/domain/kigaku/types";

// Not adopted: Barrel files
import { calculateHonmeiSei, Month } from "@/modules/domain/kigaku";
```

**Rationale**:
- Explicit dependencies are clearer
- Better tree-shaking
- Avoids circular dependency issues
- IDE navigation goes directly to source

---

### 6. Separation of Calculator and StarName (Adopted)

**Decision**: Separate pure calculation logic (`calculator.ts`) from name mapping (`starName.ts`).

**Rationale**:
- Single Responsibility Principle
- `calculator.ts`: Mathematical calculations
- `starName.ts`: Localization concern (future: multi-language support)
- Easier to test independently
- Clear extension point for i18n

---

## Future Extension Points

If the application grows, these are the recommended next steps:

| Feature | Recommended Change |
|---------|-------------------|
| Database storage | Add Repository interface in `application/ports/`, implement in `infrastructure/` |
| External calendar API | Add CalendarClient interface, implement HttpCalendarClient |
| Multi-language | Extend `getStarName()` with locale parameter |
| Complex validation | Introduce zod schemas |
| Multiple use cases with shared deps | Consider lightweight DI |

## Consequences

### Positive
- Simple, maintainable codebase
- Fast development iteration
- Easy onboarding for contributors
- No unnecessary abstractions

### Negative
- Less "impressive" at first glance (no fancy patterns)
- Requires discipline to add complexity only when needed

## References

- [Clean Architecture by Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [YAGNI Principle](https://martinfowler.com/bliki/Yagni.html)
- [Simple Made Easy by Rich Hickey](https://www.infoq.com/presentations/Simple-Made-Easy/)
