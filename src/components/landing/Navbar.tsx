"use client";

import React from "react";
import Link from "next/link";
import { defaultPlatformConfig } from "@/config/platform.config";
import { Button } from "@/components/ui/Button";
import { Sparkles, QrCode } from "lucide-react";

export function Navbar() {
  const { branding } = defaultPlatformConfig;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white font-bold text-lg shadow-md shadow-blue-600/30 group-hover:scale-105 transition-transform">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-slate-900 dark:text-white leading-tight text-base sm:text-lg">
              {branding.platformName}
            </span>
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 -mt-0.5">
              {branding.organizationName}
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <Link href="/qr" className="hidden sm:inline-flex">
            <Button variant="ghost" size="sm" className="text-xs">
              <QrCode className="w-4 h-4 mr-1.5" />
              Poster QR Code
            </Button>
          </Link>
          <a href="#register">
            <Button size="sm" variant="primary" className="text-xs sm:text-sm font-bold">
              Register Now
            </Button>
          </a>
        </div>
      </div>
    </header>
  );
}
