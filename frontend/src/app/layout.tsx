import type { Metadata } from "next";
import Script from "next/script";
import { Plus_Jakarta_Sans } from "next/font/google";
import { AppProviders } from "@/providers";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "MediCore – Tertiary Care Hospital & Research Center",
  description: "Next-generation healthcare management portal, online specialist doctor appointments, emergency 24/7 patient services, and clinical research.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`h-full antialiased ${plusJakarta.variable}`}>
      <body className="min-h-full flex flex-col font-sans">
        <Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" />
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
