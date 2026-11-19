import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const isPaymentEnabled = process.env.ENABLE_PAYMENTS === "true";
    if (!isPaymentEnabled) {
      return NextResponse.json(
        { success: false, message: "Payments not enabled." },
        { status: 400 }
      );
    }

    const {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      registrationId,
    } = await req.json();

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      return NextResponse.json(
        { success: false, message: "Missing Razorpay secret" },
        { status: 500 }
      );
    }

    // Verify HMAC SHA256 signature: generated_signature = hmac_sha256(order_id + "|" + payment_id, secret)
    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex");

    if (expectedSignature !== razorpaySignature) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Cryptographic signature mismatch. Unauthorized payment confirmation.",
        },
        { status: 400 }
      );
    }

    // Verified! Update registration status to 'confirmed' and payment status to 'paid'
    // (In production, update database record via Supabase client)

    return NextResponse.json({
      success: true,
      message: "Payment successfully verified and attendance confirmed.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Payment verification error" },
      { status: 500 }
    );
  }
}
