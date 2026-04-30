

import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { LanguageProvider } from "@/contexts/LanguageContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://wavecrafter-ai.vercel.app"),
  title: "WaveCrafter AI — Bespoke Music for Venues & Events",
  description:
    "WaveCrafter AI creates unique, bespoke music compositions for restaurants, bars, hotels, and events worldwide. Powered by artificial intelligence.",
  keywords: [
    "WaveCrafter AI",
    "custom music",
    "bespoke music",
    "AI music",
    "restaurant music",
    "hotel music",
    "brand sound",
    "sonic identity",
    "ambient music",
    "music production",
    "авторская музыка",
    "музыка для ресторанов",
    "музыка для бизнеса",
  ],
  authors: [{ name: "WaveCrafter AI" }],
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/",
  },
  verification: {
    google: "O6tHju4tqyfV3MDvBTSU_-QW_7yx043LjsO0mDGHewY",
    yandex: "bb24d9906c374f4b",
  },
  openGraph: {
    title: "WaveCrafter AI — Bespoke Music for Venues & Events",
    description:
      "We create unique sonic identities for restaurants, bars, hotels, and events. AI-powered original compositions.",
    type: "website",
    url: "https://wavecrafter-ai.vercel.app",
    siteName: "WaveCrafter AI",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "WaveCrafter AI — Bespoke Music for Venues & Events",
    description:
      "We create unique sonic identities for restaurants, bars, hotels, and events. AI-powered original compositions.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="msvalidate.01" content="817EE70A1C17482E7692E71120ECB418" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0a0a0a] text-white`}
      >
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-J9832XZP9V" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-J9832XZP9V');
          `}
        </Script>
        <LanguageProvider>
          {children}
          <Toaster />
        </LanguageProvider>
      </body>
    </html>
  );
}
