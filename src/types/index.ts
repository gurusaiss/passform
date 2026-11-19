export type RegistrationStatus =
  | "pending"
  | "confirmed"
  | "waitlisted"
  | "cancelled"
  | "attended";

export type PaymentStatus =
  | "unpaid"
  | "pending"
  | "paid"
  | "refunded"
  | "failed";

export interface Registration {
  id: string;
  reference_id: string;
  full_name: string;
  email: string;
  phone: string;
  custom_fields: Record<string, any>;
  registration_status: RegistrationStatus;
  consent_given: boolean;
  turnstile_verified: boolean;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
  updated_at: string;
}

export interface RegistrationInput {
  fullName: string;
  email: string;
  phone: string;
  customFields?: Record<string, any>;
  consentGiven: boolean;
  turnstileToken?: string;
}

export interface RegistrationResponse {
  success: boolean;
  referenceId?: string;
  whatsappUrl?: string;
  message?: string;
  errors?: Record<string, string[]>;
  alreadyRegistered?: boolean;
}

export interface AdminStats {
  totalRegistrations: number;
  confirmedCount: number;
  waitlistedCount: number;
  todayCount: number;
  recentRegistrations: Registration[];
}
