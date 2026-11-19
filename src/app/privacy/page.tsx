import React from "react";
import Link from "next/link";
import { defaultPlatformConfig } from "@/config/platform.config";
import { ArrowLeft, Shield } from "lucide-react";

export default function PrivacyPage() {
  const { branding, event } = defaultPlatformConfig;

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Back to Event Page
        </Link>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Privacy Policy & Data Protection
            </h1>
            <p className="text-xs text-slate-500">
              Last updated: November 2026 • Effective for {event.title}
            </p>
          </div>
        </div>

        <div className="prose prose-slate dark:prose-invert max-w-none text-sm space-y-6 leading-relaxed">
          <section>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              1. Information We Collect
            </h2>
            <p>
              When you register for {event.title}, we collect only the personal information strictly necessary to administer your registration, issue your digital pass, verify your credentials, and facilitate your entry into our official event community:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Contact Information:</strong> Full name, verified email address, and mobile phone number (WhatsApp enabled).</li>
              <li><strong>Academic / Professional Background:</strong> College/organization name, academic year, or professional role.</li>
              <li><strong>Technical Metadata:</strong> Timestamp of submission, IP address (for anti-abuse and rate limiting), and user-agent string.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              2. How Your Information Is Used
            </h2>
            <p>We use your information exclusively for the following purposes:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Generating and verifying your unique attendee reference pass.</li>
              <li>Sending transactional email confirmations and important scheduling updates.</li>
              <li>Providing secure access to the official attendee WhatsApp community.</li>
              <li>Preventing automated spam registrations and protecting platform integrity via Cloudflare Turnstile.</li>
            </ul>
            <p className="mt-2 text-xs text-slate-500">
              We never sell, rent, or trade your personal contact details to third-party advertisers.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              3. WhatsApp Community Privacy
            </h2>
            <p>
              By joining the official WhatsApp group, you acknowledge that your WhatsApp profile name and phone number may be visible to fellow group members within WhatsApp's standard group interface. The community is managed under strict code-of-conduct guidelines.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              4. Data Retention & Your Rights
            </h2>
            <p>
              Your registration records are retained in an encrypted PostgreSQL database protected by Row Level Security (RLS) until the conclusion of the event series. You may request the modification or deletion of your registration data at any time by contacting our organizing team at{" "}
              <a href={`mailto:${branding.supportEmail}`} className="text-blue-600 underline">
                {branding.supportEmail}
              </a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
