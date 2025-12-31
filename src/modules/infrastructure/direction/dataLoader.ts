import type { BoardData, CompatibilityTable } from "@/modules/domain/direction";
import compatibilityData from "@/data/compatibility.json";

/**
 * 盤データを読み込む
 *
 * @param year 対象年
 * @returns 盤データ
 * @throws 該当年のデータがない場合はエラー
 */
export async function loadBoardData(year: number): Promise<BoardData> {
  try {
    const data = await import(`@/data/boards/${year}.json`);
    return data.default as BoardData;
  } catch {
    throw new Error(`Board data not found for year ${year}`);
  }
}

/**
 * 相性テーブルを取得
 */
export function getCompatibilityTable(): CompatibilityTable {
  return compatibilityData as CompatibilityTable;
}
