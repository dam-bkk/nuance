import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-serif",
  axes: ["opsz"],
});

export const metadata: Metadata = {
  title: "LexiC1 — Préparation DELF C1",
  description: "Entraîneur de vocabulaire pour le DELF C1",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${inter.variable} ${fraunces.variable}`}>
      <body className="font-sans antialiased bg-cream text-navy">{children}</body>
    </html>
  );
}
