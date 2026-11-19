import React from "react";
import { defaultPlatformConfig } from "@/config/platform.config";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export function Hero() {
  const { event } = defaultPlatformConfig;

  return (
    <section className="relative overflow-hidden pt-10 pb-16 sm:pt-16 sm:pb-24 lg:pt-20">
      {/* Decorative background subtle glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 w-full max-w-7xl h-96 bg-gradient-to-b from-blue-50/80 via-indigo-50/40 to-transparent dark:from-blue-950/20 dark:via-indigo-950/10 blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
        {/* Event status badge */}
        <div className="inline-flex items-center gap-2 mb-6">
          <Badge variant="info" className="px-3 py-1 text-xs font-bold tracking-wider">
            <Sparkles className="w-3.5 h-3.5 mr-1 text-blue-600 dark:text-blue-400" />
            {event.badgeText}
          </Badge>
        </div>

        {/* Main headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
          {event.title}
        </h1>

        {/* Subtitle */}
        <p className="mt-4 text-lg sm:text-xl font-medium text-blue-700 dark:text-blue-400">
          {event.subtitle}
        </p>

        {/* Event description */}
        <p className="mt-4 text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          {event.description}
        </p>

        {/* Event Key Metadata Pills */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs sm:text-sm">
          <div className="flex items-center gap-2 rounded-xl bg-slate-100/90 dark:bg-slate-800/80 px-4 py-2.5 text-slate-800 dark:text-slate-200 border border-slate-200/60 dark:border-slate-700/60 shadow-xs">
            <Calendar className="w-4 h-4 text-blue-600" />
            <span className="font-semibold">{event.date}</span>
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-slate-100/90 dark:bg-slate-800/80 px-4 py-2.5 text-slate-800 dark:text-slate-200 border border-slate-200/60 dark:border-slate-700/60 shadow-xs">
            <Clock className="w-4 h-4 text-blue-600" />
            <span className="font-semibold">{event.time}</span>
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-slate-100/90 dark:bg-slate-800/80 px-4 py-2.5 text-slate-800 dark:text-slate-200 border border-slate-200/60 dark:border-slate-700/60 shadow-xs">
            <MapPin className="w-4 h-4 text-emerald-600" />
            <span className="font-semibold">{event.venue}</span>
          </div>
        </div>

        {/* Call-to-action button */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a href="#register" className="w-full sm:w-auto">
            <Button size="lg" variant="primary" className="w-full sm:w-auto px-8 py-4 font-bold shadow-lg shadow-blue-600/30">
              <span>Claim Your Free Pass</span>
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </a>
          <a href="#details" className="w-full sm:w-auto">
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              View Event Schedule
            </Button>
          </a>
        </div>

        <div className="mt-5 flex items-center justify-center gap-2 text-xs text-slate-500">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Zero login friction • Instant WhatsApp community invitation</span>
        </div>
      </div>
    </section>
  );
}
