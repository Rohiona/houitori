/**
 * Direction module public API
 *
 * 外部に公開するのは decideDirectionStatus のみ。
 * rules/ 配下は内部実装（テスト用に export はしているが、外部からは使わない想定）。
 */
export { decideDirectionStatus } from "./services/statusDecider";

// Types are re-exported for convenience
export type {
  DirectionNumber,
  DirectionStatus,
  DirectionResult,
  BoardDirections,
  BoardData,
  MonthDirections,
  YearDirectionResult,
  CompatibilityTable,
} from "./types";

export { DIRECTION_NUMBERS, DIRECTION_NAMES, OPPOSITE_DIRECTIONS } from "./types";
