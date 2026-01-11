import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { headers } from "next/headers";
import "./globals.css";
import Logo from "./components/Logo";
import Menu from "./components/Menu";
import PageName from "./components/PageName";
import en from "./locales/en.json";
import pl from "./locales/pl.json";

const siteUrl = "https://studio.jakubkanna.com";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const translations = { en, pl } as const;
type Locale = keyof typeof translations;

function resolveLocale(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) return "en";
  const candidates = acceptLanguage.split(",");
  for (const entry of candidates) {
    const normalized = entry.trim().split("-")[0]?.toLowerCase();
    if (normalized === "pl") return "pl";
    if (normalized === "en") return "en";
  }
  return "en";
}

export async function generateMetadata(): Promise<Metadata> {
  const acceptLanguage = (await headers()).get("accept-language");
  const locale = resolveLocale(acceptLanguage);
  const t = translations[locale] ?? translations.en;

  return {
    metadataBase: new URL(siteUrl),
    title: t.tagline,
    description: t.metaDescription,
    alternates: {
      canonical: siteUrl,
    },
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
        <link rel="icon" href="/uv-map-jk.png" />
        <Script
          src="https://ajax.googleapis.com/ajax/libs/model-viewer/4.0.0/model-viewer.min.js"
          type="module"
          crossOrigin="anonymous"
          strategy="beforeInteractive"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-black text-foreground antialiased`}
      >
        {" "}
        <header>
          <Logo />
        </header>
        <PageName />
        {children}
        <footer>
          <Menu />
        </footer>
      </body>
    </html>
  );
}
