import { NextRequest, NextResponse } from "next/server";
import QRCode from "qrcode";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const defaultUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const urlToEncode = searchParams.get("url") || defaultUrl;
  const format = searchParams.get("format") || "png"; // 'png' or 'svg'
  const width = parseInt(searchParams.get("width") || "512", 10);
  const download = searchParams.get("download") === "true";

  try {
    if (format === "svg") {
      const svgString = await QRCode.toString(urlToEncode, {
        type: "svg",
        margin: 2,
        color: {
          dark: "#0f172a",
          light: "#ffffff",
        },
      });

      const headers: Record<string, string> = {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=3600, s-maxage=86400",
      };

      if (download) {
        headers["Content-Disposition"] =
          'attachment; filename="registration-qr-vector.svg"';
      }

      return new NextResponse(svgString, { status: 200, headers });
    }

    // Default: PNG Buffer
    const buffer = await QRCode.toBuffer(urlToEncode, {
      type: "png",
      width: Math.min(width, 2048),
      margin: 2,
      color: {
        dark: "#0f172a",
        light: "#ffffff",
      },
      errorCorrectionLevel: "H", // High error correction for printed posters
    });

    const headers: Record<string, string> = {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    };

    if (download) {
      headers["Content-Disposition"] =
        'attachment; filename="registration-qr-print.png"';
    }

    return new NextResponse(buffer as any, { status: 200, headers });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to generate QR" },
      { status: 500 }
    );
  }
}
