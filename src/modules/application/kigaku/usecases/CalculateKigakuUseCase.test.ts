import { describe, it, expect } from "vitest";
import { CalculateKigakuUseCase } from "./CalculateKigakuUseCase";

describe("CalculateKigakuUseCase", () => {
  const useCase = new CalculateKigakuUseCase();

  it("should return complete kigaku result", () => {
    const result = useCase.execute(1985, 6);

    expect(result).toEqual({
      honmeiSei: 6,
      getsumeiSei: 1,
      honmeiName: "六白金星",
      getsumeiName: "一白水星",
    });
  });

  it("should calculate correctly for different inputs", () => {
    const result = useCase.execute(1990, 3);

    expect(result.honmeiSei).toBe(1);
    expect(result.getsumeiSei).toBe(7);
  });
});
