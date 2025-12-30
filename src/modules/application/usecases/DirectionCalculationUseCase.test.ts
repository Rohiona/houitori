import { describe, it, expect } from "vitest";
import { DirectionCalculationUseCase } from "./DirectionCalculationUseCase";
import type {
  BoardDirections,
  BoardData,
  CompatibilityTable,
} from "@/modules/domain/direction/types";

// テスト用の相性テーブル
const testCompatibility: CompatibilityTable = {
  "1": [3, 4, 6, 7],
  "2": [5, 8, 9, 6, 7],
  "3": [4, 1, 9],
  "4": [3, 1, 9],
  "5": [2, 8, 9, 6, 7],
  "6": [7, 1, 2, 5, 8],
  "7": [6, 1, 2, 5, 8],
  "8": [2, 5, 9, 6, 7],
  "9": [3, 4, 2, 5, 8],
};

// テスト用の盤データ（2026年盤の一部）
const testBoard: BoardDirections = {
  "1": { star: 5, bad: true },  // 南: 五黄殺
  "2": { star: 7, bad: false }, // 南西
  "3": { star: 3, bad: false }, // 西
  "4": { star: 2, bad: false }, // 北西
  "5": { star: 6, bad: true },  // 北: 暗剣殺
  "6": { star: 4, bad: false }, // 北東
  "7": { star: 8, bad: false }, // 東
  "8": { star: 9, bad: false }, // 東南
};

describe("DirectionCalculationUseCase.executeBoard", () => {
  const useCase = new DirectionCalculationUseCase(testCompatibility);

  it("五黄殺・暗剣殺の方位は凶になる", () => {
    const results = useCase.executeBoard(testBoard, 1, 1);

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
    const results = useCase.executeBoard(testBoard, 3, 1);

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
    const results = useCase.executeBoard(testBoard, 1, 1);

    const southwest = results.find((r) => r.direction === 2);
    expect(southwest?.star).toBe(7);
    expect(southwest?.honmeiResult.status).toBe("good"); // 吉
  });

  it("凶でも吉でもない方位は無印になる", () => {
    // 本命星1の場合、北西(4)に2がいる
    // 2は相性リストに含まれない → 無印
    const results = useCase.executeBoard(testBoard, 1, 1);

    const northwest = results.find((r) => r.direction === 4);
    expect(northwest?.star).toBe(2);
    expect(northwest?.honmeiResult.status).toBe("none"); // 無印
  });

  it("全8方位の結果が返される", () => {
    const results = useCase.executeBoard(testBoard, 1, 1);
    expect(results).toHaveLength(8);
  });
});

describe("DirectionCalculationUseCase.executeYear", () => {
  const useCase = new DirectionCalculationUseCase(testCompatibility);

  const testBoardData: BoardData = {
    year: 2026,
    yearBoard: testBoard,
    monthBoards: {
      "2": {
        "1": { star: 3, bad: false },
        "2": { star: 5, bad: true },
        "3": { star: 1, bad: false },
        "4": { star: 9, bad: false },
        "5": { star: 4, bad: false },
        "6": { star: 2, bad: true },
        "7": { star: 6, bad: false },
        "8": { star: 7, bad: false },
      },
    },
  };

  it("年盤と月盤の結果が返される", () => {
    const result = useCase.executeYear(testBoardData, 1, 1);

    expect(result.year).toBe(2026);
    expect(result.directions).toHaveLength(8);
    expect(result.months["2"]).toBeDefined();
    expect(result.months["2"].directions).toHaveLength(8);
  });

  it("年盤の五黄殺は凶になる", () => {
    const result = useCase.executeYear(testBoardData, 1, 1);

    const south = result.directions.find((r) => r.direction === 1);
    expect(south?.honmeiResult.status).toBe("bad"); // 凶
  });

  it("月盤の五黄殺・暗剣殺は凶になる", () => {
    const result = useCase.executeYear(testBoardData, 1, 1);

    // 2月の南西(2)は五黄殺
    const febSouthwest = result.months["2"].directions.find(
      (r) => r.direction === 2
    );
    expect(febSouthwest?.honmeiResult.status).toBe("bad"); // 凶
  });
});
