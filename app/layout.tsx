import type { Metadata } from "next";
import { Geist_Mono, Google_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Logo from "./components/Logo";
import Menu from "./components/Menu";
import PageName from "./components/PageName";
import PoweredByBallpark from "./components/PoweredByBallpark";
import en from "./locales/en.json";
import pl from "./locales/pl.json";

const siteUrl = "https://studio.jakubkanna.com";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const googleSans = Google_Sans({
  variable: "--font-google-sans",
  subsets: ["latin"],
});

const translations = { en, pl } as const;
type Locale = keyof typeof translations;

const DEFAULT_LOCALE: Locale = "en";

export function generateMetadata(): Metadata {
  const t = translations[DEFAULT_LOCALE] ?? translations.en;

  return {
    metadataBase: new URL(siteUrl),
    title: t.tagline,
    description: t.metaDescription,
    alternates: {
      canonical: siteUrl,
    },
    icons: {
      icon: [
        { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
        { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      ],
      apple: "/apple-touch-icon.png",
    },
    manifest: "/site.webmanifest",
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon-32x32.png" />
        <Script
          src="https://ajax.googleapis.com/ajax/libs/model-viewer/4.0.0/model-viewer.min.js"
          type="module"
          crossOrigin="anonymous"
          strategy="beforeInteractive"
        />
      </head>
      <body
        className={`${googleSans.variable} ${geistMono.variable} bg-black text-foreground antialiased`}
      >
        {" "}
        <header>
          <Logo />
        </header>
        <PageName />
        {children}
        <PoweredByBallpark />
        <footer className="fixed bottom-0 left-0 z-30 w-full bg-transparent">
          <Menu />
        </footer>
      </body>
    </html>
  );
}
