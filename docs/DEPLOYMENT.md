# Deployment & Infrastructure Strategy: Vercel & Supabase

---

## 1. Hosting Architecture: Zero-Cost Initial Launch

The platform is designed to be hosted with **$0 fixed recurring cost** during the initial launch and pilot phases using industry-standard free tiers:

| Provider / Component | Role | Free Tier Capacity | Upgrade Trigger |
| :--- | :--- | :--- | :--- |
| **Vercel** | Next.js Hosting & Edge Network | 100 GB Bandwidth, 1M Edge requests/mo | Exceeding 100 GB bandwidth / commercial enterprise scaling ($20/mo Pro) |
| **Supabase** | Managed PostgreSQL & Auth | 500 MB Database, 50,000 MAU, 5 GB storage | Exceeding 500 MB data (approx. 200,000+ registrations) ($25/mo Pro) |
| **Resend** | Transactional Confirmation Emails | 3,000 emails/month (100 emails/day) | Exceeding 3,000 registrations/month ($20/mo for 50,000 emails) |
| **Cloudflare Turnstile** | Bot & Spam Protection | Unlimited free siteverifications | Never (Turnstile is 100% free) |
| **Google Analytics 4** | Web & Conversion Analytics | Unlimited standard events & reporting | Standard enterprise limits |

---

## 2. Environment Variables Configuration

The application requires specific environment variables documented in `.env.example`:

### Mandatory Client-Side Variables:
* `NEXT_PUBLIC_APP_URL`: The canonical public domain (e.g. `https://summit2026.vercel.app` or `https://summit.example.com`). Critical for generating valid QR codes and social share previews.
* `NEXT_PUBLIC_TURNSTILE_SITE_KEY`: Cloudflare Turnstile public site key.
* `NEXT_PUBLIC_SUPABASE_URL`: Supabase project HTTPS URL.
* `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase public anonymous API key (secured by RLS).

### Mandatory Server-Side Variables (Never Exposed to Client):
* `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role secret for administrative database operations and bypassing RLS on server routes.
* `TURNSTILE_SECRET_KEY`: Cloudflare Turnstile secret key for server-side `siteverify` calls.
* `ADMIN_SECRET_KEY`: High-entropy passkey / session secret for administrative portal access (`/admin`).
* `RESEND_API_KEY`: API key for sending confirmation emails via Resend.
* `RESEND_FROM_EMAIL`: Verified sender email (e.g., `invitations@updates.example.com` or `onboarding@resend.dev` for testing).

### Phase 2 Optional Variables (Razorpay):
* `RAZORPAY_KEY_ID`: Razorpay public key.
* `RAZORPAY_KEY_SECRET`: Razorpay secret for HMAC signature verification.
* `RAZORPAY_WEBHOOK_SECRET`: Secret to verify incoming payment webhooks.

---

## 3. Step-by-Step Vercel Deployment

1. **Push Repository to GitHub / GitLab:**
   ```bash
   git add .
   git commit -m "feat: complete registration & onboarding platform"
   git push origin main
   ```
2. **Import Project into Vercel:**
   * Go to [Vercel Dashboard](https://vercel.com/new).
   * Select your GitHub repository.
   * Framework Preset: **Next.js** (automatically detected).
   * Root Directory: `./`.
3. **Configure Environment Variables in Vercel:**
   * Add each key from your `.env.local` or `.env.example` into the Vercel Project Settings > Environment Variables.
4. **Deploy:**
   * Click **Deploy**. Vercel will build the Next.js application, optimize assets, and deploy to their global Edge network.
5. **Assign Custom Domain:**
   * In Project Settings > Domains, add your branded domain (e.g., `register.eventname.com`).
   * Update DNS records (CNAME or A records) with your registrar.
   * Update `NEXT_PUBLIC_APP_URL` to match your custom domain.

---

## 4. Production Smoke-Test Checklist

Prior to printing physical posters or publishing ads, execute the following smoke tests:
- [ ] Access canonical URL via desktop and mobile devices.
- [ ] Scan QR code using physical iPhone camera (Safari) and Android camera (Chrome).
- [ ] Test form submission with valid data and verify confirmation pass renders.
- [ ] Verify test registration record exists in Supabase `registrations` table.
- [ ] Tap "Join WhatsApp Group" button and verify it opens the configured WhatsApp invite link.
- [ ] Check inbox for Resend confirmation email.
- [ ] Attempt duplicate submission with the same email/phone and verify friendly handling.
- [ ] Log into `/admin` and test search, filtering, and CSV export.
- [ ] Verify Turnstile rejects submissions when token is missing or forged.
