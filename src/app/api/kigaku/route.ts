import { NextRequest, NextResponse } from "next/server";
import { calculateKigaku, Month } from "@/domain/kigaku";

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
      return NextResponse.json(
        { error: "birthYear and birthMonth are required" },
        { status: 400 }
      );
    }

    if (!Number.isInteger(birthYear) || birthYear < 1900) {
      return NextResponse.json(
        { error: "birthYear must be an integer >= 1900" },
        { status: 400 }
      );
    }

    if (!Number.isInteger(birthMonth) || birthMonth < 1 || birthMonth > 12) {
      return NextResponse.json(
        { error: "birthMonth must be an integer between 1 and 12" },
        { status: 400 }
      );
    }

    const result = calculateKigaku(birthYear, birthMonth as Month);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Kigaku calculation error:", error);
    return NextResponse.json(
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
    return NextResponse.json(
      { error: "birthYear and birthMonth query parameters are required" },
      { status: 400 }
    );
  }

  const year = parseInt(birthYear, 10);
  const month = parseInt(birthMonth, 10);

  if (isNaN(year) || year < 1900) {
    return NextResponse.json(
      { error: "birthYear must be an integer >= 1900" },
      { status: 400 }
    );
  }

  if (isNaN(month) || month < 1 || month > 12) {
    return NextResponse.json(
      { error: "birthMonth must be an integer between 1 and 12" },
      { status: 400 }
    );
  }

  const result = calculateKigaku(year, month as Month);

  return NextResponse.json(result);
}
