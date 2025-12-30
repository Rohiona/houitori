import { describe, it, expect } from "vitest";
import { decideDirectionStatus } from "./statusDecider";
import type { BoardDirections, CompatibilityTable } from "../types";

// 星1の相性: 3, 4, 6, 7
const compatibility: CompatibilityTable = {
  "1": [3, 4, 6, 7],
};

describe("decideDirectionStatus", () => {
  it("優先度: 凶（bad）が吉（good）に勝つ", () => {
    // 南西(2)に7がいる → 相性的には吉
    // しかし bad=true → 凶が優先
    const board: BoardDirections = {
      "1": { star: 5, bad: false },
      "2": { star: 7, bad: true }, // 相性良いが bad
      "3": { star: 3, bad: false },
      "4": { star: 2, bad: false },
      "5": { star: 6, bad: false },
      "6": { star: 4, bad: false },
      "7": { star: 8, bad: false },
      "8": { star: 9, bad: false },
    };

    const result = decideDirectionStatus(board, 1, compatibility);
    expect(result[2]).toBe("bad"); // 凶が優先
  });

  it("優先度: 凶（killing）が吉（good）に勝つ", () => {
    // 西(3)に1がいる → 本命殺
    // しかし相性リストには含まれない例を作る
    // → 星1の相性は3,4,6,7なので、西に3を置いて本命星を3にする
    const board: BoardDirections = {
      "1": { star: 5, bad: false },
      "2": { star: 7, bad: false },
      "3": { star: 3, bad: false }, // 西に3 → 本命星3なら本命殺
      "4": { star: 2, bad: false },
      "5": { star: 6, bad: false },
      "6": { star: 4, bad: false },
      "7": { star: 8, bad: false },
      "8": { star: 9, bad: false },
    };

    // 星3の相性を追加（3と1は相性良い）
    const compatibilityWith3: CompatibilityTable = {
      ...compatibility,
      "3": [4, 1, 9], // 3 も含まれる（自分自身との相性は通常ないが、テスト用）
    };
    // ただし本命殺のチェック用に調整
    // 西(3)に3がいて、本命星が3 → 本命殺で凶

    const result = decideDirectionStatus(board, 3, compatibilityWith3);
    expect(result[3]).toBe("bad"); // 本命殺が優先
  });

  it("凶でない場合、吉が適用される", () => {
    const board: BoardDirections = {
      "1": { star: 5, bad: false },
      "2": { star: 7, bad: false }, // 星1と相性良い
      "3": { star: 2, bad: false },
      "4": { star: 2, bad: false },
      "5": { star: 5, bad: false },
      "6": { star: 4, bad: false }, // 星1と相性良い
      "7": { star: 8, bad: false },
      "8": { star: 9, bad: false },
    };

    const result = decideDirectionStatus(board, 1, compatibility);
    expect(result[2]).toBe("good"); // 南西(2)に7
    expect(result[6]).toBe("good"); // 北東(6)に4
  });

  it("凶でも吉でもない場合、無印になる", () => {
    const board: BoardDirections = {
      "1": { star: 5, bad: false }, // 5は星1と相性なし
      "2": { star: 2, bad: false }, // 2は星1と相性なし
      "3": { star: 8, bad: false },
      "4": { star: 2, bad: false },
      "5": { star: 5, bad: false },
      "6": { star: 2, bad: false },
      "7": { star: 8, bad: false },
      "8": { star: 9, bad: false },
    };

    const result = decideDirectionStatus(board, 1, compatibility);
    expect(result[1]).toBe("none"); // 南(1)に5
    expect(result[2]).toBe("none"); // 南西(2)に2
  });

  it("全8方位の結果が返される", () => {
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

    const result = decideDirectionStatus(board, 1, compatibility);
    expect(Object.keys(result)).toHaveLength(8);
  });
});
