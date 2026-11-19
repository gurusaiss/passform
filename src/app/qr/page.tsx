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
  FileText,
  Compass,
} from "lucide-react";

export default function QrPosterPage() {
  const { branding, event } = defaultPlatformConfig;
  const baseUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  // Target toggle: direct to form or full landing page
  const [targetType, setTargetType] = useState<"direct" | "landing">("direct");
  const targetUrl = targetType === "direct" ? `${baseUrl}/register` : baseUrl;

  const [copied, setCopied] = useState(false);
  const [qrSize, setQrSize] = useState<number>(512);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(targetUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPng = () => {
    window.location.href = `/api/qr?url=${encodeURIComponent(
      targetUrl
    )}&width=${qrSize}&download=true`;
  };

  const handleDownloadSvg = () => {
    window.location.href = `/api/qr?url=${encodeURIComponent(
      targetUrl
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
              Generate and download crisp, high-resolution vector and raster QR codes for physical posters, standees, and social media flyers.
            </p>
          </div>

          {/* QR Target Destination Selector */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-2 p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl max-w-md mx-auto">
            <button
              type="button"
              onClick={() => setTargetType("direct")}
              className={`flex-1 w-full sm:w-auto flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${
                targetType === "direct"
                  ? "bg-white text-blue-700 shadow-sm dark:bg-slate-700 dark:text-white"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Direct Form (Posters)</span>
            </button>

            <button
              type="button"
              onClick={() => setTargetType("landing")}
              className={`flex-1 w-full sm:w-auto flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${
                targetType === "landing"
                  ? "bg-white text-blue-700 shadow-sm dark:bg-slate-700 dark:text-white"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Full Landing Page</span>
            </button>
          </div>

          <p className="text-center text-[11px] text-slate-500 mt-2">
            {targetType === "direct"
              ? "⭐ Recommended for physical posters: camera scan immediately displays the registration form without scrolling."
              : "Best for social posts and ads where visitors want to read the full agenda and FAQs first."}
          </p>

          {/* QR Display Card */}
          <div className="my-6 flex flex-col items-center justify-center p-8 rounded-2xl border border-slate-200/80 bg-slate-50 dark:border-slate-800 dark:bg-slate-950/50">
            <div className="p-4 rounded-2xl bg-white shadow-md border border-slate-200">
              <img
                src={`/api/qr?url=${encodeURIComponent(targetUrl)}&width=350`}
                alt="Registration QR Code"
                className="w-56 h-56 sm:w-64 sm:h-64 object-contain"
              />
            </div>

            <div className="mt-4 text-center">
              <p className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-300">
                {targetUrl}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {targetType === "direct"
                  ? "Opens the registration form directly on the user's mobile screen"
                  : "Opens the full overview landing page"}
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
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Shareable Direct Link
              </h3>
              <a
                href={targetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:underline flex items-center gap-1 font-semibold"
              >
                <span>Test link</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={targetUrl}
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
