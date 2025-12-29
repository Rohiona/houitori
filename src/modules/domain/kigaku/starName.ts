import { StarNumber, STAR_NAMES, StarName } from "./types";

/**
 * 星の番号から名称を取得する
 * @param starNumber 星の番号（1-9）
 * @returns 星の名称
 */
export function getStarName(starNumber: StarNumber): StarName {
  return STAR_NAMES[starNumber];
}
