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
- **CI/CD**: GitHub Actions
- **デプロイ**: Vercel

## はじめに

### 必要なもの

- Docker および Docker Compose

### 開発環境の起動

```bash
# 開発サーバーを起動
docker compose up

# テストを実行
docker compose exec web pnpm test

# Lintを実行
docker compose exec web pnpm lint
```

アプリケーションは `http://localhost:3000` で利用できます。

## APIエンドポイント

### GET /api/kigaku

クエリパラメータから九星を計算します。

```bash
curl "http://localhost:3000/api/kigaku?birthYear=1985&birthMonth=6"
```

### POST /api/kigaku

JSONボディから九星を計算します。

```bash
curl -X POST http://localhost:3000/api/kigaku \
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

```
src/
├── app/
│   ├── api/
│   │   └── kigaku/       # APIルート
│   └── page.tsx          # メインページ
├── lib/
│   └── kigaku/           # 計算ロジック
│       ├── calculator.ts
│       ├── types.ts
│       └── index.ts
└── data/                 # 静的データ（予定）
```

## ライセンス

MIT