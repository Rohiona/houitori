import { describe, it, expect } from "vitest";
import { goodRule } from "./goodRule";
import type { BoardDirections, CompatibilityTable } from "../types";

const testBoard: BoardDirections = {
  "1": { star: 5, bad: false },
  "2": { star: 7, bad: false },  // 南西に7
  "3": { star: 3, bad: false },  // 西に3
  "4": { star: 2, bad: false },
  "5": { star: 6, bad: false },  // 北に6
  "6": { star: 4, bad: false },  // 北東に4
  "7": { star: 8, bad: false },
  "8": { star: 9, bad: false },
};

// 星1の相性: 3, 4, 6, 7
const compatibility: CompatibilityTable = {
  "1": [3, 4, 6, 7],
};

describe("goodRule", () => {
  it("相性の良い星がいる方位を返す", () => {
    const result = goodRule(testBoard, 1, compatibility);

    // 星1の相性: 3, 4, 6, 7
    // 南西(2)に7、西(3)に3、北(5)に6、北東(6)に4
    expect(result.has(2)).toBe(true);  // 7
    expect(result.has(3)).toBe(true);  // 3
    expect(result.has(5)).toBe(true);  // 6
    expect(result.has(6)).toBe(true);  // 4
  });

  it("相性の良い星がいない方位は含まない", () => {
    const result = goodRule(testBoard, 1, compatibility);

    // 南(1)に5、北西(4)に2、東(7)に8、東南(8)に9 は相性リストにない
    expect(result.has(1)).toBe(false);
    expect(result.has(4)).toBe(false);
    expect(result.has(7)).toBe(false);
    expect(result.has(8)).toBe(false);
  });

  it("相性テーブルに星がない場合は空のSetを返す", () => {
    const result = goodRule(testBoard, 9, compatibility);
    expect(result.size).toBe(0);
  });
});
