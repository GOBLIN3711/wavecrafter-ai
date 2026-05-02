
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
        <link rel="icon" type="image/png" sizes="32x32" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAIAAAD8GO2jAAAFHUlEQVR4nHVWTahkxRk956u6/fr9ODxxRpiZaJ5hFBRnDDiQhZsEDe5cxYWbZJNVQDAwGyFxo3sXIgi6FUUU9wHBnSaLgMkiZOIfYeaNZpz326/7/lTVyaJu3b49MxbN7bp1q873d+pU8dy5c+ib8pM0QADLyLjlTxq/SiAh5UGWtZBE0gMQ81wjuTrvzpZKh8USSaD8FYRslSQ9WKZomKcRyrhliMHZlWik7HaZyn6tJymA4BKt+DSszLgAScaYzDiyLQEQehiAxRYAgtZHQnC0SgJAqUcfzNR1N5m4/hM0zAR7KDD71/8E2Uoi1JsdEtqbJr2zo1nz3K8fefeN51ISS8h5KktZVxgAIBcZpVgcrI0rbSAocFK5P/7+8vn718yWKZY0QiuDeb1AwFBcRU8nDq4TwxMhxO1T01ObbvMePnbh3v2jdlLZMsqCAEJEn24Cgg1mh1m3UWf4KiiG1jG+/vLPLz586sYPTU5+djmznsu8AiSMSy/66LIF46pvNLOUELsFw8mjj21+8vbll14433Zqg5yR7B2VxIHueXsN0EtLo1rkNQJIhCBL9e7u4fsffH199/i1Kw9++OrO9paru7T0xwxDSkCStpIfobev5aCZ5U6IQmr/89Xeb//0xTN/+Mfvrvz78R331otnVPa3JEhc1rREQHKgTZ+/Em8mSV4ZpXpen1pPp7cnJD/69OD5P1978qf2q4vTWS0z0Cxv28Fn9CzSCLowelVbQKPEetFOLGWb505Xn19t/vLX+eUHfQhiEYoxTfoUFZKucCYnZ8wuCfWimVjwjgKU4Jx9eb1r5qJZD5tzoaXy5CLfRTiH/BSTgFA3oXJyZrlYznB2jX/7ulvzBZSk5Qwrq4VHlvMeFRg0c9RImBHUogkVWHnGhJMWv/yZ//4gffbfuDU1JQCiCtFBSAT9oJOFW7gD2touhICY0DbRxMqhi1rz/GY/ffFdmPhSxSFLRYGVizzazMsCgHTOYtT+wcnWhn/g/ObG1B3PglOsHFOSd7o5V5dYZe73u3eEACCfByjmi6QDgDM2Tbhna/LKlaefferMdnW4++1ud3hrMaunE2JOABMDaD3NRvFnscvIfok+2tMkY0wbG9V7bz5/6RdncfNGd9z+5DRnCXvfdZVDPoYTRIi8La/LMxmAz1y8LfvO8eCou/LCxUuX/OzqPxlOmpPD+d5hvT+PJ2GS82pmWoEuoWQd7bnjB5e5MlNV5Z7YUbh2td47jnXdzOb1Qb04asNJzBePH1PechT0gL6veLl8DNHFhP9duzU7v7h1c6EmtCft4ii6Jt7YT9cPkydCElciUK9hUh7ury2KCUDKNVIxkEDq40/3nrqvXRx39TyGRaoC6oh3/h6O6rRRMYW7uT7ez9nGzkM7o1vKUqjNOG/17AX3mwuchlh3+GqGj7/Fv/awOWGSOIbFcLtYRtBj7jy0g5Esm5mRRjhn3lsTdXrDzm6xk/uhNWc29ehi6kLqQmpDCjHFqJiUklJK+anSAPhMB+edN++dOW/eW+Ws8m66ZlvTan292tqYnNlev397fXM6qdtwcLy4dVjvH9dH825ed4smNF3qQgxdCjGFmHKLMaaUfIxRUkopWuxyKDkOIw3O6Myc0RyzbEhKSWnwWopJSopJSb374yB8jDHGOByV4zvAqC7jKnHI80htpaJA+UrWn1SQjzEOteWdwne3fqH17W/DdSi/5xcvSUpjV/MpdkcoP9q0EoiWHRLA/wH5CwNssqM3owAAAABJRU5ErkJggg==" />
        <link rel="apple-touch-icon" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAIAAAD8GO2jAAAFHUlEQVR4nHVWTahkxRk956u6/fr9ODxxRpiZaJ5hFBRnDDiQhZsEDe5cxYWbZJNVQDAwGyFxo3sXIgi6FUUU9wHBnSaLgMkiZOIfYeaNZpz326/7/lTVyaJu3b49MxbN7bp1q873d+pU8dy5c+ib8pM0QADLyLjlTxq/SiAh5UGWtZBE0gMQ81wjuTrvzpZKh8USSaD8FYRslSQ9WKZomKcRyrhliMHZlWik7HaZyn6tJymA4BKt+DSszLgAScaYzDiyLQEQehiAxRYAgtZHQnC0SgJAqUcfzNR1N5m4/hM0zAR7KDD71/8E2Uoi1JsdEtqbJr2zo1nz3K8fefeN51ISS8h5KktZVxgAIBcZpVgcrI0rbSAocFK5P/7+8vn718yWKZY0QiuDeb1AwFBcRU8nDq4TwxMhxO1T01ObbvMePnbh3v2jdlLZMsqCAEJEn24Cgg1mh1m3UWf4KiiG1jG+/vLPLz586sYPTU5+djmznsu8AiSMSy/66LIF46pvNLOUELsFw8mjj21+8vbll14433Zqg5yR7B2VxIHueXsN0EtLo1rkNQJIhCBL9e7u4fsffH199/i1Kw9++OrO9paru7T0xwxDSkCStpIfobev5aCZ5U6IQmr/89Xeb//0xTN/+Mfvrvz78R331otnVPa3JEhc1rREQHKgTZ+/Em8mSV4ZpXpen1pPp7cnJD/69OD5P1978qf2q4vTWS0z0Cxv28Fn9CzSCLowelVbQKPEetFOLGWb505Xn19t/vLX+eUHfQhiEYoxTfoUFZKucCYnZ8wuCfWimVjwjgKU4Jx9eb1r5qJZD5tzoaXy5CLfRTiH/BSTgFA3oXJyZrlYznB2jX/7ulvzBZSk5Qwrq4VHlvMeFRg0c9RImBHUogkVWHnGhJMWv/yZ//4gffbfuDU1JQCiCtFBSAT9oJOFW7gD2touhICY0DbRxMqhi1rz/GY/ffFdmPhSxSFLRYGVizzazMsCgHTOYtT+wcnWhn/g/ObG1B3PglOsHFOSd7o5V5dYZe73u3eEACCfByjmi6QDgDM2Tbhna/LKlaefferMdnW4++1ud3hrMaunE2JOABMDaD3NRvFnscvIfok+2tMkY0wbG9V7bz5/6RdncfNGd9z+5DRnCXvfdZVDPoYTRIi8La/LMxmAz1y8LfvO8eCou/LCxUuX/OzqPxlOmpPD+d5hvT+PJ2GS82pmWoEuoWQd7bnjB5e5MlNV5Z7YUbh2td47jnXdzOb1Qb04asNJzBePH1PechT0gL6veLl8DNHFhP9duzU7v7h1c6EmtCft4ii6Jt7YT9cPkydCElciUK9hUh7ury2KCUDKNVIxkEDq40/3nrqvXRx39TyGRaoC6oh3/h6O6rRRMYW7uT7ez9nGzkM7o1vKUqjNOG/17AX3mwuchlh3+GqGj7/Fv/awOWGSOIbFcLtYRtBj7jy0g5Esm5mRRjhn3lsTdXrDzm6xk/uhNWc29ehi6kLqQmpDCjHFqJiUklJK+anSAPhMB+edN++dOW/eW+Ws8m66ZlvTan292tqYnNlev397fXM6qdtwcLy4dVjvH9dH825ed4smNF3qQgxdCjGFmHKLMaaUfIxRUkopWuxyKDkOIw3O6Myc0RyzbEhKSWnwWopJSopJSb374yB8jDHGOByV4zvAqC7jKnHI80htpaJA+UrWn1SQjzEOteWdwne3fqH17W/DdSi/5xcvSUpjV/MpdkcoP9q0EoiWHRLA/wH5CwNssqM3owAAAABJRU5ErkJggg==" />
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
