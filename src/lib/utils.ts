import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Registration } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generates an uppercase, high-entropy reference code.
 * Example: SUMMIT-2026-K9P2
 */
export function generateReferenceId(prefix = "REG"): string {
  const chars = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ"; // Omits confusing chars: 0, 1, O, I
  let randomPart = "";
  for (let i = 0; i < 4; i++) {
    randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${prefix}-${new Date().getFullYear()}-${randomPart}`;
}

/**
 * Sanitizes cell values to neutralize spreadsheet formula injection attacks (CSV injection / DDE).
 * If a cell begins with '=', '+', '-', or '@', prepend an apostrophe.
 */
function sanitizeCsvCell(value: any): string {
  if (value === null || value === undefined) return '""';
  let str = String(value);

  // Guard against CSV formula execution
  if (/^[=+\-@\t\r]/.test(str)) {
    str = `'${str}`;
  }

  // Escape inner double quotes by doubling them
  str = str.replace(/"/g, '""');
  return `"${str}"`;
}

/**
 * Generates RFC-4180 compliant CSV from registrations list.
 */
export function generateCsv(registrations: Registration[]): string {
  const headers = [
    "Reference ID",
    "Full Name",
    "Email",
    "Phone",
    "Status",
    "Consent Given",
    "Registered At",
    "Custom Fields",
  ];

  const rows = registrations.map((r) => [
    sanitizeCsvCell(r.reference_id),
    sanitizeCsvCell(r.full_name),
    sanitizeCsvCell(r.email),
    sanitizeCsvCell(r.phone),
    sanitizeCsvCell(r.registration_status),
    sanitizeCsvCell(r.consent_given ? "Yes" : "No"),
    sanitizeCsvCell(new Date(r.created_at).toLocaleString()),
    sanitizeCsvCell(JSON.stringify(r.custom_fields)),
  ]);

  const csvContent = [
    headers.map((h) => `"${h}"`).join(","),
    ...rows.map((row) => row.join(",")),
  ].join("\r\n");

  return csvContent;
}

export function formatDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(d);
  } catch {
    return dateString;
  }
}
