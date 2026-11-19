# Quality Assurance & Testing Strategy

---

## 1. Overview & Test Matrix

To ensure the registration and community onboarding platform behaves reliably under high traffic spikes from poster campaigns and social media blasts, testing encompasses five tiers:

1. **Unit & Validation Tests:** Verifying input sanitizers, Zod schemas, duplicate detection, and reference code generation.
2. **Security & Penetration Tests:** Verifying Cloudflare Turnstile token validation, rate limiting, RLS policies, and CSV formula injection neutralization.
3. **API & Route Handler Tests:** Verifying `/api/register`, `/api/admin/registrations`, `/api/admin/export`, and error status codes.
4. **Cross-Device & Mobile Usability Tests:** Verifying rendering across screen widths (360px to 4K), virtual keyboards, iOS Safari, Android Chrome, and in-app webviews (Instagram, WhatsApp).
5. **Production Build & Type Check:** TypeScript static analysis (`tsc --noEmit`), ESLint compliance, and Next.js production build (`next build`).

---

## 2. Test Execution Plan

### 2.1 Functional Validation Test Cases

| Test ID | Scenario | Input | Expected Outcome |
| :--- | :--- | :--- | :--- |
| **TC-F01** | Valid Registration | Valid Name, Email, Phone, required custom fields | Returns HTTP 201, generates `REG-2026-XXXX`, redirects to confirmation page with WhatsApp button |
| **TC-F02** | Invalid Email | Email missing `@` or domain (`test@`) | Returns HTTP 400, client displays inline validation error, no DB write |
| **TC-F03** | Invalid Phone | Short string (`1234`) or alphabet characters | Returns HTTP 400, inline error |
| **TC-F04** | Duplicate Registration | Same email or phone as existing record | Friendly notice: "You are already registered! Here is your registration reference." |
| **TC-F05** | Missing Required Custom Field | Required field omitted in payload | Returns HTTP 400 with specific field path error |
| **TC-F06** | WhatsApp Button Behavior | Attendee clicks "Join WhatsApp Group" | Launches WhatsApp app on mobile or opens `chat.whatsapp.com` on desktop |

### 2.2 Security Test Cases

| Test ID | Scenario | Attack Vector | Expected Outcome |
| :--- | :--- | :--- | :--- |
| **TC-S01** | Bypass Turnstile | Submit payload with dummy token (`"turnstileToken": "fake"`) | Backend rejects via Cloudflare `siteverify`, returns HTTP 403 Forbidden |
| **TC-S02** | Rate Limiting | 20 rapid requests from single IP within 10 seconds | HTTP 429 Too Many Requests |
| **TC-S03** | Public Data Harvesting | Anonymous user sends `GET /rest/v1/registrations` directly to Supabase | Returns empty array `[]` or 401 Unauthorized via RLS |
| **TC-S04** | Unauthorized Admin Access | Non-authenticated user calls `/api/admin/registrations` | Returns HTTP 401 Unauthorized |
| **TC-S05** | CSV Formula Injection | Name set to `=1+1+cmd|' /C calc'!A0` | CSV export prepends single quote: `'=1+1+cmd...` preventing spreadsheet execution |
| **TC-S06** | Secret Leaks | Inspect client bundle for `SUPABASE_SERVICE_ROLE_KEY` or `TURNSTILE_SECRET_KEY` | Zero secret tokens found in `.next/static` or browser network tab |

### 2.3 Mobile & Responsive Test Specifications
* **Screen Sizes:**
  * 360px (Standard compact Android - Samsung Galaxy A series)
  * 390px / 414px (Apple iPhone 12/13/14/15/16 Pro)
  * 768px (iPad / Tablet)
  * 1280px+ (Desktop monitor)
* **Touch Targets:** All clickable CTA buttons (Register, Join WhatsApp, Submit) have minimum touch height of 48px.
* **Input Zoom Prevention:** Font sizes on mobile inputs are minimum 16px to prevent iOS Safari auto-zoom behavior on focus.
