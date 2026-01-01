# ADR-001: Architecture Decisions for Houitori

## Status

Accepted (Updated: 2025-01)

## Context

Houitori is a Nine Star Ki (九星気学) calculator web application. The core functionality is:

- Input: Birth year and month
- Output: Honmei-sei (本命星) and Getsumei-sei (月命星) with their Japanese names
- Direction fortune calculation (方位の吉凶)
- No database, no external API calls, no user authentication

This document explains the architectural decisions made and, importantly, the decisions to NOT adopt certain patterns.

## Decisions

### 1. Layered Architecture (Adopted)

**Decision**: Adopt a simplified Clean Architecture with Domain, Application, and Presentation layers.

```
src/
├── app/                              # Presentation (Next.js)
└── modules/
    ├── domain/
    │   ├── shared/                   # Shared Kernel (StarNumber, Month)
    │   ├── personal/                 # Personal star (services/ + types/)
    │   └── direction/                # Direction fortune (rules/ + services/)
    ├── application/
    │   ├── dtos/                     # DTOs (API output format)
    │   ├── services/                 # Application services
    │   └── usecases/                 # Use cases
    └── infrastructure/               # External services (currently empty)
```

**Rationale**:

- Clear separation of concerns
- Domain logic is testable in isolation
- Easy to understand for new contributors
- Provides extension points for future features

**Trade-off**: Slight overhead for a simple app, but the clarity benefits outweigh the cost.

---

### 2. Public API via index.ts (Adopted)

**Decision**: Each domain module exposes a public API through `index.ts`. Application layer imports from public API only.

```typescript
// Good: Import from public API
import { calculateHonmeiSei, type Month } from "@/modules/domain/personal";
import { decideDirectionStatus, type BoardData } from "@/modules/domain/direction";

// Avoid: Deep imports (except for tests)
import { calculateHonmeiSei } from "@/modules/domain/personal/services/calculator";
```

**Rationale**:

- Clear boundary between layers
- Domain internals (e.g., `rules/`) are hidden from Application layer
- Easier refactoring within a module without breaking consumers
- Tests may use deep imports for unit testing internal functions

**Trade-off**: Requires maintaining `index.ts` exports, but provides better encapsulation.

---

### 3. Shared Kernel for Cross-Domain Types (Adopted)

**Decision**: Common types used by multiple domains (StarNumber, Month) are placed in `domain/shared/`.

```
domain/
├── shared/           # StarNumber, Month, STAR_NAMES
├── personal/         # Uses shared types
└── direction/        # Uses shared types
```

**Rationale**:

- Explicit dependency on shared concepts
- Avoids circular dependencies between personal and direction domains
- Clear "Shared Kernel" pattern from Domain-Driven Design

---

### 4. DTOs in Application Layer (Adopted)

**Decision**: API output types (DirectionResult, YearDirectionResult) are placed in `application/dtos/`, not in domain.

**Rationale**:

- Domain layer focuses on business logic, not API format
- DTOs can change independently of domain models
- Clear separation: domain types for computation, DTOs for API output

---

### 5. Dependency Injection Container (NOT Adopted)

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
expect(result.honmeiSei).toBe(6); // Direct test without mocks

// Overkill for this app (no dependencies to mock)
@injectable()
class CalculateKigakuUseCase {
  constructor(@inject("KigakuRepository") private repo: IKigakuRepository) {}
}
```

**When to reconsider**: When I/O-bound dependencies are added and mocking becomes necessary for testing.

---

### 6. Result Type / Either Pattern (NOT Adopted)

**Decision**: Use traditional `throw` for error handling instead of Result/Either types.

**Rationale**:

- Only one error case: invalid birth year (< 1900)
- Error is truly exceptional, not a normal flow
- TypeScript's type system doesn't enforce Result handling anyway
- Adds cognitive overhead without proportional benefit

**When to reconsider**: If error handling becomes complex with multiple error types or if errors are expected outcomes (not exceptions).

---

### 7. Input Validation with Zod (Adopted)

**Decision**: Use Zod for schema validation.

**Rationale**:

- Direction calculation feature added complexity (targetYear, persons array)
- Type-safe validation with type inference
- Ideal for Server Actions input validation
- Great compatibility with shadcn/ui (React Hook Form + Zod)

```typescript
// presentation/validators/direction/index.ts
export const directionRequestSchema = z.object({
  targetYear: z.number().int().min(2024).max(2030),
  persons: z.array(personInputSchema).min(1).max(5),
});
```

---

### 8. Separation of Calculator and StarName (Adopted)

**Decision**: Separate pure calculation logic (`calculator.ts`) from name mapping (`starName.ts`).

**Rationale**:

- Single Responsibility Principle
- `calculator.ts`: Mathematical calculations
- `starName.ts`: Localization concern (future: multi-language support)
- Easier to test independently
- Clear extension point for i18n

---

### 9. Rule-based Domain Logic (Adopted)

**Decision**: Direction fortune logic is split into small, pure function "rules" in `domain/direction/rules/`.

```
rules/
├── killingRule.ts    # 本命殺・月命殺・的殺
├── badRule.ts        # 五黄殺・暗剣殺
└── goodRule.ts       # 相性による吉方位
```

**Rationale**:

- Each rule has a single responsibility
- Easy to test each rule in isolation
- Rules are aggregated by `statusDecider.ts`
- New rules can be added without modifying existing code

---

### 10. Server Actions (Adopted)

**Decision**: Use Next.js Server Actions instead of REST API.

**Rationale**:

- Direct server function calls from client components
- No need to define/manage API routes
- End-to-end TypeScript type sharing
- Natural integration with Next.js App Router

```typescript
// src/app/actions.ts
"use server";

export async function calculateDirections(input: DirectionRequest): Promise<ActionResult> {
  const parsed = directionRequestSchema.safeParse(input);
  // ...
}
```

**Trade-off**: No external API access, but not needed for this app.

---

## Future Extension Points

If the application grows, these are the recommended next steps:

| Feature                             | Recommended Change                                                               |
| ----------------------------------- | -------------------------------------------------------------------------------- |
| Database storage                    | Add Repository interface in `application/ports/`, implement in `infrastructure/` |
| External calendar API               | Add CalendarClient interface, implement HttpCalendarClient                       |
| Multi-language                      | Extend `getStarName()` with locale parameter                                     |
| Complex validation                  | Introduce zod schemas                                                            |
| Multiple use cases with shared deps | Consider lightweight DI                                                          |

## Consequences

### Positive

- Simple, maintainable codebase
- Fast development iteration
- Easy onboarding for contributors
- No unnecessary abstractions
- Clear layer boundaries

### Negative

- Less "impressive" at first glance (no fancy patterns)
- Requires discipline to add complexity only when needed

## References

- [Clean Architecture by Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [YAGNI Principle](https://martinfowler.com/bliki/Yagni.html)
- [Simple Made Easy by Rich Hickey](https://www.infoq.com/presentations/Simple-Made-Easy/)
