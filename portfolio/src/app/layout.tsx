import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const styrene = localFont({
  src: "../../public/fonts/StyreneA-Regular.otf",
  variable: "--font-styrene",
  display: "swap",
  adjustFontFallback: "Arial",
});

const instrument = localFont({
  src: "../../public/fonts/Instrument-Serif.ttf",
  variable: "--font-instrument",
  display: "swap",
  adjustFontFallback: "Times New Roman",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://teiganstoth.art"),
  title: "Teigan Stothart",
  description: "Teigan Stothart is a London-based marketing strategist using consumer psychology and research to shape brands and campaigns. Her work spans DTC brands, paid media, and consumer research.",
  openGraph: {
    siteName: "Teigan Stothart",
    type: "website",
    images: [{ url: "/images/mighty/hero.jpg", width: 2000, height: 1500, alt: "Marketing and brand work for Mighty" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/images/mighty/hero.jpg"],
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
      className={`light ${geistSans.variable} ${geistMono.variable} ${styrene.variable} ${instrument.variable}`}
    >
      <body className="antialiased text-gray-900">
        {children}
      </body>
    </html>
  );
}
