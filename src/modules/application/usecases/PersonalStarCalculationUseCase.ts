import {
  calculateHonmeiSei,
  calculateGetsumeiSei,
  type Month,
  type KigakuResult,
} from "@/modules/domain/personal";

/**
 * 個人の星（本命星・月命星）計算ユースケース
 *
 * ドメインサービスを組み合わせて結果を組み立てる。
 * Application層の責務:
 * - 複数ドメインサービスの調整（オーケストレーション）
 * - トランザクション管理
 * - 外部サービス連携
 *
 * 注: 星の名前はフロントでi18n処理するため、数値のみ返す
 */
export class PersonalStarCalculationUseCase {
  execute(birthYear: number, birthMonth: Month): KigakuResult {
    const honmeiSei = calculateHonmeiSei(birthYear);
    const getsumeiSei = calculateGetsumeiSei(honmeiSei, birthMonth);

    return {
      honmeiSei,
      getsumeiSei,
    };
  }
}
