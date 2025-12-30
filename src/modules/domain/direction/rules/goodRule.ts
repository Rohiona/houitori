import type {
  StarNumber,
  DirectionNumber,
  BoardDirections,
  CompatibilityTable,
} from "../types";

/**
 * 吉方位の判定
 *
 * 相性テーブルに基づき、吉となる方位を返す
 *
 * @param board 盤データ
 * @param star 本命星または月命星
 * @param compatibility 相性テーブル
 * @returns 吉となる方角番号のSet
 */
export function goodRule(
  board: BoardDirections,
  star: StarNumber,
  compatibility: CompatibilityTable
): Set<DirectionNumber> {
  const result = new Set<DirectionNumber>();
  const compatibleStars = compatibility[String(star)] || [];

  for (const dirStr of Object.keys(board)) {
    const direction = Number(dirStr) as DirectionNumber;
    const cell = board[dirStr];

    if (compatibleStars.includes(cell.star)) {
      result.add(direction);
    }
  }

  return result;
}
