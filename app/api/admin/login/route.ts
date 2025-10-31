
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const ADMIN_EMAIL = "support@kreativewebagency.com";
const ADMIN_PASSWORD = "Godislove8187.";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validate credentials
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      // Set secure HTTP-only cookie
      const cookieStore = await cookies();
      cookieStore.set("admin_session", "authenticated", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { success: false, error: "Invalid email or password" },
      { status: 401 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, error: "Login failed" },
      { status: 500 }
    );
  }
}
