import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const isPaymentEnabled = process.env.ENABLE_PAYMENTS === "true";
    if (!isPaymentEnabled) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Phase 1 is active: Event is free. Paid checkout is disabled in configuration.",
        },
        { status: 400 }
      );
    }

    const { registrationId, amountInINR } = await req.json();

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Razorpay API credentials not configured in environment variables.",
        },
        { status: 500 }
      );
    }

    const amountInPaise = Math.round((amountInINR || 499) * 100);

    // Basic auth header for Razorpay API
    const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");

    const orderRes = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: amountInPaise,
        currency: "INR",
        receipt: `rcpt_${Date.now()}`,
        notes: {
          registrationId,
        },
      }),
    });

    const orderData = await orderRes.json();

    if (!orderRes.ok) {
      return NextResponse.json(
        { success: false, message: orderData.error?.description || "Order creation failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      orderId: orderData.id,
      amount: orderData.amount,
      currency: orderData.currency,
      keyId,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Payment initiation error" },
      { status: 500 }
    );
  }
}
