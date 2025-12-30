# Houitori - 九星気学計算アプリ

**[English](README.md)**

生年月日から九星気学の本命星・月命星を計算するWebアプリケーションです。Next.js 16とTypeScriptで構築しています。

## 九星気学とは？

九星気学は、生年月日に基づいて9つの「星」のいずれかを割り当てる東洋の占術です。それぞれの星は特定の性格特性や運勢に対応しています。

九星の一覧：

- 一白水星
- 二黒土星
- 三碧木星
- 四緑木星
- 五黄土星
- 六白金星
- 七赤金星
- 八白土星
- 九紫火星

## 技術スタック

- **フレームワーク**: Next.js 16 (App Router)
- **言語**: TypeScript (strict mode)
- **スタイリング**: Tailwind CSS v4
- **テスト**: Vitest
- **フォーマッタ**: Prettier
- **CI/CD**: GitHub Actions
- **デプロイ**: Vercel

## はじめに

### 必要なもの

- Docker および Docker Compose

### 開発環境の起動

```bash
make dev      # 開発サーバーを起動
make test     # テストを実行
make lint     # Lintを実行
make format   # Prettierでコードを整形
make build    # 本番ビルド
```

アプリケーションは `http://localhost:3000` で利用できます。

## APIエンドポイント

### GET /api/personal

クエリパラメータから個人の星を計算します。

```bash
curl "http://localhost:3000/api/personal?birthYear=1985&birthMonth=6"
```

### POST /api/personal

JSONボディから個人の星を計算します。

```bash
curl -X POST http://localhost:3000/api/personal \
  -H "Content-Type: application/json" \
  -d '{"birthYear": 1985, "birthMonth": 6}'
```

**レスポンス:**

```json
{
  "honmeiSei": 6,
  "getsumeiSei": 1,
  "honmeiName": "六白金星",
  "getsumeiName": "一白水星"
}
```

## プロジェクト構成

クリーンアーキテクチャによる3層構造:

```
src/
├── app/                                    # プレゼンテーション層 (Next.js)
│   ├── api/personal/route.ts               # REST API (GET/POST)
│   └── page.tsx                            # メインページ
│
└── modules/
    ├── domain/
    │   ├── shared/                         # 共有カーネル (StarNumber, Month)
    │   │   ├── types/index.ts
    │   │   └── index.ts                    # 公開API
    │   │
    │   ├── personal/                       # 個人の星 (本命星・月命星)
    │   │   ├── services/
    │   │   │   ├── calculator.ts
    │   │   │   └── starName.ts
    │   │   ├── types/index.ts
    │   │   └── index.ts                    # 公開API
    │   │
    │   └── direction/                      # 方位の吉凶
    │       ├── rules/                      # ドメインルール（純粋関数）
    │       ├── services/
    │       ├── types/index.ts
    │       └── index.ts                    # 公開API
    │
    ├── application/
    │   ├── dtos/direction/                 # DTO（API出力形式）
    │   ├── services/direction/             # アプリケーションサービス
    │   └── usecases/                       # ユースケース
    │
    └── infrastructure/                     # インフラ層 (将来用)
```

### インポート規約

Application層はDomainの公開API（`index.ts`）経由でインポート:

```typescript
// Good: 公開API経由でインポート
import { calculateHonmeiSei, type Month } from "@/modules/domain/personal";
import { decideDirectionStatus, type BoardData } from "@/modules/domain/direction";

// Avoid: 深いパスでのインポート（テスト以外）
import { calculateHonmeiSei } from "@/modules/domain/personal/services/calculator";
```

## ライセンス

MIT
