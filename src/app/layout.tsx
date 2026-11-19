import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { defaultPlatformConfig } from "@/config/platform.config";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const { event, branding } = defaultPlatformConfig;
const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const viewport: Viewport = {
  themeColor: "#0f172a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${event.title} | ${branding.platformName}`,
    template: `%s | ${branding.platformName}`,
  },
  description: event.description,
  keywords: [
    "registration",
    "summit",
    "technology",
    "community",
    "onboarding",
    "leadership",
    "whatsapp community",
  ],
  authors: [{ name: branding.organizationName }],
  creator: branding.organizationName,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    title: event.title,
    description: event.description,
    siteName: branding.platformName,
    images: [
      {
        url: "/api/qr?width=800",
        width: 800,
        height: 800,
        alt: `${event.title} Registration QR`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: event.title,
    description: event.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100 selection:bg-blue-600 selection:text-white">
        {children}

        {/* Google Analytics 4 Script (Async & Non-blocking) */}
        {gaId && (
          <>
            <Script
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            />
            <Script
              id="google-analytics"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${gaId}', {
                    page_path: window.location.pathname,
                  });
                `,
              }}
            />
          </>
        )}
      </body>
    </html>
  );
}
