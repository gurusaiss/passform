import React from "react";
import Link from "next/link";
import { defaultPlatformConfig } from "@/config/platform.config";
import { ArrowLeft, FileText } from "lucide-react";

export default function TermsPage() {
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
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Terms of Participation
            </h1>
            <p className="text-xs text-slate-500">
              Applicable to all registrants and attendees of {event.title}
            </p>
          </div>
        </div>

        <div className="prose prose-slate dark:prose-invert max-w-none text-sm space-y-6 leading-relaxed">
          <section>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              1. Acceptance of Terms
            </h2>
            <p>
              By completing a registration on this platform, you agree to comply with these Terms of Participation, our Privacy Policy, and any venue-specific code of conduct.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              2. Accuracy of Registration Information
            </h2>
            <p>
              Registrants agree to provide accurate, current, and complete personal and professional details. Duplicate submissions using fictitious names or invalid contact channels may be invalidated by event administrators.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              3. WhatsApp Community Code of Conduct
            </h2>
            <p>
              Access to the official attendee WhatsApp group is a privilege granted to confirmed attendees. Harassment, spamming, unauthorized commercial promotion, solicitation, hate speech, or abuse will result in immediate removal without prior warning.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              4. Event Changes & Modifications
            </h2>
            <p>
              {branding.organizationName} reserves the right to modify the schedule, speaker roster, or session order if circumstances require. Any major updates will be communicated through the official WhatsApp community and email.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
