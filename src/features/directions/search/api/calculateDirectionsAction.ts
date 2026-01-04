"use server";

import type { Month } from "@/core/domain/personal";
import {
  directionRequestSchema,
  type DirectionRequest,
} from "@/core/presentation/validators/direction";
import { PersonalStarCalculationUseCase } from "@/core/application/usecases/PersonalStarCalculationUseCase";
import { DirectionCalculationUseCase } from "@/core/application/usecases/DirectionCalculationUseCase";
import { loadBoardData, getCompatibilityTable } from "@/core/infrastructure/direction/dataLoader";
import type {
  DirectionApiResponse,
  PersonDirectionResult,
} from "@/core/application/dtos/direction";

type ActionResult =
  | { success: true; data: DirectionApiResponse }
  | { success: false; error: string };

/**
 * 方位吉凶計算 Server Action
 *
 * @param input リクエストデータ
 * @returns 計算結果またはエラー
 */
export async function calculateDirections(input: DirectionRequest): Promise<ActionResult> {
  // 1. Validate
  const parsed = directionRequestSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  // 2. Load infrastructure data
  let boardData;
  try {
    boardData = loadBoardData(parsed.data.targetYear);
  } catch {
    return {
      success: false,
      error: `${parsed.data.targetYear}年の盤データがありません`,
    };
  }

  let compatibility;
  try {
    compatibility = getCompatibilityTable();
  } catch {
    return {
      success: false,
      error: "相性テーブルの読み込みに失敗しました",
    };
  }

  // 3. Orchestrate use cases
  const personalStarUseCase = new PersonalStarCalculationUseCase();
  const directionUseCase = new DirectionCalculationUseCase(compatibility);

  const personResults: PersonDirectionResult[] = parsed.data.persons.map((person) => {
    const personalResult = personalStarUseCase.execute(
      person.birthYear,
      person.birthMonth as Month
    );

    const directionResult = directionUseCase.execute(
      boardData,
      personalResult.honmeiSei,
      personalResult.getsumeiSei
    );

    return {
      honmeiSei: personalResult.honmeiSei,
      getsumeiSei: personalResult.getsumeiSei,
      directions: directionResult.directions,
      months: directionResult.months,
    };
  });

  // 4. Return result
  return {
    success: true,
    data: {
      year: parsed.data.targetYear,
      persons: personResults,
    },
  };
}
