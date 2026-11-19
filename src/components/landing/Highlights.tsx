import React from "react";
import { defaultPlatformConfig } from "@/config/platform.config";
import { Sparkles, Cpu, MessageSquare, Award, HelpCircle } from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  Sparkles,
  Cpu,
  MessageSquare,
  Award,
};

export function Highlights() {
  const { event } = defaultPlatformConfig;

  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Why Attend This Summit?
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Gain actionable insights, build high-value connections, and take your technical and leadership skills to the next tier.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {event.highlights.map((h, idx) => {
            const Icon = iconMap[h.icon] || Sparkles;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 mb-4">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                  {h.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {h.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
