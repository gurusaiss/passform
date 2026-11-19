import React from "react";
import Link from "next/link";
import { defaultPlatformConfig } from "@/config/platform.config";
import { Mail, Phone, ShieldCheck } from "lucide-react";

export function Footer() {
  const { branding } = defaultPlatformConfig;

  return (
    <footer className="border-t border-slate-200 bg-white py-12 dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {branding.platformName}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Organized by {branding.organizationName}. {branding.tagline}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 dark:text-slate-400">
            {branding.supportEmail && (
              <a
                href={`mailto:${branding.supportEmail}`}
                className="flex items-center gap-1.5 hover:text-blue-600 transition-colors"
              >
                <Mail className="w-4 h-4 text-blue-600" />
                <span>{branding.supportEmail}</span>
              </a>
            )}
            {branding.contactPhone && (
              <div className="flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-emerald-600" />
                <span>{branding.contactPhone}</span>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            &copy; {new Date().getFullYear()} {branding.organizationName}. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:underline">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:underline">
              Terms of Participation
            </Link>
            <Link href="/qr" className="hover:underline">
              Poster QR Code
            </Link>
            <Link href="/admin" className="hover:underline text-slate-400 hover:text-slate-600">
              Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
