import { describe, it, expect } from "vitest";
import { badRule } from "./badRule";
import type { BoardDirections } from "../types";

describe("badRule", () => {
  it("bad=true の方位を返す", () => {
    const board: BoardDirections = {
      "1": { star: 5, bad: true }, // 五黄殺
      "2": { star: 7, bad: false },
      "3": { star: 3, bad: false },
      "4": { star: 2, bad: false },
      "5": { star: 6, bad: true }, // 暗剣殺
      "6": { star: 4, bad: false },
      "7": { star: 8, bad: false },
      "8": { star: 9, bad: false },
    };

    const result = badRule(board);
    expect(result.has(1)).toBe(true);
    expect(result.has(5)).toBe(true);
    expect(result.size).toBe(2);
  });

  it("bad=true がない場合は空のSetを返す", () => {
    const board: BoardDirections = {
      "1": { star: 5, bad: false },
      "2": { star: 7, bad: false },
      "3": { star: 3, bad: false },
      "4": { star: 2, bad: false },
      "5": { star: 6, bad: false },
      "6": { star: 4, bad: false },
      "7": { star: 8, bad: false },
      "8": { star: 9, bad: false },
    };

    const result = badRule(board);
    expect(result.size).toBe(0);
  });
});
