/**
 * 共有ドメイン型（Shared Kernel）
 *
 * personal / direction 両ドメインで使用される基本概念
 */

/**
 * 九星の番号（1-9）
 */
export type StarNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

/**
 * 九星の名称
 */
export const STAR_NAMES = {
  1: "一白水星",
  2: "二黒土星",
  3: "三碧木星",
  4: "四緑木星",
  5: "五黄土星",
  6: "六白金星",
  7: "七赤金星",
  8: "八白土星",
  9: "九紫火星",
} as const;

export type StarName = (typeof STAR_NAMES)[StarNumber];

/**
 * 月（1-12）
 */
export type Month = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
