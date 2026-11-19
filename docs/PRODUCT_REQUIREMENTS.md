# Product Requirements Document (PRD)

## Project: High-Conversion Registration & Community Onboarding Platform

---

## 1. Vision & Core Value Proposition

The platform bridges the gap between physical promotional collateral (posters, standees, flyers, print ads) and digital social campaigns (Instagram, WhatsApp, X, LinkedIn) by providing a friction-free, mobile-optimized registration portal that instantly directs verified registrants into a designated WhatsApp community.

Unlike generic tools (Google Forms, Typeform), this platform offers:
1. **Zero-login barrier** for physical QR code scans and in-app webview traffic.
2. **Dynamic centralized configuration** allowing event organizers to customize branding, copy, dates, locations, and custom form fields without code modifications.
3. **Automated WhatsApp community funneling** with direct deep-links and transactional email backup.
4. **Enterprise-grade bot protection** via Cloudflare Turnstile without hostile captchas.
5. **Secure administration portal** with search, multi-field filtering, CSV export, and Row Level Security (RLS).
6. **Extensible architecture** ready for Phase 2 Razorpay ticket fee collection and webhooks.

---

## 2. User Personas

### Persona A: The Event Attendee / Community Registrant (Mobile User)
* **Context:** Standing in front of a college, conference, or office poster, or tapping an Instagram story sticker.
* **Device:** Mobile smartphone (iOS / Android), frequently running an in-app browser (Instagram/WhatsApp/Chrome/Safari).
* **Pain Points:** Slow page loading, forced Google or social account logins, complex forms, missing confirmation, losing track of group links.
* **Goal:** Register within 30 seconds, get an instant digital pass reference, and join the WhatsApp group in one tap.

### Persona B: The Program Director / Event Administrator
* **Context:** Operating marketing campaigns, monitoring real-time seat fill rates, managing attendee communications, and checking in attendees.
* **Pain Points:** Messy spreadsheets, spam bots filling quota, duplicate submissions from network glitches, lack of search/filter tools.
* **Goal:** A clean, authenticated admin dashboard to view stats, search attendees, filter by status, export clean CSVs, and adjust event settings on the fly.

---

## 3. End-to-End User Journey

```
[Physical Poster / Social Post]
          │
          ▼
    [Scan QR Code / Click Branded URL]
          │
          ▼
    [Landing Page]
    - Brand Logo, Title, Badge, Description
    - Date, Time, Venue, Eligibility
    - FAQ, Organizer Contact
    - Floating/Fixed "Register Now" CTA
          │
          ▼
    [Registration Form]
    - Full Name, Email, Phone Number (WhatsApp Enabled)
    - Dynamic Additional Fields (e.g. Organization, Role, Experience, Dietary)
    - Privacy Policy Consent Checkbox
    - Invisible / Managed Cloudflare Turnstile Verification
          │
          ▼
    [Server Validation & DB Persistence]
    - Duplicate detection (email/phone)
    - Cryptographic reference generation (e.g., REG-2026-XXXX)
    - Idempotent write to Supabase PostgreSQL
    - Async transactional confirmation email via Resend
          │
          ▼
    [Success Confirmation Page]
    - Digital Ticket Pass Card (Reference ID, Attendee Name, QR verification)
    - High-visibility "Join WhatsApp Group" button (Deep link + web fallback)
    - "Add to Calendar" / Download Reference option
          │
          ▼
    [WhatsApp Community & Email Inbox]
    - Instant group entry
    - Backup email receipt with registration reference & link
```

---

## 4. Functional Requirements

### 4.1 Promotional Entry & QR System
* **Canonical URL Resolution:** Support custom domain and canonical base URL (`NEXT_PUBLIC_APP_URL`).
* **Downloadable Vector & High-Res QR Code:** Built-in utility to generate and download branded QR codes for physical printing (SVG & PNG).
* **In-App Browser Resilience:** Clean viewport handling, no pop-up blockers, graceful protocol fallbacks.

### 4.2 Dynamic Landing Page
* Fully configurable via `platform_config.json` and database-backed `platform_settings`:
  * Brand Name, Logo, Tagline, Hero Headline, Subtitle.
  * Event/Program dates, schedule times, physical venue or virtual link.
  * Target audience criteria and eligibility rules.
  * Feature/Benefit cards with Lucide icons.
  * Dynamic FAQ accordion.
  * Footer with organizer contact details, privacy policy, and terms.
* Registration status switch: `open`, `closing_soon`, `closed`, `waitlist`.

### 4.3 Custom Registration Engine
* **Core Mandatory Fields:**
  * `fullName`: String (2–100 chars, trimmed, sanitized).
  * `email`: RFC 5322 compliant, normalized lowercase.
  * `phone`: International format or 10-digit standard with country code.
* **Dynamic Custom Fields Configuration:**
  * Field types supported: `text`, `select`, `radio`, `checkbox`, `textarea`, `number`.
  * Dynamic validation rules: min, max, regex, required flags.
* **Security & Bot Protection:**
  * Cloudflare Turnstile widget with mandatory server-side `siteverify`.
  * Rate limiting (IP-based and windowed) to prevent DoS.
  * In-memory or database idempotency key to prevent double submissions.
* **Client & Server Validation:**
  * Zod schemas shared between client form state and server route handler.
  * Inline human-friendly validation feedback.

### 4.4 Confirmation & WhatsApp Onboarding
* **Unique Reference Generation:** Deterministic / random high-entropy reference code (e.g. `TCS-8924-X7K`).
* **WhatsApp Deep Link Strategy:**
  * Primary: `whatsapp://chat?code=...` or `https://chat.whatsapp.com/...`.
  * Contextual disclaimer informing users that the group link is for registered members.
* **Transactional Email (Resend):**
  * Branded HTML confirmation email with registration reference, event schedule, and backup WhatsApp link.
  * Non-blocking async queueing: if email fails or Resend API key is unconfigured, database record is safely preserved and user receives success screen.

### 4.5 Administrative Dashboard & Operations
* **Authentication:** Supabase Auth (or secure token/session admin auth).
* **KPI Metrics:** Total Registrations, Daily Growth Rate, Check-in / Verification status.
* **Search & Filters:** Full-text search across name, email, phone, reference; filter by status and date range.
* **Export:** Instant CSV download with properly escaped headers and values.
* **Live Configuration:** Ability for admin to toggle registration state (open/closed) and update WhatsApp group link directly.

---

## 5. Non-Functional Requirements

* **Performance:** Mobile page load under 1.5 seconds on 4G networks; minimal initial JS bundle; static generation with incremental revalidation where appropriate.
* **Accessibility:** WCAG 2.1 AA compliance, accessible color contrast ratios, screen-reader-friendly ARIA attributes, full keyboard navigation.
* **Security:** OWASP Top 10 compliance, Content Security Policy, strict CORS, Row Level Security on all Supabase tables, zero leaked secrets in client bundles.
* **Cost:** Target $0 monthly infrastructure cost on Vercel Hobby + Supabase Free + Resend Free tiers during initial launch.
