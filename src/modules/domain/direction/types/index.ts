/**
 * Direction Domain Types
 *
 * 方位判定ドメインの型定義
 * ビジネスロジックに必要な概念のみを定義
 */

import type { StarNumber } from "../../shared/types";

/**
 * 方角番号（1-8）
 * 1:南, 2:南西, 3:西, 4:北西, 5:北, 6:北東, 7:東, 8:東南
 */
export type DirectionNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

/**
 * 方角の名称
 */
export const DIRECTION_NAMES = {
  1: "南",
  2: "南西",
  3: "西",
  4: "北西",
  5: "北",
  6: "北東",
  7: "東",
  8: "東南",
} as const;

export type DirectionName = (typeof DIRECTION_NAMES)[DirectionNumber];

/**
 * 方角番号のリスト
 */
export const DIRECTION_NUMBERS: DirectionNumber[] = [1, 2, 3, 4, 5, 6, 7, 8];

/**
 * 対面方角のマッピング
 * 南⟷北, 南西⟷北東, 西⟷東, 北西⟷東南
 */
export const OPPOSITE_DIRECTIONS: Record<DirectionNumber, DirectionNumber> = {
  1: 5, // 南 ⟷ 北
  2: 6, // 南西 ⟷ 北東
  3: 7, // 西 ⟷ 東
  4: 8, // 北西 ⟷ 東南
  5: 1,
  6: 2,
  7: 3,
  8: 4,
};

/**
 * 吉凶ステータス
 */
export type DirectionStatus = "none" | "good" | "bad";

/**
 * 盤の1セル（方角ごとのデータ）
 */
export interface DirectionCell {
  star: StarNumber;
  bad: boolean; // 五黄殺/暗剣殺
}

/**
 * 盤データ（年盤または月盤）
 *
 * Note: Record<string, ...> としているのはJSONパース時の都合。
 * 実際には DirectionNumber("1"〜"8") のキーのみを持つことを期待。
 * ランタイムバリデーションはデータ読み込み層で行う想定。
 */
export type BoardDirections = Record<string, DirectionCell>;

/**
 * 盤マスタ（1年分）
 */
export interface BoardData {
  year: number;
  yearBoard: BoardDirections;
  monthBoards: Record<string, BoardDirections>;
}

/**
 * 吉方位判定テーブル（五行シート）
 * キー: 本命星/月命星, 値: 吉となる星の配列
 */
export type CompatibilityTable = Record<string, StarNumber[]>;

// Re-export shared types for convenience
export type { StarNumber, Month } from "../../shared/types";
