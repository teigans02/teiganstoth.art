import type { Metadata, Viewport } from "next";
import { Instrument_Sans, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { siteUrl, socialPreviewImage } from "@/lib/site-metadata";

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
  display: "swap",
});

const instrument = Instrument_Serif({
  variable: "--font-instrument",
  weight: "400",
  style: "normal",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Teigan Stothart",
  description: "Teigan Stothart is a London-based marketing strategist. Her experience spans DTC marketing, paid media, and consumer research.",
  openGraph: {
    siteName: "Teigan Stothart",
    type: "website",
    images: [socialPreviewImage],
  },
  twitter: {
    card: "summary_large_image",
    images: [socialPreviewImage],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  interactiveWidget: "resizes-content",
  colorScheme: "light",
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`light ${instrumentSans.variable} ${instrument.variable}`}
    >
      <body className="antialiased text-gray-900">
        {children}
      </body>
    </html>
  );
}
