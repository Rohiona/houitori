import {
  calculateHonmeiSei,
  calculateGetsumeiSei,
} from "@/modules/domain/personal/services/calculator";
import { getStarName } from "@/modules/domain/personal/services/starName";
import type { Month, KigakuResult } from "@/modules/domain/personal/types";

/**
 * 個人の星（本命星・月命星）計算ユースケース
 *
 * ドメインサービスを組み合わせて結果を組み立てる。
 * Application層の責務:
 * - 複数ドメインサービスの調整（オーケストレーション）
 * - トランザクション管理
 * - 外部サービス連携
 */
export class PersonalStarCalculationUseCase {
  execute(birthYear: number, birthMonth: Month): KigakuResult {
    const honmeiSei = calculateHonmeiSei(birthYear);
    const getsumeiSei = calculateGetsumeiSei(honmeiSei, birthMonth);

    return {
      honmeiSei,
      getsumeiSei,
      honmeiName: getStarName(honmeiSei),
      getsumeiName: getStarName(getsumeiSei),
    };
  }
}
