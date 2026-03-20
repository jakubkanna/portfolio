import type { Metadata } from "next";
import LegalContent from "./LegalContent";

export const metadata: Metadata = {
  title: "Privacy Policy and Terms / Polityka prywatności i regulamin",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function LegalPage() {
  return <LegalContent />;
}
