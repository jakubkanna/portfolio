import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Logo from "./components/Logo";
import Menu from "./components/Menu";
import PageName from "./components/PageName";

const siteUrl = "https://studio.jakubkanna.com";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "STUDIO JKN 🌸",
  description:
    "Creative studio founded by Jakub Kanna. Specializing in art and technology. Since 2018.",
  alternates: {
    canonical: siteUrl,
  },
};

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
      {`<!-- DESIGNED AND DEVELOPED BY JAKUB KANNA -->`}
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
