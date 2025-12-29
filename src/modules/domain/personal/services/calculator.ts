import { Month, StarNumber } from "../types";

/**
 * 生年から本命星を計算する
 * @param birthYear 生年（西暦4桁）
 * @returns 本命星の番号（1-9）
 */
export function calculateHonmeiSei(birthYear: number): StarNumber {
  if (!Number.isInteger(birthYear) || birthYear < 1900) {
    throw new Error("生年は1900年以降の整数を指定してください");
  }

  const remainder = birthYear % 9;

  // VBAロジックの移植
  // Case 0: 2, Case 1: 1, Case Else: 11 - remainder
  if (remainder === 0) return 2;
  if (remainder === 1) return 1;
  return (11 - remainder) as StarNumber;
}

/**
 * 本命星と生月から月命星を計算する
 * @param honmeiSei 本命星の番号
 * @param birthMonth 生月（1-12）
 * @returns 月命星の番号（1-9）
 */
export function calculateGetsumeiSei(
  honmeiSei: StarNumber,
  birthMonth: Month
): StarNumber {
  // 本命星グループごとの月命星テーブル
  // インデックス: [0]=1月, [1]=2月, ... [11]=12月
  const tables: Record<string, readonly StarNumber[]> = {
    // 本命星 1, 4, 7 のグループ
    group147: [6, 8, 7, 6, 5, 4, 3, 2, 1, 9, 8, 7],
    // 本命星 3, 6, 9 のグループ
    group369: [3, 5, 4, 3, 2, 1, 9, 8, 7, 6, 5, 4],
    // 本命星 2, 5, 8 のグループ
    group258: [9, 2, 1, 9, 8, 7, 6, 5, 4, 3, 2, 1],
  };

  let table: readonly StarNumber[];

  if (honmeiSei === 1 || honmeiSei === 4 || honmeiSei === 7) {
    table = tables.group147;
  } else if (honmeiSei === 3 || honmeiSei === 6 || honmeiSei === 9) {
    table = tables.group369;
  } else {
    // 2, 5, 8
    table = tables.group258;
  }

  return table[birthMonth - 1];
}

