# Handoff Document - Houitori Project

## Project Overview

Nine Star Ki (Kigaku / 九星気学) calculator web application. Migrated from Excel VBA to Next.js + TypeScript.

**GitHub Repository**: https://github.com/Rohiona/houitori

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4
- **Testing**: Vitest
- **Package Manager**: pnpm
- **Container**: Docker + Docker Compose
- **CI/CD**: GitHub Actions
- **Deployment**: Vercel (予定)

## Project Structure

```
src/
├── app/
│   ├── api/kigaku/route.ts   # REST API (GET/POST)
│   ├── layout.tsx
│   └── page.tsx              # メインページ（未実装）
└── domain/
    └── kigaku/               # コア計算ロジック
        ├── calculator.ts     # calculateHonmeiSei, calculateGetsumeiSei, calculateKigaku
        ├── calculator.test.ts
        ├── types.ts          # StarNumber, Month, KigakuResult, STAR_NAMES
        └── index.ts          # Public exports
```

## Completed Tasks

### Session 1 (Previous)

1. **Next.js Project Setup**
   - Next.js 16 with App Router
   - TypeScript strict mode
   - Tailwind CSS v4
   - pnpm package manager

2. **Docker Environment**
   - `Dockerfile` - Node.js 22 Alpine based
   - `docker-compose.yml` - Development environment with hot reload

3. **Core Logic Migration**
   - 本命星計算 (calculateHonmeiSei)
   - 月命星計算 (calculateGetsumeiSei)
   - 結果取得 (calculateKigaku)

4. **API Routes**
   - `GET /api/kigaku?birthYear=1985&birthMonth=6`
   - `POST /api/kigaku` with JSON body

5. **Testing**
   - Vitest configured
   - 7 unit tests passing

6. **CI/CD**
   - `.github/workflows/ci.yml` - Lint, test, build on push/PR

### Session 2 (2025-12-29)

7. **GitHub Repository Setup**
   - リポジトリ作成: https://github.com/Rohiona/houitori
   - 初回コミット・プッシュ完了
   - `gh` CLI インストール・設定

8. **Old Repositories Cleanup**
   - 削除済み: `houitori-api`, `houitori-dev-env`, `houitori-web`

9. **Documentation (Bilingual)**
   - `README.md` - English version
   - `README.ja.md` - Japanese version
   - 相互リンク設置

10. **Architecture Refactoring**
    - `src/lib/` → `src/domain/` にリネーム（Clean Architecture準拠）
    - インポートパス更新: `@/lib/kigaku` → `@/domain/kigaku`

11. **Developer Experience**
    - `Makefile` 追加（Docker コマンドのラッパー）
    - `CLAUDE.md` 追加（AI アシスタント向けガイド）

## Commands

```bash
make dev      # 開発サーバー起動 (http://localhost:3000)
make test     # テスト実行
make lint     # Lint実行
make build    # 本番ビルド
make clean    # コンテナ・イメージ・ボリューム削除
```

## Remaining Tasks

### High Priority

1. **UI Implementation** ← 次のタスク
   - 入力フォーム（生年・生月の選択）
   - 計算結果の表示
   - レスポンシブデザイン
   - Client Component (`"use client"`)

2. **Vercel Deployment**
   - GitHub連携
   - 環境設定
   - 本番デプロイ

### Medium Priority

3. **Additional Features (from VBA)**
   - 方位の吉凶表示
   - 年次データ管理 (`src/data/`)

4. **Testing**
   - API route tests
   - E2E tests with Playwright

### Low Priority

5. **Enhancements**
   - i18n (English/Japanese)
   - zod validation for API
   - OpenAPI documentation

## Original VBA Files Reference

Located at: `C:\Users\navyf\Dropbox\02_プライベート\03.方位\modules\`

| File | Status | Description |
|------|--------|-------------|
| `Calc_Star.bas` | ✅ Migrated | 計算ロジック |
| `Replace_Kanji.bas` | ✅ Migrated | 星名マッピング |
| `OutPut_Result.bas` | ⏳ Partial | 結果出力 |
| `Main.bas` | ❌ Not started | エントリポイント |
| `Set_Up.bas` | ❌ Not started | UI設定 |

## Git History

```
1d4e4f3 Refactor: lib -> domain, add Makefile and CLAUDE.md
25a5b9f Add bilingual README (English + Japanese)
a87d60e Initial commit: Nine Star Ki (Kigaku) calculator
```

## Notes

- TypeScript strict mode 有効
- テスト: 7/7 passing
- `@/` パスエイリアス設定済み（tsconfig.json, vitest.config.ts）
