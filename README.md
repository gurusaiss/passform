# Production-Ready Registration & Community Onboarding Platform

A high-performance, mobile-first web platform engineered to convert physical poster scans and social media campaigns directly into verified registrations and WhatsApp community members—without relying on Google Forms.

---

## 🌟 The Core User Journey

```
PROMOTIONAL POSTER / AD / SOCIAL LINK
                 │
                 ▼
          SCAN QR CODE / CLICK URL
                 │
                 ▼
       MOBILE-FIRST LANDING PAGE
(Zero forced logins, clean above-the-fold value proposition)
                 │
                 ▼
       STREAMLINED REGISTRATION FORM
(Inline validation, custom dynamic fields, Cloudflare Turnstile)
                 │
                 ▼
      DATABASE PERSISTENCE & EMAIL CONFIRMATION
(Supabase PostgreSQL, atomic duplicate checks, Resend async email)
                 │
                 ▼
     DIGITAL REFERENCE PASS & WHATSAPP ONBOARDING
(Pass QR code, Add to Calendar, 1-tap WhatsApp deep link)
```

---

## 🚀 Key Features

* **Mobile-First & In-App Browser Resilient:** Engineered for 360px–4K displays. Eliminates Google Sign-In friction inside Instagram, Facebook, LinkedIn, and camera in-app webviews.
* **Centralized Configuration System (`src/config/platform.config.ts`):** Update brand name, event schedule, venue, custom registration fields, and WhatsApp links without modifying application code.
* **Dynamic Custom Registration Engine:** Supports text, select dropdowns, radio buttons, numbers, and checkboxes with server-side Zod validation.
* **Single Source of Truth (Supabase PostgreSQL):** Normalized relational database with Row Level Security (RLS) policies and complete anonymous read denial to safeguard personal data (PII).
* **Enterprise Bot Protection (Cloudflare Turnstile):** Invisible / managed cryptographic challenge verification via Cloudflare `siteverify` API.
* **Sliding Window IP Rate Limiting:** Built-in protection against DoS and submission spam (10 req/min/IP).
* **Automated WhatsApp Onboarding:** Dual-mode deep linking (`whatsapp://` + `https://chat.whatsapp.com`) with attendee verification guidelines.
* **Async Transactional Confirmation (Resend):** Branded HTML receipts dispatched asynchronously without blocking the user interface.
* **Protected Administrative Console (`/admin`):** Search by name, email, phone, or reference ID; filter by status; inspect custom fields; and export RFC-4180 compliant CSVs with formula-injection neutralization.
* **Print-Ready QR Generator (`/qr`):** Download 300 DPI PNGs or scalable vector SVGs for physical poster printing.
* **Phase 2 Payment Extensibility:** Pre-architected Razorpay order creation and HMAC SHA-256 signature verification endpoints ready to toggle on for paid ticketing.

---

## 🛠️ Technology Stack

| Component | Technology | Rationale |
| :--- | :--- | :--- |
| **Frontend** | Next.js 16 (App Router), React 19, TypeScript | Server Components, fast initial page load, partial prefetching |
| **Styling** | Tailwind CSS v4 | High-performance styling, modern utility tokens |
| **Icons** | Lucide React | Lightweight, accessible, scalable SVG icons |
| **Database** | Supabase (PostgreSQL) | ACID compliance, Row Level Security (RLS), realtime scalability |
| **Bot Protection** | Cloudflare Turnstile | Seamless, user-friendly bot prevention without annoying captchas |
| **Email** | Resend | Reliable transactional email delivery with high inbox rates |
| **QR Generation** | `qrcode` | Client & server vector SVG and raster PNG generator |
| **Hosting** | Vercel Edge Network | Global CDN, sub-second TTFB, $0 initial free tier |
| **Payments (Phase 2)**| Razorpay | India & global payment gateway (UPI, Cards, NetBanking) |

---

## 🏁 Quick Start & Local Development

### 1. Prerequisites
- Node.js 20+ (Node.js 24 recommended)
- npm 10+

### 2. Installation
```bash
# Clone or navigate to the repository
cd form

# Install dependencies
npm install
```

