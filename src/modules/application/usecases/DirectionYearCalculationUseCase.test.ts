import { describe, it, expect } from "vitest";
import { DirectionYearCalculationUseCase } from "./DirectionYearCalculationUseCase";
import { testCompatibility, testBoardData } from "@/modules/domain/direction/__tests__/fixtures";

describe("DirectionYearCalculationUseCase", () => {
  const useCase = new DirectionYearCalculationUseCase(testCompatibility);

  it("年盤と月盤の結果が返される", () => {
    const result = useCase.execute(testBoardData, 1, 1);

    expect(result.year).toBe(2026);
    expect(result.directions).toHaveLength(8);
    expect(result.months["2"]).toBeDefined();
    expect(result.months["2"].directions).toHaveLength(8);
  });

  it("年盤の五黄殺は凶になる", () => {
    const result = useCase.execute(testBoardData, 1, 1);

    const south = result.directions.find((r) => r.direction === 1);
    expect(south?.honmeiResult.status).toBe("bad"); // 凶
  });

  it("月盤の五黄殺・暗剣殺は凶になる", () => {
    const result = useCase.execute(testBoardData, 1, 1);

    // 2月の南西(2)は五黄殺
    const febSouthwest = result.months["2"].directions.find((r) => r.direction === 2);
    expect(febSouthwest?.honmeiResult.status).toBe("bad"); // 凶
  });
});
