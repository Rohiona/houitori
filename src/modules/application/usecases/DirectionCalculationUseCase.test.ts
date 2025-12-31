import { describe, it, expect } from "vitest";
import { DirectionCalculationUseCase } from "./DirectionCalculationUseCase";
import { testCompatibility, testBoardData } from "@/modules/domain/direction/__tests__/fixtures";

describe("DirectionCalculationUseCase", () => {
  const useCase = new DirectionCalculationUseCase(testCompatibility);

  it("年盤と月盤の結果が返される", () => {
    const result = useCase.execute(testBoardData, 1, 1);

    expect(result.year).toBe(2026);
    expect(result.directions).toHaveLength(8);
    expect(result.months["2"]).toBeDefined();
    expect(result.months["2"].directions).toHaveLength(8);
  });

  it("年盤の五黄殺は凶になる", () => {
    const result = useCase.execute(testBoardData, 1, 1);

    const south = result.directions.find((r) => r.direction === "south");
    expect(south?.honmeiResult.status).toBe("bad"); // 凶
  });

  it("月盤の五黄殺・暗剣殺は凶になる", () => {
    const result = useCase.execute(testBoardData, 1, 1);

    // 2月の南西は五黄殺
    const febSouthwest = result.months["2"].directions.find((r) => r.direction === "southwest");
    expect(febSouthwest?.honmeiResult.status).toBe("bad"); // 凶
  });
});
