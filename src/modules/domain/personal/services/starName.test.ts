import { describe, it, expect } from "vitest";
import { getStarName } from "./starName";

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
