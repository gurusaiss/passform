"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { defaultPlatformConfig } from "@/config/platform.config";
import { Button } from "@/components/ui/Button";
import {
  CheckCircle2,
  MessageSquare,
  Calendar,
  Clock,
  MapPin,
  Download,
  Share2,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";

export default function ConfirmationPage() {
  const params = useParams();
  const router = useRouter();
  const reference = (params?.reference as string)?.toUpperCase() || "";

  const { event, branding, onboarding } = defaultPlatformConfig;
  const [copied, setCopied] = useState(false);

  // Generate Google Calendar Link
  const createGoogleCalendarUrl = () => {
    const title = encodeURIComponent(event.title);
    const details = encodeURIComponent(
      `${event.description}\n\nYour Registration Reference: ${reference}\nOfficial Community: ${onboarding.whatsappGroupUrl}`
    );
    const location = encodeURIComponent(event.venue);
    // 2026-12-12 09:30 to 17:00 IST (UTC+05:30 -> UTC: 04:00 to 11:30)
    const dates = "20261212T040000Z/20261212T113000Z";
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${dates}`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(reference);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6 lg:px-8 flex flex-col justify-between">
      <div className="max-w-xl mx-auto w-full">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Back to Event Overview
          </Link>
        </div>

        {/* Digital Pass Card */}
        <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-2xl shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white p-6 sm:p-8 text-center relative overflow-hidden">
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
            
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider mb-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>Registration Confirmed</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {event.title}
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-blue-100 font-medium">
              {branding.organizationName}
            </p>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {/* Reference Box */}
            <div className="text-center rounded-2xl border-2 border-dashed border-blue-200 bg-blue-50/60 p-5 dark:border-blue-900/60 dark:bg-blue-950/20">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Official Registration Reference
              </span>
              <div className="mt-1 font-mono text-2xl sm:text-3xl font-extrabold text-blue-700 dark:text-blue-400 tracking-wider">
                {reference}
              </div>
              <button
                type="button"
                onClick={handleCopy}
                className="mt-2 text-xs font-semibold text-blue-600 hover:text-blue-800 dark:text-blue-400 inline-flex items-center gap-1"
              >
                <span>{copied ? "Copied to Clipboard!" : "Copy Reference ID"}</span>
              </button>
            </div>

            {/* Event Schedule Details */}
            <div className="space-y-3 rounded-2xl bg-slate-50 p-4 sm:p-5 dark:bg-slate-800/60 text-xs sm:text-sm">
              <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                <Calendar className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="font-medium">{event.date}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                <Clock className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="font-medium">{event.time}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-medium">{event.venue}</span>
              </div>
            </div>

            {/* Verification Pass QR Code */}
            <div className="flex flex-col items-center justify-center p-4 rounded-2xl border border-slate-100 bg-white dark:border-slate-800 dark:bg-slate-900 text-center">
              <div className="p-2 rounded-xl bg-white shadow-sm border border-slate-200">
                <img
                  src={`/api/qr?url=${encodeURIComponent(
                    `${typeof window !== "undefined" ? window.location.origin : ""}/confirmation/${reference}`
                  )}&width=200`}
                  alt={`Verification QR for ${reference}`}
                  className="w-36 h-36 object-contain"
                />
              </div>
              <span className="text-[11px] text-slate-400 mt-2 font-mono">
                Present this code at check-in desk
              </span>
            </div>

            {/* PRIMARY WHATSAPP CTA - The central onboarding action */}
            <div className="pt-2">
              <div className="rounded-2xl border-2 border-emerald-300 bg-emerald-50/80 p-5 text-center dark:border-emerald-800 dark:bg-emerald-950/30">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <MessageSquare className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base sm:text-lg">
                    Step 2: Join Attendee Community
                  </h3>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
                  {onboarding.whatsappInstructions}
                </p>

                <Button
                  variant="whatsapp"
                  size="lg"
                  onClick={() => window.open(onboarding.whatsappGroupUrl, "_blank")}
                  className="w-full text-base font-bold py-4 shadow-lg shadow-emerald-600/25"
                >
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Join Official WhatsApp Group
                </Button>

                <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Exclusive link for verified attendees</span>
                </div>
              </div>
            </div>

            {/* Utility Actions: Calendar & Print */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <a
                href={createGoogleCalendarUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full"
              >
                <Button variant="outline" size="md" className="w-full text-xs font-semibold">
                  <Calendar className="w-4 h-4 mr-1.5" />
                  Add to Calendar
                </Button>
              </a>

              <Button
                variant="outline"
                size="md"
                onClick={handlePrint}
                className="w-full text-xs font-semibold"
              >
                <Download className="w-4 h-4 mr-1.5" />
                Print / Save Pass
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center text-xs text-slate-400 py-6">
        &copy; {new Date().getFullYear()} {branding.organizationName}. Reference: {reference}
      </div>
    </div>
  );
}
