import { describe, it, expect } from "vitest";
import { buildBoardDirectionResult } from "./BoardDirectionResultBuilder";
import { testCompatibility, testBoard } from "@/modules/domain/direction/__tests__/fixtures";

describe("buildBoardDirectionResult", () => {
  it("五黄殺・暗剣殺の方位は凶になる", () => {
    const results = buildBoardDirectionResult(testBoard, 1, 1, testCompatibility);

    // 南(south)は五黄殺で凶
    const south = results.find((r) => r.direction === "south");
    expect(south?.honmeiResult.status).toBe("bad");
    expect(south?.getsumeiResult.status).toBe("bad");

    // 北(north)は暗剣殺で凶
    const north = results.find((r) => r.direction === "north");
    expect(north?.honmeiResult.status).toBe("bad");
    expect(north?.getsumeiResult.status).toBe("bad");
  });

  it("本命殺・的殺の方位は凶になる", () => {
    // 本命星3の場合、西に3がいるので本命殺
    // 対面の東は的殺
    const results = buildBoardDirectionResult(testBoard, 3, 1, testCompatibility);

    // 西は本命殺で凶
    const west = results.find((r) => r.direction === "west");
    expect(west?.honmeiResult.status).toBe("bad");

    // 東は的殺で凶
    const east = results.find((r) => r.direction === "east");
    expect(east?.honmeiResult.status).toBe("bad");
  });

  it("相性の良い星がいる方位は吉になる（凶でない場合）", () => {
    // 本命星1の場合、相性の良い星は3,4,6,7
    // 南西に7がいる → 吉
    const results = buildBoardDirectionResult(testBoard, 1, 1, testCompatibility);

    const southwest = results.find((r) => r.direction === "southwest");
    expect(southwest?.star).toBe(7);
    expect(southwest?.honmeiResult.status).toBe("good"); // 吉
  });

  it("凶でも吉でもない方位は無印になる", () => {
    // 本命星1の場合、北西に2がいる
    // 2は相性リストに含まれない → 無印
    const results = buildBoardDirectionResult(testBoard, 1, 1, testCompatibility);

    const northwest = results.find((r) => r.direction === "northwest");
    expect(northwest?.star).toBe(2);
    expect(northwest?.honmeiResult.status).toBe("neutral"); // 無印
  });

  it("全8方位の結果が返される", () => {
    const results = buildBoardDirectionResult(testBoard, 1, 1, testCompatibility);
    expect(results).toHaveLength(8);
  });
});
