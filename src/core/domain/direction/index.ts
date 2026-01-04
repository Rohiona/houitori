/**
 * Direction Domain - Public API
 *
 * 外部に公開するのは decideDirectionStatus のみ。
 * rules/ 配下は内部実装（テスト用に export はしているが、外部からは使わない想定）。
 */
export { decideDirectionStatus } from "./services/statusDecider";

// Domain types
export type {
  DirectionNumber,
  DirectionKey,
  DirectionStatus,
  DirectionCell,
  BoardDirections,
  BoardData,
  CompatibilityTable,
} from "./types";

export { DIRECTION_NUMBERS, DIRECTION_KEYS, DIRECTION_NAMES, OPPOSITE_DIRECTIONS } from "./types";

// Re-export shared types
export type { StarNumber, Month } from "./types";
