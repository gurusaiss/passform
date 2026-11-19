# Platform Owner Setup & Launch Checklist

---

## 1. Overview

This checklist outlines the business-specific configurations, third-party accounts, and credentials needed by the project owner to transition the platform from default placeholders to a live public campaign.

---

## 2. Configuration & Credentials Checklist

### A. Core Platform & Event Branding (Editable in `src/config/platform.config.ts`)
- [ ] **Platform / Initiative Name:** Replace default `"Community Connect"` with official project or organization name.
- [ ] **Event Title & Tagline:** Define the actual headline (e.g., `"TCS Annual Tech Innovation Summit 2026"`).
- [ ] **Event Date, Time & Venue:** Replace placeholder dates and locations.
- [ ] **Brand Logo:** Upload official brand SVG/PNG logo into `public/images/logo.png`.
- [ ] **Custom Registration Fields:** Customize dynamic fields (e.g., Department, Student ID, T-shirt size) in `platform.config.ts`.
- [ ] **Privacy Policy & Terms:** Update legal contact email and entity name in `docs` / footer.

### B. WhatsApp Community Setup
- [ ] **Create WhatsApp Group / Community:** In WhatsApp on mobile, create the official community/group.
- [ ] **Copy Invite Link:** Open group info > "Invite via link" > Copy link.
- [ ] **Configure Group Security:** 
  - (Recommended) In WhatsApp Group Settings, set "Send Messages: Only Admins" if this is an announcement channel.
  - (Optional) Toggle "Approve new participants" for extra access control.
- [ ] **Set Link in Platform:** Paste the link into `NEXT_PUBLIC_DEFAULT_WHATSAPP_URL` or update via the `/admin` portal.

### C. Cloudflare Turnstile (Spam & Bot Defense)
- [ ] Sign up for a free account at [Cloudflare](https://dash.cloudflare.com).
- [ ] Navigate to **Turnstile** > **Add Site**.
- [ ] Site Name: e.g. `Registration Platform`.
- [ ] Domain: Add your production domain (e.g. `form.vercel.app` or custom domain) and `localhost` for testing.
- [ ] Widget Mode: **Managed** (or Invisible).
- [ ] Copy **Site Key** (`NEXT_PUBLIC_TURNSTILE_SITE_KEY`) and **Secret Key** (`TURNSTILE_SECRET_KEY`).
- [ ] *(Note: For local testing without an account, Cloudflare provides a standard test key that always passes).*

### D. Supabase PostgreSQL Database
- [ ] Sign up at [Supabase](https://supabase.com) (Free tier).
- [ ] Create a new project (e.g., `registration-platform`).
- [ ] In Supabase Dashboard, go to **SQL Editor**.
- [ ] Copy and paste the entire script from `supabase/migrations/20261119_initial_schema.sql` and run it.
- [ ] Go to **Project Settings** > **API**.
- [ ] Copy:
  - `Project URL` -> `NEXT_PUBLIC_SUPABASE_URL`
  - `anon public` key -> `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `service_role secret` key -> `SUPABASE_SERVICE_ROLE_KEY` (Keep secure!)

### E. Resend Transactional Email (Optional for Phase 1)
- [ ] Sign up at [Resend](https://resend.com) (Free tier: 3,000 emails/mo).
- [ ] Go to **API Keys** > Create API Key.
- [ ] Set `RESEND_API_KEY`.
- [ ] (Production) Add and verify your custom sending domain in Resend DNS settings. Set `RESEND_FROM_EMAIL=summit@yourdomain.com`.
- [ ] *(Note: If Resend is omitted or left unconfigured, the application gracefully skips email dispatch and the attendee still completes registration and joins WhatsApp seamlessly).*

### F. Administrative Portal Password
- [ ] Generate a secure random password for admin access (e.g., 32 characters).
- [ ] Set `ADMIN_SECRET_KEY=your_secure_admin_password_here`.

---

## 3. Physical Collateral (Poster & Standee) Checklist

- [ ] Deploy platform to production domain (e.g., `https://summit.example.com`).
- [ ] Open the built-in QR generator utility at `/admin/qr` or `/qr`.
- [ ] Verify that the QR code points to the canonical production URL.
- [ ] Download high-resolution vector SVG or 300 DPI PNG.
- [ ] Place QR code on promotional posters with a clear caption:
  > *"Scan with your smartphone camera to register & join the official WhatsApp community."*
- [ ] Test the printed proof with both iPhone camera and Android Google Lens before mass printing.
