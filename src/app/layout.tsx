import type { Metadata } from "next";
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
  ],
  authors: [{ name: "WaveCrafter AI" }],
  openGraph: {
    title: "WaveCrafter AI — Bespoke Music for Venues & Events",
    description:
      "We create unique sonic identities for restaurants, bars, hotels, and events. AI-powered original compositions.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0a0a0a] text-white`}
      >
        <LanguageProvider>
          {children}
          <Toaster />
        </LanguageProvider>
      </body>
    </html>
  );
}
