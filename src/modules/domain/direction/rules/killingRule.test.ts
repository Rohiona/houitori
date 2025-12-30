import { describe, it, expect } from "vitest";
import { killingRule } from "./killingRule";
import type { BoardDirections } from "../types";

const testBoard: BoardDirections = {
  "1": { star: 5, bad: false },
  "2": { star: 7, bad: false },
  "3": { star: 3, bad: false },  // 西に3
  "4": { star: 2, bad: false },
  "5": { star: 6, bad: false },
  "6": { star: 4, bad: false },
  "7": { star: 8, bad: false },  // 東（西の対面）
  "8": { star: 9, bad: false },
};

describe("killingRule", () => {
  it("自分の星がいる方位を返す（本命殺/月命殺）", () => {
    // 星3が西(3)にいる
    const result = killingRule(testBoard, 3);
    expect(result.has(3)).toBe(true);
  });

  it("対面の方位も返す（的殺）", () => {
    // 西(3)の対面は東(7)
    const result = killingRule(testBoard, 3);
    expect(result.has(7)).toBe(true);
  });

  it("自分の星がいない場合は空のSetを返す", () => {
    // 星1は盤上にいない
    const result = killingRule(testBoard, 1);
    expect(result.size).toBe(0);
  });

  it("複数箇所に自分の星がいる場合はすべて返す", () => {
    const boardWithDuplicates: BoardDirections = {
      "1": { star: 3, bad: false },  // 南に3
      "2": { star: 7, bad: false },
      "3": { star: 3, bad: false },  // 西にも3
      "4": { star: 2, bad: false },
      "5": { star: 6, bad: false },  // 北（南の対面）
      "6": { star: 4, bad: false },
      "7": { star: 8, bad: false },  // 東（西の対面）
      "8": { star: 9, bad: false },
    };

    const result = killingRule(boardWithDuplicates, 3);
    // 南(1), 北(5), 西(3), 東(7)
    expect(result.has(1)).toBe(true);
    expect(result.has(5)).toBe(true);
    expect(result.has(3)).toBe(true);
    expect(result.has(7)).toBe(true);
  });
});
