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
 * 九星の名称（多言語対応）
 * フォールバック: en
 */
export const STAR_NAMES = {
  en: {
    1: "One White Water",
    2: "Two Black Earth",
    3: "Three Jade Wood",
    4: "Four Green Wood",
    5: "Five Yellow Earth",
    6: "Six White Metal",
    7: "Seven Red Metal",
    8: "Eight White Earth",
    9: "Nine Purple Fire",
  },
  ja: {
    1: "一白水星",
    2: "二黒土星",
    3: "三碧木星",
    4: "四緑木星",
    5: "五黄土星",
    6: "六白金星",
    7: "七赤金星",
    8: "八白土星",
    9: "九紫火星",
  },
} as const;

export type SupportedLocale = keyof typeof STAR_NAMES;

/**
 * 星の名前を取得（フォールバック: en）
 */
export function getStarName(star: StarNumber, locale: string): string {
  const names = STAR_NAMES[locale as SupportedLocale] ?? STAR_NAMES.en;
  return names[star];
}

/**
 * 月（1-12）
 */
export type Month = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
