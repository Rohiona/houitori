# ADR-001: Houitori アーキテクチャ決定記録

## ステータス

承認済み（更新: 2024-12）

## コンテキスト

Houitori は九星気学の計算を行うWebアプリケーションです。主な機能:

- 入力: 生年・生月
- 出力: 本命星・月命星（番号と日本語名）
- 方位の吉凶計算
- データベースなし、外部API呼び出しなし、ユーザー認証なし

本ドキュメントでは、採用したアーキテクチャ上の決定と、**採用しなかった決定**について説明します。

## 決定事項

### 1. レイヤードアーキテクチャ（採用）

**決定**: Clean Architecture を簡略化した Domain / Application / Presentation の3層構造を採用。

```
src/
├── app/                              # Presentation層 (Next.js)
└── modules/
    ├── domain/
    │   ├── shared/                   # 共有カーネル (StarNumber, Month)
    │   ├── personal/                 # 個人の星 (services/ + types/)
    │   └── direction/                # 方位の吉凶 (rules/ + services/)
    ├── application/
    │   ├── dtos/                     # DTO（API出力形式）
    │   ├── services/                 # アプリケーションサービス
    │   └── usecases/                 # ユースケース
    └── infrastructure/               # 外部サービス連携（現在は空）
```

**理由**:

- 責務の明確な分離
- ドメインロジックを単独でテスト可能
- 新規参画者が理解しやすい
- 将来機能追加時の拡張ポイントを提供

**トレードオフ**: シンプルなアプリにはやや過剰だが、明確さのメリットがコストを上回る。

---

### 2. 公開API（index.ts）経由でのインポート（採用）

**決定**: 各ドメインモジュールは `index.ts` を通じて公開APIを提供する。Application層は公開APIからのみインポートする。

```typescript
// Good: 公開API経由でインポート
import { calculateHonmeiSei, type Month } from "@/modules/domain/personal";
import { decideDirectionStatus, type BoardData } from "@/modules/domain/direction";

// Avoid: 深いパスでのインポート（テスト以外）
import { calculateHonmeiSei } from "@/modules/domain/personal/services/calculator";
```

**理由**:

- 層間の境界が明確
- ドメイン内部（例: `rules/`）をApplication層から隠蔽
- モジュール内部のリファクタリングが利用側に影響しにくい
- テストでは内部関数の単体テストのために深いインポートを許可

**トレードオフ**: `index.ts` のエクスポート管理が必要だが、カプセル化のメリットが上回る。

---

### 3. クロスドメイン型のための共有カーネル（採用）

**決定**: 複数ドメインで使用される共通型（StarNumber, Month）は `domain/shared/` に配置する。

```
domain/
├── shared/           # StarNumber, Month, STAR_NAMES
├── personal/         # 共有型を使用
└── direction/        # 共有型を使用
```

**理由**:

- 共有概念への依存が明示的
- personal と direction ドメイン間の循環依存を回避
- Domain-Driven Design の「共有カーネル」パターンに準拠

---

### 4. Application層でのDTO管理（採用）

**決定**: API出力型（DirectionResult, YearDirectionResult）は `application/dtos/` に配置し、ドメイン層には置かない。

**理由**:

- ドメイン層はAPI形式ではなくビジネスロジックに集中
- DTOはドメインモデルとは独立して変更可能
- 明確な分離: ドメイン型は計算用、DTOはAPI出力用

---

### 5. DIコンテナ（不採用）

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

**再検討のタイミング**: I/Oを伴う依存が追加され、テスト時にモックが必要になった場合。

---

### 6. Result型 / Eitherパターン（不採用）

**決定**: Result/Either型ではなく、従来の `throw` によるエラーハンドリングを採用。

**理由**:

- エラーケースが1つだけ（1900年未満の生年）
- エラーは通常フローではなく、真に例外的なケース
- TypeScriptの型システムはResultのハンドリングを強制しない
- 得られるメリットに対して認知的オーバーヘッドが大きい

**再検討のタイミング**: 複数のエラー型が必要になった場合、またはエラーが例外ではなく期待される結果となる場合。

---

### 7. zodによる入力バリデーション（不採用）

**決定**: スキーマバリデーションライブラリではなく、APIルート内での手動バリデーションを採用。

**理由**:

- バリデーション対象が2フィールドのみ（birthYear, birthMonth）
- ルールがシンプル（整数の範囲チェック）
- zodを追加するとバンドルサイズが増加
- この規模では手動バリデーションが読みやすく保守しやすい

**再検討のタイミング**: 入力が複雑になった場合（ネストしたオブジェクト、多数のフィールド、複雑なルール）。

---

### 8. calculator と starName の分離（採用）

**決定**: 純粋な計算ロジック（`calculator.ts`）と名前マッピング（`starName.ts`）を分離。

**理由**:

- 単一責任の原則（SRP）
- `calculator.ts`: 数学的な計算
- `starName.ts`: ローカライゼーションの関心事（将来: 多言語対応）
- 個別にテストしやすい
- i18n対応時の明確な拡張ポイント

---

### 9. ルールベースのドメインロジック（採用）

**決定**: 方位の吉凶ロジックを小さな純粋関数「ルール」に分割し、`domain/direction/rules/` に配置。

```
rules/
├── killingRule.ts    # 本命殺・月命殺・的殺
├── badRule.ts        # 五黄殺・暗剣殺
└── goodRule.ts       # 相性による吉方位
```

**理由**:

- 各ルールが単一責任を持つ
- 各ルールを単独でテストしやすい
- ルールは `statusDecider.ts` で集約
- 既存コードを変更せずに新しいルールを追加可能

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
- 層間の境界が明確

### ネガティブ

- 一見「すごそう」には見えない（派手なパターンがない）
- 必要な時だけ複雑性を追加する規律が求められる

## 参考文献

- [Clean Architecture by Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [YAGNI原則](https://martinfowler.com/bliki/Yagni.html)
- [Simple Made Easy by Rich Hickey](https://www.infoq.com/presentations/Simple-Made-Easy/)
