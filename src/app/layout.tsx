

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
    "bar music",
    "brand sound",
    "sonic identity",
    "ambient music",
    "background music",
    "music production",
    "music for restaurants",
    "music for hotels",
    "music for cafes",
    "music for events",
    "music for weddings",
    "music for spas",
    "day-part music programming",
    "zone-specific sound design",
    "авторская музыка",
    "музыка для ресторанов",
    "музыка для отелей",
    "музыка для баров",
    "музыка для кафе",
    "музыка для бизнеса",
    "саунд-дизайн",
    "аудио-брендинг",
    "музыкальное оформление",
    "фоновая музыка",
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

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "MusicBusiness",
  name: "WaveCrafter AI",
  url: "https://wavecrafter-ai.vercel.app",
  logo: "https://wavecrafter-ai.vercel.app",
  description:
    "WaveCrafter AI creates unique, bespoke music compositions for restaurants, bars, hotels, and events worldwide. AI-powered original music production.",
  email: "grossboss@inbox.ru",
  priceRange: "$$",
  areaServed: "Worldwide",
  serviceType: [
    "Custom Music Production",
    "Restaurant Music",
    "Hotel Music",
    "Bar Music",
    "Cafe Music",
    "Event Music",
    "Wedding Music",
    "Spa Music",
    "Sonic Identity Design",
    "Audio Branding",
    "Background Music",
    "Ambient Music",
  ],
  knowsLanguage: ["English", "Russian", "French"],
  sameAs: [],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
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
