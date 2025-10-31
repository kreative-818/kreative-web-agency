
import { NextRequest, NextResponse } from "next/server";
import { validatePhone } from "@/lib/phone-validation";

export async function POST(request: NextRequest) {
  try {
    const { phone } = await request.json();

    if (!phone) {
      return NextResponse.json(
        { success: false, error: "Phone number required" },
        { status: 400 }
      );
    }

    const result = await validatePhone(phone);

    return NextResponse.json({
      success: true,
      ...result
    });

  } catch (error) {
    console.error("Phone validation error:", error);
    return NextResponse.json(
      { success: false, error: "Validation failed" },
      { status: 500 }
    );
  }
}
