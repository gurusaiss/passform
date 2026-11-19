# Database Schema & Migration Guide: Supabase PostgreSQL

---

## 1. Schema Design Overview

The database is built on **PostgreSQL (via Supabase)** with full relational integrity, strict type safety, timestamp tracking, and Row Level Security (RLS) policies.

The core entities are:
1. `registrations`: Stores attendee submissions, unique ticket references, contact information, dynamic custom field payloads, and status flags.
2. `platform_settings`: Central key-value / document store for live platform configuration (WhatsApp link, registration open/closed toggle, branding metadata, announcements).
3. `audit_logs`: Audit trail for administrative actions (configuration changes, CSV exports, status updates) for compliance and security forensics.
4. `payments` (Phase 2): Relational table linking registrations to Razorpay orders, payments, amounts, and webhook transaction records.

---

## 2. SQL Migration Script

Below is the complete, idempotent SQL migration script that can be executed directly in the Supabase SQL Editor or applied via the Supabase CLI (`supabase/migrations/20261119_initial_schema.sql`).

```sql
-- =============================================================================
-- Migration: 20261119_initial_schema.sql
-- Description: Core Schema for High-Conversion Registration & Onboarding Platform
-- =============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- -----------------------------------------------------------------------------
-- 1. ENUM TYPES
-- -----------------------------------------------------------------------------
DO $$ BEGIN
    CREATE TYPE registration_status_type AS ENUM ('pending', 'confirmed', 'waitlisted', 'cancelled', 'attended');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_status_type AS ENUM ('unpaid', 'pending', 'paid', 'refunded', 'failed');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- -----------------------------------------------------------------------------
-- 2. REGISTRATIONS TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reference_id VARCHAR(32) NOT NULL UNIQUE,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    custom_fields JSONB DEFAULT '{}'::jsonb,
    registration_status registration_status_type DEFAULT 'confirmed' NOT NULL,
    consent_given BOOLEAN DEFAULT true NOT NULL,
    turnstile_verified BOOLEAN DEFAULT false NOT NULL,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes for high performance
CREATE INDEX IF NOT EXISTS idx_registrations_email ON public.registrations (LOWER(email));
CREATE INDEX IF NOT EXISTS idx_registrations_phone ON public.registrations (phone);
CREATE INDEX IF NOT EXISTS idx_registrations_ref ON public.registrations (reference_id);
CREATE INDEX IF NOT EXISTS idx_registrations_status ON public.registrations (registration_status);
CREATE INDEX IF NOT EXISTS idx_registrations_created_at ON public.registrations (created_at DESC);

-- -----------------------------------------------------------------------------
-- 3. PLATFORM SETTINGS TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.platform_settings (
    key VARCHAR(64) PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_by VARCHAR(128)
);

-- Seed initial settings
INSERT INTO public.platform_settings (key, value, description)
VALUES 
    ('general', '{
        "platformName": "Community Connect",
        "tagline": "Empowering Next-Gen Talent & Community Collaborations",
        "isRegistrationOpen": true,
        "maxRegistrations": 500,
        "supportEmail": "support@community.example.com"
    }'::jsonb, 'Core platform general settings'),
    ('event', '{
        "title": "National Innovation & Leadership Summit 2026",
        "description": "Join 500+ professionals, technologists, and industry leaders for a transformative one-day experience.",
        "date": "December 12, 2026",
        "time": "09:30 AM - 05:00 PM IST",
        "venue": "Grand Convention Auditorium & Online Live Stream",
        "isVirtual": false
    }'::jsonb, 'Event schedule and location settings'),
    ('onboarding', '{
        "whatsappGroupUrl": "https://chat.whatsapp.com/sampleInviteLinkCode123",
        "whatsappGroupTitle": "Official Attendee Network 2026",
        "whatsappInstructions": "Tap below to join the official WhatsApp community to access exclusive speaker materials, networking opportunities, and live session updates."
    }'::jsonb, 'Post-registration onboarding and community links'),
    ('form_fields', '[
        {"id": "organization", "label": "College / Organization Name", "type": "text", "required": true, "placeholder": "e.g. Stanford University / TCS / TechCorp"},
        {"id": "role", "label": "Designation / Academic Year", "type": "select", "required": true, "options": ["Student (1st/2nd Year)", "Student (3rd/4th Year)", "Working Professional (1-3 yrs)", "Senior Professional (3+ yrs)", "Faculty / Researcher"]},
        {"id": "interests", "label": "Primary Area of Interest", "type": "select", "required": false, "options": ["AI & Machine Learning", "Cloud & Web Architecture", "Product Design & UX", "Leadership & Career Growth"]},
        {"id": "referralSource", "label": "How did you hear about us?", "type": "select", "required": false, "options": ["Campus Poster / Flyer", "Instagram", "WhatsApp Group", "LinkedIn", "Friend / Colleague"]}
    ]'::jsonb, 'Configurable dynamic form schema')
ON CONFLICT (key) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 4. AUDIT LOGS TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    action VARCHAR(64) NOT NULL,
    entity VARCHAR(64) NOT NULL,
    entity_id VARCHAR(64),
    details JSONB DEFAULT '{}'::jsonb,
    ip_address INET,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs (created_at DESC);

-- -----------------------------------------------------------------------------
-- 5. PHASE 2 PAYMENTS TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    registration_id UUID NOT NULL REFERENCES public.registrations(id) ON DELETE CASCADE,
    razorpay_order_id VARCHAR(64) NOT NULL UNIQUE,
    razorpay_payment_id VARCHAR(64) UNIQUE,
    razorpay_signature VARCHAR(255),
    amount_in_paise INTEGER NOT NULL,
    currency VARCHAR(8) DEFAULT 'INR' NOT NULL,
    payment_status payment_status_type DEFAULT 'pending' NOT NULL,
    webhook_payload JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_payments_registration ON public.payments (registration_id);
CREATE INDEX IF NOT EXISTS idx_payments_order ON public.payments (razorpay_order_id);

-- -----------------------------------------------------------------------------
-- 6. ROW LEVEL SECURITY (RLS) POLICIES
-- -----------------------------------------------------------------------------
-- Enable RLS across all tables
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Anonymous public policy:
-- Allow public to INSERT new registrations only via authorized API endpoints
-- Read access to all records is strictly restricted to service role or authenticated admins
CREATE POLICY "Deny direct public read access on registrations"
    ON public.registrations
    FOR SELECT
    USING (false);

-- Public can read non-sensitive platform settings (e.g. event details and open status)
CREATE POLICY "Allow public read access to platform settings"
    ON public.platform_settings
    FOR SELECT
    USING (true);

-- Deny public modification of platform settings
CREATE POLICY "Deny public modifications to platform settings"
    ON public.platform_settings
    FOR ALL
    USING (false);

-- Trigger to update updated_at timestamps automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER update_registrations_modtime
BEFORE UPDATE ON public.registrations
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_payments_modtime
BEFORE UPDATE ON public.payments
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```
