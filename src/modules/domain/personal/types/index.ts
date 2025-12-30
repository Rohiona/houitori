/**
 * Personal Domain Types
 *
 * 本命星・月命星計算に関する型定義
 */

import type { StarNumber, StarName } from "../../shared/types";

// Shared Kernelからの再エクスポート
export type { StarNumber, StarName, Month } from "../../shared/types";
export { STAR_NAMES } from "../../shared/types";

/**
 * 計算結果
 */
export interface KigakuResult {
  honmeiSei: StarNumber;
  getsumeiSei: StarNumber;
  honmeiName: StarName;
  getsumeiName: StarName;
}
