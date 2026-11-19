import { NextRequest, NextResponse } from "next/server";
import { isAuthorizedAdmin } from "@/lib/auth";
import { getPlatformSettings, savePlatformSettings } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  try {
    const settings = await getPlatformSettings();
    return NextResponse.json({
      success: true,
      settings,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to load settings" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  if (!isAuthorizedAdmin(req)) {
    return NextResponse.json(
      { success: false, message: "Unauthorized. Admin session required." },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const { whatsappGroupUrl, isRegistrationOpen } = body;

    await savePlatformSettings({
      whatsappGroupUrl,
      isRegistrationOpen,
    });

    return NextResponse.json({
      success: true,
      message: "Platform settings updated successfully.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update settings" },
      { status: 500 }
    );
  }
}
