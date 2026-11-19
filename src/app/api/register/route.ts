import { NextRequest, NextResponse } from "next/server";
import { baseRegistrationSchema, validateCustomFields } from "@/lib/validation";
import { checkRateLimit } from "@/lib/rate-limit";
import { verifyTurnstileToken } from "@/lib/turnstile";
import {
  findRegistrationByEmailOrPhone,
  insertRegistration,
} from "@/lib/supabase";
import { generateReferenceId } from "@/lib/utils";
import { sendConfirmationEmail } from "@/lib/email";
import { defaultPlatformConfig } from "@/config/platform.config";

export async function POST(req: NextRequest) {
  try {
    // 1. Rate Limiting Check
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";

    const rateLimit = checkRateLimit(ip, 10, 60000);
    if (!rateLimit.isAllowed) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Too many registration attempts. Please wait a minute before retrying.",
        },
        {
          status: 429,
          headers: {
            "Retry-After": "60",
          },
        }
      );
    }

    // 2. Parse Body
    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid JSON payload" },
        { status: 400 }
      );
    }

    // 3. Base Schema Validation
    const parsed = baseRegistrationSchema.safeParse(body);
    if (!parsed.success) {
      const fieldErrors: Record<string, string[]> = {};
      const issues = (parsed.error as any).issues || (parsed.error as any).errors || [];
      issues.forEach((err: any) => {
        const fieldName = err.path[0]?.toString() || "form";
        if (!fieldErrors[fieldName]) fieldErrors[fieldName] = [];
        fieldErrors[fieldName].push(err.message);
      });

      return NextResponse.json(
        {
          success: false,
          message: "Please correct the errors in the form.",
          errors: fieldErrors,
        },
        { status: 400 }
      );
    }

    const { fullName, email, phone, consentGiven, turnstileToken, customFields } =
      parsed.data;

    // 4. Validate Dynamic Custom Fields
    const customValidation = validateCustomFields(customFields);
    if (!customValidation.valid) {
      const customErrors: Record<string, string[]> = {};
      for (const [key, msg] of Object.entries(customValidation.errors)) {
        customErrors[key] = [msg];
      }

      return NextResponse.json(
        {
          success: false,
          message: "Please complete all required fields.",
          errors: customErrors,
        },
        { status: 400 }
      );
    }

    // 5. Cloudflare Turnstile Verification
    const turnstileResult = await verifyTurnstileToken(turnstileToken, ip);
    if (!turnstileResult.success) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Bot verification failed. Please refresh the page and try again.",
        },
        { status: 403 }
      );
    }

    // 6. Duplicate Registration Check
    const existing = await findRegistrationByEmailOrPhone(email, phone);
    if (existing) {
      const whatsappUrl =
        defaultPlatformConfig.onboarding.whatsappGroupUrl;

      return NextResponse.json(
        {
          success: true,
          alreadyRegistered: true,
          referenceId: existing.reference_id,
          whatsappUrl,
          message: `You are already registered! Your registration reference is ${existing.reference_id}.`,
        },
        { status: 200 }
      );
    }

    // 7. Generate Reference & Insert into Database
    const referenceId = generateReferenceId("SUMMIT");
    const userAgent = req.headers.get("user-agent") || undefined;

    const newRecord = await insertRegistration({
      reference_id: referenceId,
      full_name: fullName,
      email,
      phone,
      custom_fields: (customFields || {}) as Record<string, any>,
      registration_status: "confirmed",
      consent_given: consentGiven,
      turnstile_verified: true,
      ip_address: ip,
      user_agent: userAgent,
    });

    const whatsappUrl = defaultPlatformConfig.onboarding.whatsappGroupUrl;

    // 8. Fire-and-Forget Asynchronous Confirmation Email
    sendConfirmationEmail({
      to: email,
      fullName,
      referenceId,
      whatsappUrl,
    }).catch((err) => {
      console.warn("Async email failed:", err);
    });

    return NextResponse.json(
      {
        success: true,
        referenceId: newRecord.reference_id,
        whatsappUrl,
        message: "Registration successful! Welcome aboard.",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("API /api/register error:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          "An unexpected server error occurred while processing your registration. Please try again.",
      },
      { status: 500 }
    );
  }
}
