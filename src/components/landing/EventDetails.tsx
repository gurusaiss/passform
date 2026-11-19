import React from "react";
import { defaultPlatformConfig } from "@/config/platform.config";
import { Users, CheckCircle, Sparkles, Target } from "lucide-react";

export function EventDetails() {
  const { event } = defaultPlatformConfig;

  return (
    <section id="details" className="py-12 sm:py-16 bg-slate-50/50 dark:bg-slate-900/40 border-y border-slate-200/60 dark:border-slate-800">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Program Eligibility & Highlights
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Designed for forward-thinking talent, students, and professionals eager to master modern industry skills.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-stretch">
          {/* Target Audience Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400">
                  <Target className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Who Should Attend?
                </h3>
              </div>
              <ul className="space-y-3.5 mt-4">
                {event.targetAudience.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300">
                    <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
              Open to all applicants matching the eligibility criteria. Prior technical experience is not strictly required.
            </div>
          </div>

          {/* Onboarding & Journey Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
                  <Sparkles className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Attendee Journey
                </h3>
              </div>
              <div className="space-y-4 mt-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 text-xs font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">Instant Registration</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">Submit the form below in under 30 seconds with zero password friction.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 text-xs font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">Digital Pass Issued</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">Receive your unique reference pass code and email verification receipt.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white text-xs font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">WhatsApp Community Access</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">Join the attendees-only WhatsApp group for session materials, live links, and networking.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
              <a href="#register" className="text-xs font-bold text-blue-600 hover:underline dark:text-blue-400">
                Ready to register? Jump to registration form &rarr;
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
