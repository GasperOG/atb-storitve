import type { Metadata } from "next";
import { Sora, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["300", "400", "600", "800"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "ATB Storitve | Izposoja Avtomobilskih Dodatkov, Thule Nosilcev in Avtomehanika",
    template: "%s | ATB Storitve"
  },
  description: "ATB Storitve nudi izposojo strešnih kovčkov, kolesarskih in smučarskih nosilcev ter drugih avtomobilskih dodatkov. Profesionalna avtomehanika in servis Thule opreme v Vanča Vasi.",
  keywords: [
    "izposoja strešnih kovčkov",
    "izposoja kolesarskih nosilcev",
    "izposoja smučarskih nosilcev",
    "Thule nosilci",
    "avtomobilski dodatki",
    "avtomehanika Ljubljana",
    "servis avtomobilov",
    "izposoja avtomobilskih dodatkov",
    "strešni kovčki",
    "kolesarski nosilci",
    "Thule servis",
    "thule slovenija",
    "thule"
  ],
  authors: [{ name: "ATB Storitve" }],
  creator: "ATB Storitve",
  publisher: "ATB Storitve",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://atb-storitve.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "ATB Storitve | Izposoja Avtomobilskih Dodatkov in Avtomehanika",
    description: "Profesionalna izposoja strešnih kovčkov, kolesarskih in smučarskih nosilcev. Avtomehanika in servis Thule opreme.",
    url: "https://atb-storitve.vercel.app",
    siteName: "ATB Storitve",
    locale: "sl_SI",
    type: "website",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "ATB Storitve Logo"
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ATB Storitve | Izposoja Avtomobilskih Dodatkov",
    description: "Profesionalna izposoja strešnih kovčkov, kolesarskih in smučarskih nosilcev. Avtomehanika in servis Thule opreme.",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // google: "your-google-verification-code", // Dodaj ko bo aktiven Google Search Console
    // yandex: "your-yandex-verification-code",
    // bing: "your-bing-verification-code",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sl">
      <head>
        {/* Favicons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* Theme Color */}
        <meta name="theme-color" content="#1a56db" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        
        {/* Additional SEO */}
        <meta name="geo.region" content="SI" />
        <meta name="geo.placename" content="Ljubljana" />
        
        {/* Schema.org structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": "ATB Storitve",
              "description": "Izposoja avtomobilskih dodatkov, Thule nosilcev in avtomehanika",
              "url": "https://atb-storitve.vercel.app",
              "telephone": "+386-70-870-595",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Murska Sobota",
                "addressCountry": "SI"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": "46.6710",
                "longitude": "16.0960"
              },
              "openingHoursSpecification": [
                {
                  "@type": "OpeningHoursSpecification",
                  "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                  "opens": "08:00",
                  "closes": "17:00"
                }
              ],
              "priceRange": "€",
              "image": "https://www.atb-storitve.si/logo.png"
            })
          }}
        />
      </head>
      <body className={`${sora.variable} ${jakarta.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}

