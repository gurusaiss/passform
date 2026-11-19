"use client";

import React, { useState } from "react";
import Link from "next/link";
import { defaultPlatformConfig } from "@/config/platform.config";
import { Button } from "@/components/ui/Button";
import {
  QrCode,
  Download,
  Copy,
  ExternalLink,
  ArrowLeft,
  Sparkles,
  Printer,
  Check,
  ShieldCheck,
} from "lucide-react";

export default function QrPosterPage() {
  const { branding, event } = defaultPlatformConfig;
  const canonicalUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const [copied, setCopied] = useState(false);
  const [qrSize, setQrSize] = useState<number>(512);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(canonicalUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPng = () => {
    window.location.href = `/api/qr?url=${encodeURIComponent(
      canonicalUrl
    )}&width=${qrSize}&download=true`;
  };

  const handleDownloadSvg = () => {
    window.location.href = `/api/qr?url=${encodeURIComponent(
      canonicalUrl
    )}&format=svg&download=true`;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Back to Event Landing Page
          </Link>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-xl dark:border-slate-800 dark:bg-slate-900">
          <div className="text-center max-w-xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 text-xs font-bold mb-3">
              <QrCode className="w-3.5 h-3.5" />
              <span>Promotional & Poster Assets</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Print-Ready Registration QR Code
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Generate and download crisp, high-resolution vector and raster QR codes for physical event posters, standees, and digital marketing materials.
            </p>
          </div>

          {/* QR Display Card */}
          <div className="my-8 flex flex-col items-center justify-center p-8 rounded-2xl border border-slate-200/80 bg-slate-50 dark:border-slate-800 dark:bg-slate-950/50">
            <div className="p-4 rounded-2xl bg-white shadow-md border border-slate-200">
              <img
                src={`/api/qr?url=${encodeURIComponent(canonicalUrl)}&width=350`}
                alt="Registration QR Code"
                className="w-56 h-56 sm:w-64 sm:h-64 object-contain"
              />
            </div>

            <div className="mt-4 text-center">
              <p className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-300">
                {canonicalUrl}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Encodes direct, frictionless access to your branded registration form
              </p>
            </div>
          </div>

          {/* Download Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button
              variant="primary"
              size="lg"
              onClick={handleDownloadPng}
              className="font-bold py-4"
            >
              <Download className="w-5 h-5 mr-2" />
              Download High-Res PNG (300 DPI)
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={handleDownloadSvg}
              className="font-bold py-4"
            >
              <Printer className="w-5 h-5 mr-2" />
              Download Scalable Vector (SVG)
            </Button>
          </div>

          {/* Clickable Social Share Link */}
          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
              Shareable Direct Link (Social Media & WhatsApp)
            </h3>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={canonicalUrl}
                className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-mono text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 select-all"
              />
              <Button
                variant="secondary"
                size="md"
                onClick={handleCopyLink}
                className="text-xs shrink-0"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-1 text-emerald-400" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-1" />
                    Copy Link
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
