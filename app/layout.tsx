import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Nuance — Préparation DELF B2 · DALF C1",
  description: "Préparation au DELF B2 et DALF C1 : vocabulaire, grammaire, compréhension.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={nunito.variable}>
      <head>
        {/* Prevent flash of wrong theme */}
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{if(localStorage.getItem('nuance-theme')==='dark')document.documentElement.classList.add('dark')}catch(e){}})()` }} />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
