import { NextRequest } from "next/server";
import { PersonalStarCalculationUseCase } from "@/modules/application/usecases/PersonalStarCalculationUseCase";
import { DirectionCalculationUseCase } from "@/modules/application/usecases/DirectionCalculationUseCase";
import { directionRequestSchema } from "@/modules/presentation/validators/direction";
import {
  loadBoardData,
  getCompatibilityTable,
} from "@/modules/infrastructure/direction/dataLoader";
import type { Month } from "@/modules/domain/personal/types";
import type {
  DirectionApiResponse,
  PersonDirectionResult,
} from "@/modules/application/dtos/direction";

const personalStarUseCase = new PersonalStarCalculationUseCase();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = directionRequestSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    const { targetYear, persons } = parsed.data;

    // 盤データと相性テーブルを読み込み
    let boardData;
    try {
      boardData = loadBoardData(targetYear);
    } catch {
      return Response.json(
        { error: `Board data not available for year ${targetYear}` },
        { status: 404 }
      );
    }

    const compatibility = getCompatibilityTable();
    const directionUseCase = new DirectionCalculationUseCase(compatibility);

    // 各人物の計算
    const personResults: PersonDirectionResult[] = persons.map((person) => {
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

    const response: DirectionApiResponse = {
      year: targetYear,
      persons: personResults,
    };

    return Response.json(response);
  } catch (error) {
    console.error("Direction calculation error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
