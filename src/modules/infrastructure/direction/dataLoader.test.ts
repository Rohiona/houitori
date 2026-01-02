import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import { loadBoardData, getCompatibilityTable } from "./dataLoader";

const DIRECTION_KEYS = ["1", "2", "3", "4", "5", "6", "7", "8"];
const MONTH_KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
const STAR_NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

/**
 * 盤データのディレクトリから全年のJSONファイルを取得
 */
function getAvailableYears(): number[] {
  const boardsDir = path.join(process.cwd(), "src/modules/infrastructure/data/boards");
  const files = fs.readdirSync(boardsDir);
  return files
    .filter((f) => f.endsWith(".json"))
    .map((f) => parseInt(f.replace(".json", ""), 10))
    .filter((year) => !isNaN(year));
}

describe("dataLoader", () => {
  describe("loadBoardData", () => {
    const years = getAvailableYears();

    it.each(years)("%i年の盤データが正しい構造を持つ", (year) => {
      const data = loadBoardData(year);

      // 基本構造
      expect(data).toHaveProperty("year", year);
      expect(data).toHaveProperty("yearBoard");
      expect(data).toHaveProperty("monthBoards");

      // 年盤: 8方位すべてのキーが存在
      for (const dirKey of DIRECTION_KEYS) {
        expect(data.yearBoard).toHaveProperty(dirKey);
        const cell = data.yearBoard[dirKey];
        expect(STAR_NUMBERS).toContain(cell.star);
        expect(typeof cell.bad).toBe("boolean");
      }

      // 月盤: 12ヶ月すべてが存在し、各月に8方位がある
      for (const monthKey of MONTH_KEYS) {
        expect(data.monthBoards).toHaveProperty(monthKey);
        const monthBoard = data.monthBoards[monthKey];

        for (const dirKey of DIRECTION_KEYS) {
          expect(monthBoard).toHaveProperty(dirKey);
          const cell = monthBoard[dirKey];
          expect(STAR_NUMBERS).toContain(cell.star);
          expect(typeof cell.bad).toBe("boolean");
        }
      }
    });

    it("存在しない年のデータを読み込むとエラー", () => {
      expect(() => loadBoardData(1900)).toThrow();
    });
  });

  describe("getCompatibilityTable", () => {
    it("相性テーブルが正しい構造を持つ", () => {
      const table = getCompatibilityTable();

      // 9つの星すべてのキーが存在
      for (const star of STAR_NUMBERS) {
        const key = String(star);
        expect(table).toHaveProperty(key);
        expect(Array.isArray(table[key])).toBe(true);

        // 各吉星が有効な星番号であること
        for (const goodStar of table[key]) {
          expect(STAR_NUMBERS).toContain(goodStar);
        }
      }
    });
  });
});
