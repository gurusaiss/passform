import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { password, action } = await req.json();
    const adminSecret = process.env.ADMIN_SECRET_KEY || "admin123";

    if (action === "logout") {
      const response = NextResponse.json({ success: true, message: "Logged out" });
      response.cookies.delete("admin_session");
      return response;
    }

    if (!password || password !== adminSecret) {
      return NextResponse.json(
        { success: false, message: "Invalid administrator password" },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      success: true,
      token: adminSecret,
      message: "Authentication successful",
    });

    // Set secure HttpOnly cookie
    response.cookies.set({
      name: "admin_session",
      value: adminSecret,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Authentication error" },
      { status: 500 }
    );
  }
}
