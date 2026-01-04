/**
 * Direction DTOs
 *
 * 方位判定のAPI出力形式を定義
 * Domain層のビジネスロジックとは独立した、表示・出力用の構造
 */

import type { StarNumber } from "@/core/domain/shared";
import type { DirectionKey, DirectionStatus } from "@/core/domain/direction";

/**
 * 吉凶判定結果
 */
export interface DirectionResultStatus {
  status: DirectionStatus;
}

/**
 * 方位ごとの判定結果
 */
export interface DirectionResult {
  direction: DirectionKey;
  star: StarNumber;
  honmeiResult: DirectionResultStatus;
  getsumeiResult: DirectionResultStatus;
}

/**
 * 月ごとの方位判定結果
 */
export interface MonthDirections {
  directions: DirectionResult[];
}

/**
 * 年間の方位判定結果（内部使用）
 */
export interface YearDirectionResult {
  year: number;
  directions: DirectionResult[]; // 年盤
  months: Record<string, MonthDirections>; // 月盤（"1"〜"12"）
}

/**
 * 個人ごとの方位判定結果（API出力形式）
 */
export interface PersonDirectionResult {
  honmeiSei: StarNumber;
  getsumeiSei: StarNumber;
  directions: DirectionResult[]; // 年盤
  months: Record<string, MonthDirections>; // 月盤（"1"〜"12"）
}

/**
 * 方位計算API応答（API出力形式）
 */
export interface DirectionApiResponse {
  year: number;
  persons: PersonDirectionResult[];
}
