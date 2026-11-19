import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/landing/Navbar";
import { RegistrationForm } from "@/components/form/RegistrationForm";
import { Footer } from "@/components/landing/Footer";
import { ArrowLeft, Sparkles } from "lucide-react";
import { defaultPlatformConfig } from "@/config/platform.config";

export default function RegisterDirectPage() {
  const { event } = defaultPlatformConfig;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar />

      <main className="flex-1 py-10 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            View Full Event Schedule & Details
          </Link>

          <div className="text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 text-xs font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Direct Registration</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {event.title}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              {event.date} • {event.time}
            </p>
          </div>
        </div>

        <RegistrationForm />
      </main>

      <Footer />
    </div>
  );
}
