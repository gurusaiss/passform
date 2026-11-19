import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { Registration, RegistrationStatus } from "@/types";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.SUPABASE_URL ||
  "";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  "";
const supabaseServiceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SERVICE_ROLE ||
  "";

// Browser client (uses public anon key, restricted by RLS)
export const supabaseClient: SupabaseClient | null =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

// Server service role client (bypasses RLS, used only in server routes)
export const supabaseAdminClient: SupabaseClient | null =
  supabaseUrl && supabaseServiceRoleKey
    ? createClient(supabaseUrl, supabaseServiceRoleKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      })
    : null;

// -----------------------------------------------------------------------------
// In-Memory Fallback Store (Used when Supabase credentials are unconfigured)
// -----------------------------------------------------------------------------
const memoryRegistrations: Map<string, Registration> = new Map();

// Seed mock data for development demonstration
if (memoryRegistrations.size === 0) {
  const sampleRegistrations: Registration[] = [
    {
      id: "mem-001",
      reference_id: "SUMMIT-2026-A1B2",
      full_name: "Aarav Sharma",
      email: "aarav.sharma@example.com",
      phone: "+91 98765 11111",
      custom_fields: {
        organization: "IIT Bombay",
        role: "Student (3rd / 4th Year)",
        primaryInterest: "Artificial Intelligence & Machine Learning",
        referralSource: "Promotional Poster / Standee QR Code",
      },
      registration_status: "confirmed",
      consent_given: true,
      turnstile_verified: true,
      created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
      updated_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      id: "mem-002",
      reference_id: "SUMMIT-2026-C3D4",
      full_name: "Priya Patel",
      email: "priya.patel@example.com",
      phone: "+91 98765 22222",
      custom_fields: {
        organization: "TechCorp Systems",
        role: "Working Professional (1-3 Years Experience)",
        primaryInterest: "Cloud Infrastructure & Distributed Systems",
        referralSource: "LinkedIn",
      },
      registration_status: "confirmed",
      consent_given: true,
      turnstile_verified: true,
      created_at: new Date(Date.now() - 86400000).toISOString(),
      updated_at: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: "mem-003",
      reference_id: "SUMMIT-2026-E5F6",
      full_name: "Rahul Verma",
      email: "rahul.verma@example.com",
      phone: "+91 98765 33333",
      custom_fields: {
        organization: "National Institute of Design",
        role: "Student (1st / 2nd Year)",
        primaryInterest: "Product Management & UX Innovation",
        referralSource: "WhatsApp Group / Friend Forward",
      },
      registration_status: "confirmed",
      consent_given: true,
      turnstile_verified: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  sampleRegistrations.forEach((r) => memoryRegistrations.set(r.reference_id, r));
}

// -----------------------------------------------------------------------------
// Data Access Operations
// -----------------------------------------------------------------------------

export async function findRegistrationByEmailOrPhone(
  email: string,
  phone: string
): Promise<Registration | null> {
  const normalizedEmail = email.toLowerCase().trim();
  const normalizedPhone = phone.trim();

  if (supabaseAdminClient) {
    const { data, error } = await supabaseAdminClient
      .from("registrations")
      .select("*")
      .or(`email.ilike.${normalizedEmail},phone.eq.${normalizedPhone}`)
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("Supabase find error:", error);
    }
    return data as Registration | null;
  }

  // Fallback to memory
  for (const reg of memoryRegistrations.values()) {
    if (
      reg.email.toLowerCase() === normalizedEmail ||
      reg.phone === normalizedPhone
    ) {
      return reg;
    }
  }

  return null;
}

export async function findRegistrationByReference(
  referenceId: string
): Promise<Registration | null> {
  if (supabaseAdminClient) {
    const { data, error } = await supabaseAdminClient
      .from("registrations")
      .select("*")
      .eq("reference_id", referenceId.toUpperCase())
      .maybeSingle();

    if (error) {
      console.error("Supabase findByRef error:", error);
    }
    return data as Registration | null;
  }

  return memoryRegistrations.get(referenceId.toUpperCase()) || null;
}

export async function insertRegistration(
  registration: Omit<Registration, "id" | "created_at" | "updated_at">
): Promise<Registration> {
  if (supabaseAdminClient) {
    const { data, error } = await supabaseAdminClient
      .from("registrations")
      .insert([
        {
          reference_id: registration.reference_id,
          full_name: registration.full_name,
          email: registration.email.toLowerCase(),
          phone: registration.phone,
          custom_fields: registration.custom_fields,
          registration_status: registration.registration_status,
          consent_given: registration.consent_given,
          turnstile_verified: registration.turnstile_verified,
          ip_address: registration.ip_address,
          user_agent: registration.user_agent,
        },
      ])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to insert registration: ${error.message}`);
    }
    return data as Registration;
  }

  // Fallback to memory
  const newRecord: Registration = {
    ...registration,
    id: `mem-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  memoryRegistrations.set(newRecord.reference_id, newRecord);
  return newRecord;
}

export async function getRegistrationsList(options: {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}): Promise<{ data: Registration[]; total: number }> {
  const { search = "", status = "", page = 1, limit = 50 } = options;

  if (supabaseAdminClient) {
    let query = supabaseAdminClient
      .from("registrations")
      .select("*", { count: "exact" });

    if (status && status !== "all") {
      query = query.eq("registration_status", status);
    }

    if (search.trim()) {
      const q = search.trim();
      query = query.or(
        `full_name.ilike.%${q}%,email.ilike.%${q}%,phone.ilike.%${q}%,reference_id.ilike.%${q}%`
      );
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, count, error } = await query
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) {
      throw new Error(`Failed to fetch registrations: ${error.message}`);
    }

    return {
      data: (data || []) as Registration[],
      total: count || 0,
    };
  }

  // Memory fallback
  let list = Array.from(memoryRegistrations.values()).sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  if (status && status !== "all") {
    list = list.filter((r) => r.registration_status === status);
  }

  if (search.trim()) {
    const q = search.toLowerCase().trim();
    list = list.filter(
      (r) =>
        r.full_name.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.phone.includes(q) ||
        r.reference_id.toLowerCase().includes(q)
    );
  }

  const total = list.length;
  const from = (page - 1) * limit;
  const paginated = list.slice(from, from + limit);

  return {
    data: paginated,
    total,
  };
}

export async function updateRegistrationStatus(
  referenceId: string,
  status: RegistrationStatus
): Promise<boolean> {
  if (supabaseAdminClient) {
    const { error } = await supabaseAdminClient
      .from("registrations")
      .update({ registration_status: status })
      .eq("reference_id", referenceId);

    return !error;
  }

  const reg = memoryRegistrations.get(referenceId);
  if (reg) {
    reg.registration_status = status;
    reg.updated_at = new Date().toISOString();
    return true;
  }
  return false;
}

// -----------------------------------------------------------------------------
// Platform Settings Access Operations
// -----------------------------------------------------------------------------
const memorySettings = new Map<string, any>([
  ["whatsappGroupUrl", process.env.NEXT_PUBLIC_DEFAULT_WHATSAPP_URL || "https://chat.whatsapp.com/sampleInviteCode123"],
  ["isRegistrationOpen", true],
]);

export async function getPlatformSettings(): Promise<{
  whatsappGroupUrl: string;
  isRegistrationOpen: boolean;
}> {
  if (supabaseAdminClient) {
    const { data, error } = await supabaseAdminClient
      .from("platform_settings")
      .select("key, value");

    if (!error && data) {
      let whatsappGroupUrl = memorySettings.get("whatsappGroupUrl");
      let isRegistrationOpen = memorySettings.get("isRegistrationOpen");

      for (const item of data) {
        if (item.key === "onboarding" && item.value?.whatsappGroupUrl) {
          whatsappGroupUrl = item.value.whatsappGroupUrl;
        }
        if (item.key === "general" && typeof item.value?.isRegistrationOpen === "boolean") {
          isRegistrationOpen = item.value.isRegistrationOpen;
        }
      }

      return { whatsappGroupUrl, isRegistrationOpen };
    }
  }

  return {
    whatsappGroupUrl: memorySettings.get("whatsappGroupUrl"),
    isRegistrationOpen: memorySettings.get("isRegistrationOpen"),
  };
}

export async function savePlatformSettings(settings: {
  whatsappGroupUrl?: string;
  isRegistrationOpen?: boolean;
}): Promise<boolean> {
  if (settings.whatsappGroupUrl !== undefined) {
    memorySettings.set("whatsappGroupUrl", settings.whatsappGroupUrl);
  }
  if (settings.isRegistrationOpen !== undefined) {
    memorySettings.set("isRegistrationOpen", settings.isRegistrationOpen);
  }

  if (supabaseAdminClient) {
    if (settings.whatsappGroupUrl !== undefined) {
      await supabaseAdminClient.from("platform_settings").upsert({
        key: "onboarding",
        value: { whatsappGroupUrl: settings.whatsappGroupUrl },
        updated_at: new Date().toISOString(),
      });
    }
    if (settings.isRegistrationOpen !== undefined) {
      await supabaseAdminClient.from("platform_settings").upsert({
        key: "general",
        value: { isRegistrationOpen: settings.isRegistrationOpen },
        updated_at: new Date().toISOString(),
      });
    }
  }

  return true;
}
