import {
  findBadDirections,
  findKillingDirections,
  findGoodDirections,
  DIRECTION_NUMBERS,
} from "@/modules/domain/direction/services/judgment";
import type {
  StarNumber,
  DirectionNumber,
  DirectionStatus,
  BoardDirections,
  CompatibilityTable,
} from "@/modules/domain/direction/types";

/**
 * 方位ステータス判定サービス
 *
 * ドメインの判定関数を統合して最終ステータスを決定する。
 * Application層の責務:
 * - 複数のドメイン判定の統合
 * - 優先度ルール（凶 > 吉 > 無印）の適用
 */
export class DirectionStatusService {
  constructor(private readonly compatibility: CompatibilityTable) {}

  /**
   * 1つの星に対する方位の吉凶を判定
   * @param board 盤データ
   * @param star 本命星または月命星
   * @returns 方角番号 -> ステータス のRecord
   */
  calculate(
    board: BoardDirections,
    star: StarNumber
  ): Record<DirectionNumber, DirectionStatus> {
    const result = {} as Record<DirectionNumber, DirectionStatus>;

    // 凶の判定
    const badDirections = findBadDirections(board);
    const killingDirections = findKillingDirections(board, star);

    // 吉の判定
    const goodDirections = findGoodDirections(board, star, this.compatibility);

    for (const direction of DIRECTION_NUMBERS) {
      // 凶判定（五黄殺/暗剣殺、本命殺/的殺）
      if (badDirections.has(direction) || killingDirections.has(direction)) {
        result[direction] = "bad";
      }
      // 吉判定
      else if (goodDirections.has(direction)) {
        result[direction] = "good";
      }
      // 無印
      else {
        result[direction] = "none";
      }
    }

    return result;
  }
}
