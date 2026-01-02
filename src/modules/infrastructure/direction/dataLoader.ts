import fs from "fs";
import path from "path";
import type { BoardData, CompatibilityTable } from "@/modules/domain/direction";

/**
 * 盤データを読み込む
 *
 * @param year 対象年
 * @returns 盤データ
 * @throws 該当年のデータがない場合はエラー
 */
export function loadBoardData(year: number): BoardData {
  const filePath = path.join(
    process.cwd(),
    "src/modules/infrastructure/data/boards",
    `${year}.json`
  );
  try {
    const content = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(content) as BoardData;
  } catch {
    throw new Error(`Board data not found for year ${year}`);
  }
}

/**
 * 相性テーブルを取得
 */
export function getCompatibilityTable(): CompatibilityTable {
  const filePath = path.join(process.cwd(), "src/modules/infrastructure/data/compatibility.json");
  const content = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(content) as CompatibilityTable;
}
