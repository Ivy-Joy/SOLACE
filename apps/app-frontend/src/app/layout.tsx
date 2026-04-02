import type { Metadata } from "next";
import { Playfair_Display, Geist } from "next/font/google"; 
import "./globals.css";

// Premium Serif for Headlines
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  style: ["italic", "normal"],
});

// Modern Sans for Body & Buttons
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "S.O.L.A.C.E | Serving Our Lord And Christ Everyday",
  description: "Youth Ministry of Good Shepherd AGC",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html 
      lang="en" 
      className={`${playfair.variable} ${geistSans.variable}`}
      // This attribute is the fix. It ignores attribute mismatches 
      // caused by browser extensions or dark mode toggles.
      suppressHydrationWarning
    >
      <body className="font-sans antialiased selection:bg-gold selection:text-black">
        {children}
      </body>
    </html>
  );
}