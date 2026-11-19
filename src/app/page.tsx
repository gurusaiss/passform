import React from "react";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { EventDetails } from "@/components/landing/EventDetails";
import { Highlights } from "@/components/landing/Highlights";
import { FaqSection } from "@/components/landing/FaqSection";
import { Footer } from "@/components/landing/Footer";
import { RegistrationForm } from "@/components/form/RegistrationForm";
import { Sparkles } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Navbar />

      <main className="flex-1">
        {/* 1. Hero Section */}
        <Hero />

        {/* 2. Key Highlights */}
        <Highlights />

        {/* 3. Program & Eligibility Details */}
        <EventDetails />

        {/* 4. Registration Anchor Section */}
        <section
          id="register"
          className="relative py-16 sm:py-24 bg-gradient-to-b from-slate-50 via-blue-50/20 to-white dark:from-slate-900/60 dark:via-blue-950/20 dark:to-slate-950"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 text-xs font-bold mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Reserve Your Spot</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Register For The Summit
              </h2>
              <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400">
                Submit your registration to receive your attendee reference pass and unlock instant entry into our official WhatsApp community.
              </p>
            </div>

            {/* Registration Form Component */}
            <RegistrationForm />
          </div>
        </section>

        {/* 5. FAQs */}
        <FaqSection />
      </main>

      <Footer />
    </div>
  );
}
