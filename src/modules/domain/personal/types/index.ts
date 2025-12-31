/**
 * Personal Domain Types
 *
 * 本命星・月命星計算に関する型定義
 */

import type { StarNumber } from "../../shared/types";

// Shared Kernelからの再エクスポート
export type { StarNumber, Month } from "../../shared/types";
export { STAR_NAMES } from "../../shared/types";

/**
 * 計算結果（数値のみ、名前はフロントでi18n処理）
 */
export interface KigakuResult {
  honmeiSei: StarNumber;
  getsumeiSei: StarNumber;
}
