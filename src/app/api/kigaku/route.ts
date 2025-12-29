import { NextRequest } from "next/server";
import { CalculateKigakuUseCase } from "@/modules/application/kigaku/usecases/CalculateKigakuUseCase";
import type { Month } from "@/modules/domain/kigaku/types";

const calculateKigakuUseCase = new CalculateKigakuUseCase();

interface KigakuRequest {
  birthYear: number;
  birthMonth: number;
}

export async function POST(request: NextRequest) {
  try {
    const body: KigakuRequest = await request.json();
    const { birthYear, birthMonth } = body;

    // Validation
    if (!birthYear || !birthMonth) {
      return Response.json(
        { error: "birthYear and birthMonth are required" },
        { status: 400 }
      );
    }

    if (!Number.isInteger(birthYear) || birthYear < 1900) {
      return Response.json(
        { error: "birthYear must be an integer >= 1900" },
        { status: 400 }
      );
    }

    if (!Number.isInteger(birthMonth) || birthMonth < 1 || birthMonth > 12) {
      return Response.json(
        { error: "birthMonth must be an integer between 1 and 12" },
        { status: 400 }
      );
    }

    const result = calculateKigakuUseCase.execute(birthYear, birthMonth as Month);

    return Response.json(result);
  } catch (error) {
    console.error("Kigaku calculation error:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
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

  const year = parseInt(birthYear, 10);
  const month = parseInt(birthMonth, 10);

  if (isNaN(year) || year < 1900) {
    return Response.json(
      { error: "birthYear must be an integer >= 1900" },
      { status: 400 }
    );
  }

  if (isNaN(month) || month < 1 || month > 12) {
    return Response.json(
      { error: "birthMonth must be an integer between 1 and 12" },
      { status: 400 }
    );
  }

  const result = calculateKigakuUseCase.execute(year, month as Month);

  return Response.json(result);
}
