"use client";

import React, { useEffect, useRef, useState } from "react";
import { ShieldCheck } from "lucide-react";

interface TurnstileWidgetProps {
  onVerify: (token: string) => void;
  onExpire?: () => void;
  onError?: (error: any) => void;
  siteKey?: string;
  theme?: "light" | "dark" | "auto";
}

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement | string,
        options: {
          sitekey: string;
          callback: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: (err: any) => void;
          theme?: "light" | "dark" | "auto";
        }
      ) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
    onloadTurnstileCallback?: () => void;
  }
}

export function TurnstileWidget({
  onVerify,
  onExpire,
  onError,
  siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "1x00000000000000000000AA",
  theme = "auto",
}: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  useEffect(() => {
    // If running in development and using test key, auto-verify for smooth testing
    if (
      process.env.NODE_ENV !== "production" &&
      siteKey === "1x00000000000000000000AA"
    ) {
      onVerify("cf-test-token-development-bypass");
    }

    // Check if script is already present
    if (window.turnstile) {
      setIsScriptLoaded(true);
      return;
    }

    const scriptId = "cf-turnstile-script";
    let script = document.getElementById(scriptId) as HTMLScriptElement;

    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      script.onload = () => {
        setIsScriptLoaded(true);
      };
      script.onerror = () => {
        // Fallback in case of network restrictions
        if (process.env.NODE_ENV !== "production") {
          onVerify("cf-turnstile-fallback-token");
        }
      };
      document.head.appendChild(script);
    } else {
      script.addEventListener("load", () => setIsScriptLoaded(true));
    }
  }, [siteKey, onVerify]);

  useEffect(() => {
    if (!isScriptLoaded || !window.turnstile || !containerRef.current) return;

    if (widgetIdRef.current) {
      try {
        window.turnstile.remove(widgetIdRef.current);
      } catch {}
    }

    try {
      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        callback: (token: string) => {
          onVerify(token);
        },
        "expired-callback": () => {
          onExpire?.();
        },
        "error-callback": (err: any) => {
          onError?.(err);
        },
        theme,
      });
    } catch (err) {
      console.warn("Turnstile render warning:", err);
    }

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {}
      }
    };
  }, [isScriptLoaded, siteKey, onVerify, onExpire, onError, theme]);

  return (
    <div className="flex flex-col items-center justify-center my-3 min-h-[65px]">
      <div ref={containerRef} className="cf-turnstile-container" />
      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-1.5">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
        <span>Protected by Cloudflare Turnstile</span>
      </div>
    </div>
  );
}
