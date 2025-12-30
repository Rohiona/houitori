import { buildBoardDirectionResult } from "@/modules/application/services/direction/BoardDirectionResultBuilder";
import type {
  StarNumber,
  BoardData,
  MonthDirections,
  YearDirectionResult,
  CompatibilityTable,
} from "@/modules/domain/direction/types";

/**
 * 年間の方位吉凶計算ユースケース
 *
 * 年盤・月盤を反復処理し、結果を集約する。
 * 盤1枚の計算は BoardDirectionResultBuilder に委譲。
 */
export class DirectionYearCalculationUseCase {
  constructor(private readonly compatibility: CompatibilityTable) {}

  /**
   * 年間の方位吉凶を計算
   * @param boardData 盤マスタ
   * @param honmeiSei 本命星
   * @param getsumeiSei 月命星
   * @returns 年間の方位判定結果
   */
  execute(
    boardData: BoardData,
    honmeiSei: StarNumber,
    getsumeiSei: StarNumber
  ): YearDirectionResult {
    // 年盤の計算
    const yearDirections = buildBoardDirectionResult(
      boardData.yearBoard,
      honmeiSei,
      getsumeiSei,
      this.compatibility
    );

    // 月盤の計算
    const months: Record<string, MonthDirections> = {};
    for (const monthStr of Object.keys(boardData.monthBoards)) {
      const monthBoard = boardData.monthBoards[monthStr];
      months[monthStr] = {
        directions: buildBoardDirectionResult(
          monthBoard,
          honmeiSei,
          getsumeiSei,
          this.compatibility
        ),
      };
    }

    return {
      year: boardData.year,
      directions: yearDirections,
      months,
    };
  }
}
