import {
  calculateHonmeiSei,
  calculateGetsumeiSei,
} from "@/modules/domain/kigaku/calculator";
import { getStarName } from "@/modules/domain/kigaku/starName";
import type { Month, KigakuResult } from "@/modules/domain/kigaku/types";

/**
 * 九星気学計算ユースケース
 *
 * ドメインサービスを組み合わせて結果を組み立てる。
 * Application層の責務:
 * - 複数ドメインサービスの調整（オーケストレーション）
 * - トランザクション管理
 * - 外部サービス連携
 */
export class CalculateKigakuUseCase {
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
