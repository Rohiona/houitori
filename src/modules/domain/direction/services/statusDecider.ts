import { killingRule } from "../rules/killingRule";
import { badRule } from "../rules/badRule";
import { goodRule } from "../rules/goodRule";
import type {
  StarNumber,
  DirectionNumber,
  DirectionStatus,
  BoardDirections,
  CompatibilityTable,
} from "../types";
import { DIRECTION_NUMBERS } from "../types";

/**
 * 方位の吉凶ステータスを決定する
 *
 * 各ルールの判定結果を統合し、優先度（凶 > 吉 > 無印）を適用して
 * 最終的なステータスを決定する。
 *
 * @param board 盤データ
 * @param star 本命星または月命星
 * @param compatibility 相性テーブル
 * @returns 方角番号 -> ステータス のRecord
 */
export function decideDirectionStatus(
  board: BoardDirections,
  star: StarNumber,
  compatibility: CompatibilityTable
): Record<DirectionNumber, DirectionStatus> {
  const bad = badRule(board);
  const killing = killingRule(board, star);
  const good = goodRule(board, star, compatibility);

  const result = {} as Record<DirectionNumber, DirectionStatus>;

  for (const direction of DIRECTION_NUMBERS) {
    // 優先度: 凶 > 吉 > 無印
    if (bad.has(direction) || killing.has(direction)) {
      result[direction] = "bad";
    } else if (good.has(direction)) {
      result[direction] = "good";
    } else {
      result[direction] = "none";
    }
  }

  return result;
}
