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
- **CI/CD**: GitHub Actions
- **デプロイ**: Vercel

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

クリーンアーキテクチャによる3層構造:

```
src/
├── app/                                    # プレゼンテーション層 (Next.js)
│   ├── actions.ts                          # Server Actions
│   ├── components/                         # ページコンポーネント
│   └── page.tsx                            # メインページ
│
├── data/                                   # 静的データ
│   ├── boards/                             # 年盤・月盤データ (JSON)
│   └── compatibility.json                  # 相性テーブル
│
└── modules/
    ├── domain/
    │   ├── shared/                         # 共有カーネル (StarNumber, Month)
    │   ├── personal/                       # 個人の星 (本命星・月命星)
    │   └── direction/                      # 方位の吉凶 (rules/ + services/)
    │
    ├── application/
    │   ├── dtos/                           # DTO（API出力形式）
    │   ├── services/                       # アプリケーションサービス
    │   └── usecases/                       # ユースケース
    │
    ├── infrastructure/                     # データローダー
    │
    └── presentation/
        └── validators/                     # 入力バリデーション (Zod)
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
