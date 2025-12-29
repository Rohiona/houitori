import { describe, it, expect } from "vitest";
import {
  calculateHonmeiSei,
  calculateGetsumeiSei,
  getStarName,
  calculateKigaku,
} from "./calculator";

describe("calculateHonmeiSei", () => {
  it("should calculate correct honmei sei for various years", () => {
    // 年 % 9 = 0 → 2
    expect(calculateHonmeiSei(1980)).toBe(2); // 1980 % 9 = 0
    expect(calculateHonmeiSei(2007)).toBe(2); // 2007 % 9 = 0

    // 年 % 9 = 1 → 1
    expect(calculateHonmeiSei(1981)).toBe(1); // 1981 % 9 = 1
    expect(calculateHonmeiSei(1990)).toBe(1); // 1990 % 9 = 1

    // 年 % 9 = 2 → 9
    expect(calculateHonmeiSei(1982)).toBe(9); // 1982 % 9 = 2

    // 年 % 9 = 3 → 8
    expect(calculateHonmeiSei(1983)).toBe(8); // 1983 % 9 = 3

    // 年 % 9 = 4 → 7
    expect(calculateHonmeiSei(1984)).toBe(7); // 1984 % 9 = 4

    // 年 % 9 = 5 → 6
    expect(calculateHonmeiSei(1985)).toBe(6); // 1985 % 9 = 5

    // 年 % 9 = 6 → 5
    expect(calculateHonmeiSei(1986)).toBe(5); // 1986 % 9 = 6

    // 年 % 9 = 7 → 4
    expect(calculateHonmeiSei(1987)).toBe(4); // 1987 % 9 = 7

    // 年 % 9 = 8 → 3
    expect(calculateHonmeiSei(1988)).toBe(3); // 1988 % 9 = 8
  });

  it("should throw error for invalid year", () => {
    expect(() => calculateHonmeiSei(1899)).toThrow();
    expect(() => calculateHonmeiSei(1899.5)).toThrow();
  });
});

describe("calculateGetsumeiSei", () => {
  it("should calculate correct getsumei sei for group 1, 4, 7", () => {
    // 本命星1で各月
    expect(calculateGetsumeiSei(1, 1)).toBe(6);
    expect(calculateGetsumeiSei(1, 2)).toBe(8);
    expect(calculateGetsumeiSei(1, 3)).toBe(7);
    expect(calculateGetsumeiSei(4, 5)).toBe(5);
    expect(calculateGetsumeiSei(7, 9)).toBe(1);
  });

  it("should calculate correct getsumei sei for group 3, 6, 9", () => {
    expect(calculateGetsumeiSei(3, 1)).toBe(3);
    expect(calculateGetsumeiSei(3, 2)).toBe(5);
    expect(calculateGetsumeiSei(6, 7)).toBe(9);
    expect(calculateGetsumeiSei(9, 12)).toBe(4);
  });

  it("should calculate correct getsumei sei for group 2, 5, 8", () => {
    expect(calculateGetsumeiSei(2, 1)).toBe(9);
    expect(calculateGetsumeiSei(2, 2)).toBe(2);
    expect(calculateGetsumeiSei(5, 3)).toBe(1);
    expect(calculateGetsumeiSei(8, 12)).toBe(1);
  });
});

describe("getStarName", () => {
  it("should return correct star names", () => {
    expect(getStarName(1)).toBe("一白水星");
    expect(getStarName(2)).toBe("二黒土星");
    expect(getStarName(3)).toBe("三碧木星");
    expect(getStarName(4)).toBe("四緑木星");
    expect(getStarName(5)).toBe("五黄土星");
    expect(getStarName(6)).toBe("六白金星");
    expect(getStarName(7)).toBe("七赤金星");
    expect(getStarName(8)).toBe("八白土星");
    expect(getStarName(9)).toBe("九紫火星");
  });
});

describe("calculateKigaku", () => {
  it("should return complete kigaku result", () => {
    const result = calculateKigaku(1985, 6);

    expect(result).toEqual({
      honmeiSei: 6,
      getsumeiSei: 1,
      honmeiName: "六白金星",
      getsumeiName: "一白水星",
    });
  });
});
