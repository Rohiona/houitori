import type { BoardDirections, BoardData, CompatibilityTable } from "../types";

/**
 * テスト用の相性テーブル（五行シート）
 */
export const testCompatibility: CompatibilityTable = {
  "1": [3, 4, 6, 7],
  "2": [5, 8, 9, 6, 7],
  "3": [4, 1, 9],
  "4": [3, 1, 9],
  "5": [2, 8, 9, 6, 7],
  "6": [7, 1, 2, 5, 8],
  "7": [6, 1, 2, 5, 8],
  "8": [2, 5, 9, 6, 7],
  "9": [3, 4, 2, 5, 8],
};

/**
 * テスト用の盤データ（2026年盤の一部）
 */
export const testBoard: BoardDirections = {
  "1": { star: 5, bad: true }, // 南: 五黄殺
  "2": { star: 7, bad: false }, // 南西
  "3": { star: 3, bad: false }, // 西
  "4": { star: 2, bad: false }, // 北西
  "5": { star: 6, bad: true }, // 北: 暗剣殺
  "6": { star: 4, bad: false }, // 北東
  "7": { star: 8, bad: false }, // 東
  "8": { star: 9, bad: false }, // 東南
};

/**
 * テスト用の年間盤データ
 */
export const testBoardData: BoardData = {
  year: 2026,
  yearBoard: testBoard,
  monthBoards: {
    "2": {
      "1": { star: 3, bad: false },
      "2": { star: 5, bad: true },
      "3": { star: 1, bad: false },
      "4": { star: 9, bad: false },
      "5": { star: 4, bad: false },
      "6": { star: 2, bad: true },
      "7": { star: 6, bad: false },
      "8": { star: 7, bad: false },
    },
  },
};
