import { describe, it, expect } from "vitest";
import { buildBoardDirectionResult } from "./BoardDirectionResultBuilder";
import { testCompatibility, testBoard } from "@/modules/domain/direction/__tests__/fixtures";

describe("buildBoardDirectionResult", () => {
  it("五黄殺・暗剣殺の方位は凶になる", () => {
    const results = buildBoardDirectionResult(testBoard, 1, 1, testCompatibility);

    // 南(1)は五黄殺で凶
    const south = results.find((r) => r.direction === 1);
    expect(south?.honmeiResult.status).toBe("bad");
    expect(south?.getsumeiResult.status).toBe("bad");

    // 北(5)は暗剣殺で凶
    const north = results.find((r) => r.direction === 5);
    expect(north?.honmeiResult.status).toBe("bad");
    expect(north?.getsumeiResult.status).toBe("bad");
  });

  it("本命殺・的殺の方位は凶になる", () => {
    // 本命星3の場合、西(3)に3がいるので本命殺
    // 対面の東(7)は的殺
    const results = buildBoardDirectionResult(testBoard, 3, 1, testCompatibility);

    // 西(3)は本命殺で凶
    const west = results.find((r) => r.direction === 3);
    expect(west?.honmeiResult.status).toBe("bad");

    // 東(7)は的殺で凶
    const east = results.find((r) => r.direction === 7);
    expect(east?.honmeiResult.status).toBe("bad");
  });

  it("相性の良い星がいる方位は吉になる（凶でない場合）", () => {
    // 本命星1の場合、相性の良い星は3,4,6,7
    // 南西(2)に7がいる → 吉
    const results = buildBoardDirectionResult(testBoard, 1, 1, testCompatibility);

    const southwest = results.find((r) => r.direction === 2);
    expect(southwest?.star).toBe(7);
    expect(southwest?.honmeiResult.status).toBe("good"); // 吉
  });

  it("凶でも吉でもない方位は無印になる", () => {
    // 本命星1の場合、北西(4)に2がいる
    // 2は相性リストに含まれない → 無印
    const results = buildBoardDirectionResult(testBoard, 1, 1, testCompatibility);

    const northwest = results.find((r) => r.direction === 4);
    expect(northwest?.star).toBe(2);
    expect(northwest?.honmeiResult.status).toBe("none"); // 無印
  });

  it("全8方位の結果が返される", () => {
    const results = buildBoardDirectionResult(testBoard, 1, 1, testCompatibility);
    expect(results).toHaveLength(8);
  });
});
