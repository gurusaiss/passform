import { NextRequest, NextResponse } from "next/server";
import { isAuthorizedAdmin } from "@/lib/auth";
import { getRegistrationsList } from "@/lib/supabase";
import { generateCsv } from "@/lib/utils";

export async function GET(req: NextRequest) {
  if (!isAuthorizedAdmin(req)) {
    return NextResponse.json(
      { success: false, message: "Unauthorized. Admin access required." },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") || "all";
  const search = searchParams.get("search") || "";

  try {
    // Fetch up to 10,000 records for export
    const { data } = await getRegistrationsList({
      search,
      status,
      page: 1,
      limit: 10000,
    });

    const csvContent = generateCsv(data);
    const dateStr = new Date().toISOString().split("T")[0];
    const filename = `registrations-export-${dateStr}.csv`;

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "CSV generation failed" },
      { status: 500 }
    );
  }
}
