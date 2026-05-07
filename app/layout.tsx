import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "LexiC1 — Préparation DELF C1",
  description: "Entraîneur de vocabulaire pour le DELF C1",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={inter.variable}>
      <body className="font-sans antialiased bg-pg text-ink">{children}</body>
    </html>
  );
}
