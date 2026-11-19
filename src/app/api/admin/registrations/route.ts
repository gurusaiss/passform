import { NextRequest, NextResponse } from "next/server";
import { isAuthorizedAdmin } from "@/lib/auth";
import { getRegistrationsList, updateRegistrationStatus } from "@/lib/supabase";
import { RegistrationStatus } from "@/types";

export async function GET(req: NextRequest) {
  if (!isAuthorizedAdmin(req)) {
    return NextResponse.json(
      { success: false, message: "Unauthorized. Admin access required." },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "all";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "50", 10);

  try {
    const { data, total } = await getRegistrationsList({
      search,
      status,
      page,
      limit,
    });

    return NextResponse.json({
      success: true,
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch registrations" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  if (!isAuthorizedAdmin(req)) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const { referenceId, status } = await req.json();

    if (!referenceId || !status) {
      return NextResponse.json(
        { success: false, message: "Missing referenceId or status" },
        { status: 400 }
      );
    }

    const success = await updateRegistrationStatus(
      referenceId,
      status as RegistrationStatus
    );

    if (!success) {
      return NextResponse.json(
        { success: false, message: "Registration not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Registration ${referenceId} status updated to ${status}`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Update failed" },
      { status: 500 }
    );
  }
}
