# Houitori - 九星気学 方位吉凶計算アプリ

**[English](README.md)**

生年月日から九星気学の本命星・月命星を計算し、年盤・月盤による方位の吉凶を判定するWebアプリケーションです。Next.js 16とTypeScriptで構築しています。

**本番環境**: https://houitori.vercel.app/

## 機能

- **本命星・月命星の計算**: 生年月日から九星を算出
- **方位吉凶の判定**: 年盤・月盤それぞれで8方位の吉凶を表示
- **複数人対応**: 最大5人まで同時に計算可能
- **レスポンシブ対応**: PC・スマートフォン両対応

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
- **UIコンポーネント**: shadcn/ui
- **フォーム**: React Hook Form
- **バリデーション**: Zod
- **テスト**: Vitest
- **フォーマッタ**: Prettier
- **CI/CD**: GitHub Actions（ライセンスチェック含む）
- **デプロイ**: Vercel

## CI

GitHub Actionsで以下をチェックしています：

- Lint（ESLint）
- テスト（Vitest）
- ビルド（Next.js）
- **ライセンスチェック**: GPL/Copyleft系ライセンスのパッケージが含まれていないことを確認

### ブロックするライセンス

商用利用・ポートフォリオ利用のため、以下のCopyleft系ライセンスを持つパッケージの追加をCIでブロックしています：

- GPL, GPL-2.0, GPL-3.0
- LGPL, LGPL-2.0, LGPL-2.1, LGPL-3.0
- AGPL, AGPL-3.0
- CC-BY-SA
- MPL-2.0

## はじめに

### 必要なもの

- Docker および Docker Compose

### 開発環境の起動

```bash
make setup   # Git hooks設定（初回のみ）
make dev     # 開発サーバーを起動
make test    # テストを実行
make lint    # Lintを実行
make format  # Prettierでコードを整形
make build   # 本番ビルド
make clean   # コンテナ・イメージ・ボリュームを削除
```

アプリケーションは `http://localhost:3000` で利用できます。

## アーキテクチャ

### Server Actions

計算処理はNext.jsのServer Actionsを使用しています。クライアントから計算ボタンを押すと、サーバーサイドで計算が実行されます。

```typescript
// src/app/actions.ts
"use server";

export async function calculateDirections(input: DirectionRequest): Promise<ActionResult> {
  // バリデーション → データ読み込み → 計算 → 結果返却
}
```

### プロジェクト構成

Feature-based + クリーンアーキテクチャ:

```
src/
├── app/                        # Next.js ルーティング専用
│   ├── page.tsx                # エントリポイント（featuresを呼ぶだけ）
│   ├── layout.tsx
│   └── providers.tsx
│
├── features/                   # 機能モジュール（UI + API）
│   ├── home/ui/                # ホーム画面コンポーネント
│   └── directions/search/      # 方位検索機能
│       ├── ui/                 # Reactコンポーネント
│       └── api/                # Server Actions
│
├── shared/                     # 横断的関心事
│   ├── ui/                     # shadcn/ui コンポーネント
│   ├── lib/                    # ユーティリティ（i18n, cn）
│   └── hooks/                  # 共有フック
│
└── core/                       # ビジネスロジック（クリーンアーキテクチャ）
    ├── domain/
    │   ├── shared/             # 共有カーネル (StarNumber, Month)
    │   ├── personal/           # 個人の星（本命星・月命星）
    │   └── direction/          # 方位の吉凶（rules/）
    │
    ├── application/
    │   ├── dtos/               # Data Transfer Objects（型の再エクスポート含む）
    │   ├── services/           # アプリケーションサービス
    │   └── usecases/           # ユースケース
    │
    └── infrastructure/
        └── data/               # JSONデータファイル
```

### インポート規約

featuresはapplication層経由でインポート（domain直接参照は禁止）:

```typescript
// Good: features → core/application
import { DirectionCalculationUseCase } from "@/core/application/usecases/DirectionCalculationUseCase";
import type { DirectionResult, StarNumber } from "@/core/application/dtos/direction";

// Good: features → shared
import { useI18n } from "@/shared/lib/i18n";
import { Button } from "@/shared/ui/button";

// Avoid: features → core/domain（直接参照禁止）
import { calculateHonmeiSei } from "@/core/domain/personal";
```

## ライセンス

MIT
