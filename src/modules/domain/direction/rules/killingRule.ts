import type { StarNumber, DirectionNumber, BoardDirections } from "../types";
import { OPPOSITE_DIRECTIONS } from "../types";

/**
 * 本命殺・月命殺・的殺の判定
 *
 * - 本命殺/月命殺: その方位に自分の星がいる
 * - 的殺: 本命殺/月命殺の対面方位
 *
 * @param board 盤データ
 * @param star 本命星または月命星
 * @returns 殺となる方角番号のSet
 */
export function killingRule(
  board: BoardDirections,
  star: StarNumber
): Set<DirectionNumber> {
  const result = new Set<DirectionNumber>();

  for (const dirStr of Object.keys(board)) {
    const direction = Number(dirStr) as DirectionNumber;
    const cell = board[dirStr];

    if (cell.star === star) {
      result.add(direction);
      result.add(OPPOSITE_DIRECTIONS[direction]);
    }
  }

  return result;
}
