import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { MagicCursor } from "@/components/motion/MagicCursor";
import { BackToTop } from "@/components/motion/BackToTop";
import { site } from "@/config/site";

/* Titres : grotesque geometrique, dans l'esprit du logotype.
   Texte courant : Inter, neutre et tres lisible en petit corps.
   Mono : les intitules en capitales espacees de la charte. */
const sans = Inter({ subsets: ["latin"], variable: "--font-app-sans", display: "swap" });
const display = Space_Grotesk({ subsets: ["latin"], variable: "--font-app-display", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-app-mono", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} — ${site.tagline}`, template: `%s — ${site.name}` },
  description: site.description,
  openGraph: {
    type: "website",
    locale: site.locale,
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${sans.variable} ${display.variable} ${mono.variable}`}>
      <body className="flex min-h-screen flex-col">
        <MotionProvider />
        <MagicCursor />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <BackToTop />
      </body>
    </html>
  );
}
