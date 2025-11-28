import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Logo from "./components/Logo";
import Menu from "./components/Menu";
import PageName from "./components/PageName";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Jakub Kanna — Portfolio",
  description:
    "Scroll-driven image sequence and animated text portfolio built with Next.js.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
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
