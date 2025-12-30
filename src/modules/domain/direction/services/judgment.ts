import type {
  StarNumber,
  DirectionNumber,
  BoardDirections,
  CompatibilityTable,
} from "../types";
import { OPPOSITE_DIRECTIONS } from "../types";

/**
 * 方角番号のリスト
 */
export const DIRECTION_NUMBERS: DirectionNumber[] = [1, 2, 3, 4, 5, 6, 7, 8];

/**
 * 本命殺・的殺の判定
 * @param board 盤データ
 * @param star 本命星または月命星
 * @returns 殺となる方角番号のSet
 */
export function findKillingDirections(
  board: BoardDirections,
  star: StarNumber
): Set<DirectionNumber> {
  const killingDirections = new Set<DirectionNumber>();

  for (const dirStr of Object.keys(board)) {
    const direction = Number(dirStr) as DirectionNumber;
    const cell = board[dirStr];

    // 本命殺/月命殺: その方位に自分の星がいる
    if (cell.star === star) {
      killingDirections.add(direction);
      // 的殺: 対面の方位
      killingDirections.add(OPPOSITE_DIRECTIONS[direction]);
    }
  }

  return killingDirections;
}

/**
 * 五黄殺・暗剣殺の判定
 * @param board 盤データ
 * @returns 凶となる方角番号のSet
 */
export function findBadDirections(board: BoardDirections): Set<DirectionNumber> {
  const badDirections = new Set<DirectionNumber>();

  for (const dirStr of Object.keys(board)) {
    const direction = Number(dirStr) as DirectionNumber;
    const cell = board[dirStr];

    if (cell.bad) {
      badDirections.add(direction);
    }
  }

  return badDirections;
}

/**
 * 吉方位の判定
 * @param board 盤データ
 * @param star 本命星または月命星
 * @param compatibility 相性テーブル
 * @returns 吉となる方角番号のSet
 */
export function findGoodDirections(
  board: BoardDirections,
  star: StarNumber,
  compatibility: CompatibilityTable
): Set<DirectionNumber> {
  const goodDirections = new Set<DirectionNumber>();
  const compatibleStars = compatibility[String(star)] || [];

  for (const dirStr of Object.keys(board)) {
    const direction = Number(dirStr) as DirectionNumber;
    const cell = board[dirStr];

    // その方位の星が相性の良い星リストに含まれていれば吉
    if (compatibleStars.includes(cell.star)) {
      goodDirections.add(direction);
    }
  }

  return goodDirections;
}