### 3. Environment Setup
Copy the environment template:
```bash
cp .env.example .env.local
```
*(The repository includes development test keys in `.env.local` so you can test registration, QR generation, and the admin portal immediately out of the box).*

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

* Public Landing Page: [http://localhost:3000](http://localhost:3000)
* Direct Registration View: [http://localhost:3000/register](http://localhost:3000/register)
* Print-Ready QR Poster Hub: [http://localhost:3000/qr](http://localhost:3000/qr)
* Administrator Console: [http://localhost:3000/admin](http://localhost:3000/admin) *(Default local passkey: `admin123`)*

---

## 🧪 Testing

The repository contains an automated unit and security test suite covering validation, formula injection protection, rate limiting, and Turnstile verification:

```bash
# Run automated tests
npm test

# Run Next.js production build and type check
npm run build
```

---

## 🗄️ Database Setup (Supabase PostgreSQL)

1. Create a free project at [supabase.com](https://supabase.com).
2. In the Supabase Dashboard, open **SQL Editor**.
3. Open `supabase/migrations/20261119_initial_schema.sql` from this repository, paste the SQL, and click **Run**.
4. In **Project Settings** > **API**, copy:
   * Project URL -> `NEXT_PUBLIC_SUPABASE_URL`
   * Anon Public Key -> `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   * Service Role Secret Key -> `SUPABASE_SERVICE_ROLE_KEY`
5. Add these keys to your `.env.local` (and Vercel environment variables).

*(Note: When Supabase keys are not set, the platform automatically utilizes a resilient in-memory fallback store so development and testing are never blocked).*

---

## ⚙️ Customization Guide

### Editing Branding, Copy, and Event Information
Open `src/config/platform.config.ts`:
```typescript
export const defaultPlatformConfig: PlatformConfig = {
  branding: {
    platformName: "Your Initiative Name",
    organizationName: "Your Organization",
    supportEmail: "contact@yourdomain.com",
  },
  event: {
    title: "Your Event Title",
    date: "Saturday, October 24, 2026",
    time: "10:00 AM – 4:00 PM IST",
    venue: "Main Auditorium / Google Meet",
    // ...
  },
  onboarding: {
    whatsappGroupUrl: "https://chat.whatsapp.com/YourActualGroupCode",
    // ...
  },
  // Add or remove custom fields dynamically:
  registration: {
    customFields: [
      { id: "department", label: "Department / Stream", type: "text", required: true },
      { id: "year", label: "Graduation Year", type: "select", options: ["2026", "2027", "2028"], required: true },
    ]
  }
};
```

---

## 📚 Complete Project Documentation

Comprehensive architectural and deployment specifications are available in the `docs/` folder:

1. [Competitor Research & Analysis](file:///d:/Coding/INTERN/TCS/form/docs/COMPETITOR_RESEARCH.md)
2. [Product Requirements Document (PRD)](file:///d:/Coding/INTERN/TCS/form/docs/PRODUCT_REQUIREMENTS.md)
3. [System Architecture Specification](file:///d:/Coding/INTERN/TCS/form/docs/ARCHITECTURE.md)
4. [Database Schema & RLS Guide](file:///d:/Coding/INTERN/TCS/form/docs/DATABASE_SCHEMA.md)
5. [Security & OWASP Hardening Guide](file:///d:/Coding/INTERN/TCS/form/docs/SECURITY.md)
6. [Deployment & Infrastructure Strategy](file:///d:/Coding/INTERN/TCS/form/docs/DEPLOYMENT.md)
7. [Testing & Quality Assurance Guide](file:///d:/Coding/INTERN/TCS/form/docs/TESTING.md)
8. [Phase 2 Razorpay Payment Architecture](file:///d:/Coding/INTERN/TCS/form/docs/PHASE_2_PAYMENTS.md)
9. [Platform Owner Setup & Launch Checklist](file:///d:/Coding/INTERN/TCS/form/docs/OWNER_SETUP_CHECKLIST.md)

---

## 📄 License
MIT License. Built for production deployment and high-volume community onboarding.
