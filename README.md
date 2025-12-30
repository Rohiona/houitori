# Houitori - Kigaku (Nine Star Ki) Calculator

**[日本語](README.ja.md)**

A web application that calculates your Nine Star Ki (Kigaku) fortune based on your birth year and month. Built with Next.js 16 and TypeScript.

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
- **Testing**: Vitest
- **CI/CD**: GitHub Actions
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Docker and Docker Compose

### Development

```bash
make dev      # Start development server
make test     # Run tests
make lint     # Run linter
make build    # Production build
```

The application will be available at `http://localhost:3000`.

## API Endpoints

### GET /api/personal

Calculate personal stars from query parameters.

```bash
curl "http://localhost:3000/api/personal?birthYear=1985&birthMonth=6"
```

### POST /api/personal

Calculate personal stars from JSON body.

```bash
curl -X POST http://localhost:3000/api/personal \
  -H "Content-Type: application/json" \
  -d '{"birthYear": 1985, "birthMonth": 6}'
```

**Response:**

```json
{
  "honmeiSei": 6,
  "getsumeiSei": 1,
  "honmeiName": "六白金星",
  "getsumeiName": "一白水星"
}
```

## Project Structure

Clean Architecture with three layers:

```
src/
├── app/                                  # Presentation Layer (Next.js)
│   ├── api/personal/route.ts             # REST API (GET/POST)
│   └── page.tsx                          # Main page
│
└── modules/
    ├── domain/
    │   └── personal/                     # Personal star (本命星・月命星)
    │       ├── services/
    │       │   ├── calculator.ts         # calculateHonmeiSei, calculateGetsumeiSei
    │       │   └── starName.ts           # getStarName
    │       └── types/
    │           └── index.ts              # StarNumber, Month, KigakuResult
    │
    ├── application/usecases/             # Application Layer
    │   └── PersonalStarCalculationUseCase.ts  # Orchestration
    │
    └── infrastructure/                   # Infrastructure Layer (future use)
```

## License

MIT
