import type { DirectionNumber, BoardDirections } from "../types";

/**
 * 五黄殺・暗剣殺の判定
 *
 * 盤データで bad フラグが立っている方位を返す
 *
 * @param board 盤データ
 * @returns 凶となる方角番号のSet
 */
export function badRule(board: BoardDirections): Set<DirectionNumber> {
  const result = new Set<DirectionNumber>();

  for (const dirStr of Object.keys(board)) {
    const direction = Number(dirStr) as DirectionNumber;
    const cell = board[dirStr];

    if (cell.bad) {
      result.add(direction);
    }
  }

  return result;
}
