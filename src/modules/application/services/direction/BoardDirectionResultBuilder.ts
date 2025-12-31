import {
  decideDirectionStatus,
  DIRECTION_NUMBERS,
  DIRECTION_KEYS,
  type StarNumber,
  type BoardDirections,
  type CompatibilityTable,
} from "@/modules/domain/direction";
import type { DirectionResult } from "@/modules/application/dtos/direction";

/**
 * 盤1枚から方位判定結果を組み立てる
 *
 * 本命星・月命星の両方に対してステータスを計算し、
 * DirectionResult[] を構築する。
 *
 * @param board 盤データ
 * @param honmeiSei 本命星
 * @param getsumeiSei 月命星
 * @param compatibility 相性テーブル
 * @returns 方位ごとの判定結果配列
 */
export function buildBoardDirectionResult(
  board: BoardDirections,
  honmeiSei: StarNumber,
  getsumeiSei: StarNumber,
  compatibility: CompatibilityTable
): DirectionResult[] {
  const honmeiStatus = decideDirectionStatus(board, honmeiSei, compatibility);
  const getsumeiStatus = decideDirectionStatus(board, getsumeiSei, compatibility);

  const results: DirectionResult[] = [];

  for (const direction of DIRECTION_NUMBERS) {
    const cell = board[String(direction)];
    results.push({
      direction: DIRECTION_KEYS[direction],
      star: cell.star,
      honmeiResult: { status: honmeiStatus[direction] },
      getsumeiResult: { status: getsumeiStatus[direction] },
    });
  }

  return results;
}
