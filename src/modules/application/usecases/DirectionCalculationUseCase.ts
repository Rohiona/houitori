import { DIRECTION_NUMBERS } from "@/modules/domain/direction/services/judgment";
import { DirectionStatusService } from "@/modules/application/services/direction/DirectionStatusService";
import type {
  StarNumber,
  DirectionResult,
  BoardDirections,
  BoardData,
  MonthDirections,
  YearDirectionResult,
  CompatibilityTable,
} from "@/modules/domain/direction/types";

/**
 * 方位の吉凶計算ユースケース
 *
 * アプリケーションサービスを組み合わせて結果を組み立てる。
 * Application層の責務:
 * - 複数サービスの調整（オーケストレーション）
 * - 盤データの統合と結果の組み立て
 */
export class DirectionCalculationUseCase {
  private readonly statusService: DirectionStatusService;

  constructor(compatibility: CompatibilityTable) {
    this.statusService = new DirectionStatusService(compatibility);
  }

  /**
   * 1つの盤に対する全方位の吉凶を計算
   * @param board 盤データ
   * @param honmeiSei 本命星
   * @param getsumeiSei 月命星
   * @returns 方位ごとの判定結果配列
   */
  executeBoard(
    board: BoardDirections,
    honmeiSei: StarNumber,
    getsumeiSei: StarNumber
  ): DirectionResult[] {
    const honmeiStatus = this.statusService.calculate(board, honmeiSei);
    const getsumeiStatus = this.statusService.calculate(board, getsumeiSei);

    const results: DirectionResult[] = [];

    for (const direction of DIRECTION_NUMBERS) {
      const cell = board[String(direction)];
      results.push({
        direction,
        star: cell.star,
        honmeiResult: { status: honmeiStatus[direction] },
        getsumeiResult: { status: getsumeiStatus[direction] },
      });
    }

    return results;
  }

  /**
   * 年間の方位吉凶を計算
   * @param boardData 盤マスタ
   * @param honmeiSei 本命星
   * @param getsumeiSei 月命星
   * @returns 年間の方位判定結果
   */
  executeYear(
    boardData: BoardData,
    honmeiSei: StarNumber,
    getsumeiSei: StarNumber
  ): YearDirectionResult {
    // 年盤の計算
    const yearDirections = this.executeBoard(
      boardData.yearBoard,
      honmeiSei,
      getsumeiSei
    );

    // 月盤の計算
    const months: Record<string, MonthDirections> = {};
    for (const monthStr of Object.keys(boardData.monthBoards)) {
      const monthBoard = boardData.monthBoards[monthStr];
      months[monthStr] = {
        directions: this.executeBoard(monthBoard, honmeiSei, getsumeiSei),
      };
    }

    return {
      year: boardData.year,
      directions: yearDirections,
      months,
    };
  }
}
