import { z } from "zod";
import { defaultPlatformConfig } from "@/config/platform.config";

export const phoneRegex = /^\+?[0-9\s\-\(\)]{7,20}$/;

export const baseRegistrationSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must be under 100 characters")
    .trim(),
  email: z
    .string()
    .email("Please provide a valid email address")
    .max(255, "Email address is too long")
    .transform((val) => val.toLowerCase().trim()),
  phone: z
    .string()
    .min(7, "Please enter a valid phone number")
    .max(20, "Phone number is too long")
    .regex(
      phoneRegex,
      "Please enter a valid phone number (e.g., +91 98765 43210)"
    )
    .trim(),
  consentGiven: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms and privacy consent to register",
  }),
  turnstileToken: z.string().optional(),
  customFields: z.record(z.string(), z.any()).optional().default({}),
});

export type RegistrationFormData = z.infer<typeof baseRegistrationSchema>;

/**
 * Validates dynamic custom fields configured for the event.
 */
export function validateCustomFields(
  customFields: Record<string, any> = {}
): { valid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};
  const configs = defaultPlatformConfig.registration.customFields;

  for (const field of configs) {
    const value = customFields[field.id];

    if (field.required) {
      if (
        value === undefined ||
        value === null ||
        (typeof value === "string" && value.trim() === "")
      ) {
        errors[field.id] = `${field.label} is required`;
        continue;
      }
    }

    if (value && field.type === "select" && field.options) {
      if (!field.options.includes(value)) {
        errors[field.id] = `Invalid selection for ${field.label}`;
      }
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
