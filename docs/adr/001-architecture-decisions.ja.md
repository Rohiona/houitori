# ADR-001: Houitori アーキテクチャ決定記録

## ステータス

承認済み

## コンテキスト

Houitori は九星気学の計算を行うWebアプリケーションです。主な機能:

- 入力: 生年・生月
- 出力: 本命星・月命星（番号と日本語名）
- データベースなし、外部API呼び出しなし、ユーザー認証なし

本ドキュメントでは、採用したアーキテクチャ上の決定と、**採用しなかった決定**について説明します。

## 決定事項

### 1. レイヤードアーキテクチャ（採用）

**決定**: Clean Architecture を簡略化した Domain / Application / Presentation の3層構造を採用。

```
src/
├── app/                        # Presentation層 (Next.js)
└── modules/
    ├── domain/
    │   └── personal/           # 個人の星 (services/ + types/)
    ├── application/usecases/   # ユースケース
    └── infrastructure/         # 外部サービス連携（現在は空）
```

**理由**:

- 責務の明確な分離
- ドメインロジックを単独でテスト可能
- 新規参画者が理解しやすい
- 将来機能追加時の拡張ポイントを提供

**トレードオフ**: シンプルなアプリにはやや過剰だが、明確さのメリットがコストを上回る。

---

### 2. DIコンテナ（不採用）

**決定**: DIコンテナ（tsyringe, inversify 等）を使用しない。

**理由**:

DIコンテナを導入する主な目的は**テスタビリティの向上**（依存をモックに差し替え可能にする）です。しかし、このアプリでは以下の理由によりDIなしでもテスタビリティが確保されています:

1. **ドメイン層が純粋関数**: `calculateHonmeiSei()`, `calculateGetsumeiSei()` は入力に対して常に同じ出力を返す純粋関数。外部依存がないため、モックなしで直接テスト可能。

2. **外部I/Oがない**: データベース接続、HTTP通信、ファイルシステムアクセスなど、テスト時に差し替えたい依存が存在しない。

3. **UseCaseがドメイン関数を直接呼び出し**: UseCaseはドメイン層の純粋関数を組み合わせるだけなので、UseCase自体もモックなしでテスト可能。

```typescript
// 現状: シンプルで十分、かつテスタブル
const useCase = new CalculateKigakuUseCase();
const result = useCase.execute(1985, 6);
expect(result.honmeiSei).toBe(6); // モック不要で直接テスト可能

// このアプリには過剰（モックすべき依存がない）
@injectable()
class CalculateKigakuUseCase {
  constructor(@inject("KigakuRepository") private repo: IKigakuRepository) {}
}
```

**DIが必要になるケース**:

- `KigakuRepository` を導入してDBに計算結果を保存する場合
- 外部の暦APIを呼び出して節入り日を取得する場合
- これらの依存をテスト時にモックに差し替えたい場合

**再検討のタイミング**: I/Oを伴う依存が追加され、テスト時にモックが必要になった場合。

---

### 3. Result型 / Eitherパターン（不採用）

**決定**: Result/Either型ではなく、従来の `throw` によるエラーハンドリングを採用。

**理由**:

- エラーケースが1つだけ（1900年未満の生年）
- エラーは通常フローではなく、真に例外的なケース
- TypeScriptの型システムはResultのハンドリングを強制しない
- 得られるメリットに対して認知的オーバーヘッドが大きい

```typescript
// 現状: 明確でイディオマティック
if (birthYear < 1900) {
  throw new Error("生年は1900年以降の整数を指定してください");
}

// このアプリには過剰
function calculateHonmeiSei(year: number): Result<StarNumber, ValidationError>;
```

**再検討のタイミング**: 複数のエラー型が必要になった場合、またはエラーが例外ではなく期待される結果となる場合。

---

### 4. zodによる入力バリデーション（不採用）

**決定**: スキーマバリデーションライブラリではなく、APIルート内での手動バリデーションを採用。

**理由**:

- バリデーション対象が2フィールドのみ（birthYear, birthMonth）
- ルールがシンプル（整数の範囲チェック）
- zodを追加するとバンドルサイズが増加
- この規模では手動バリデーションが読みやすく保守しやすい

**再検討のタイミング**: 入力が複雑になった場合（ネストしたオブジェクト、多数のフィールド、複雑なルール）。

---

### 5. バレルファイル / Index エクスポート（不採用）

**決定**: index.ts での再エクスポートではなく、ソースファイルからの直接インポートを採用。

```typescript
// 採用: 直接インポート
import { calculateHonmeiSei } from "@/modules/domain/kigaku/calculator";
import type { Month } from "@/modules/domain/kigaku/types";

// 不採用: バレルファイル
import { calculateHonmeiSei, Month } from "@/modules/domain/kigaku";
```

**理由**:

- 依存関係が明示的でわかりやすい
- Tree-shakingが効きやすい
- 循環依存の問題を回避できる
- IDEのナビゲーションが直接ソースに到達する

---

### 6. calculator と starName の分離（採用）

**決定**: 純粋な計算ロジック（`calculator.ts`）と名前マッピング（`starName.ts`）を分離。

**理由**:

- 単一責任の原則（SRP）
- `calculator.ts`: 数学的な計算
- `starName.ts`: ローカライゼーションの関心事（将来: 多言語対応）
- 個別にテストしやすい
- i18n対応時の明確な拡張ポイント

---

## 将来の拡張ポイント

アプリケーションが成長した場合、以下のステップを推奨:

| 機能追加                       | 推奨する変更                                                                      |
| ------------------------------ | --------------------------------------------------------------------------------- |
| データベース保存               | `application/ports/` にRepositoryインターフェースを追加、`infrastructure/` で実装 |
| 外部カレンダーAPI              | CalendarClientインターフェースを追加、HttpCalendarClientを実装                    |
| 多言語対応                     | `getStarName()` にlocaleパラメータを追加                                          |
| 複雑なバリデーション           | zodスキーマを導入                                                                 |
| 共有依存を持つ複数ユースケース | 軽量なDIを検討                                                                    |

## 結果

### ポジティブ

- シンプルで保守しやすいコードベース
- 開発イテレーションが速い
- 新規参画者のオンボーディングが容易
- 不要な抽象化がない

### ネガティブ

- 一見「すごそう」には見えない（派手なパターンがない）
- 必要な時だけ複雑性を追加する規律が求められる

## 参考文献

- [Clean Architecture by Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [YAGNI原則](https://martinfowler.com/bliki/Yagni.html)
- [Simple Made Easy by Rich Hickey](https://www.infoq.com/presentations/Simple-Made-Easy/)
