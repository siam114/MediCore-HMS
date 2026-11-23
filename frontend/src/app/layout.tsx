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
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png" },
      { url: "/medicore-logo.png", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    shortcut: "/medicore-logo.png",
    apple: "/medicore-logo.png",
  },
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
