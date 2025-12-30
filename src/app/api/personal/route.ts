import { NextRequest } from "next/server";
import { PersonalStarCalculationUseCase } from "@/modules/application/usecases/PersonalStarCalculationUseCase";
import { personalStarRequestSchema } from "@/modules/presentation/validators/personal";
import type { Month } from "@/modules/domain/personal/types";

const personalStarCalculationUseCase = new PersonalStarCalculationUseCase();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = personalStarRequestSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    const { birthYear, birthMonth } = parsed.data;
    const result = personalStarCalculationUseCase.execute(birthYear, birthMonth as Month);

    return Response.json(result);
  } catch (error) {
    console.error("Personal star calculation error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const birthYear = searchParams.get("birthYear");
  const birthMonth = searchParams.get("birthMonth");

  if (!birthYear || !birthMonth) {
    return Response.json(
      { error: "birthYear and birthMonth query parameters are required" },
      { status: 400 }
    );
  }

  const parsed = personalStarRequestSchema.safeParse({
    birthYear: parseInt(birthYear, 10),
    birthMonth: parseInt(birthMonth, 10),
  });

  if (!parsed.success) {
    return Response.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const result = personalStarCalculationUseCase.execute(
    parsed.data.birthYear,
    parsed.data.birthMonth as Month
  );

  return Response.json(result);
}
