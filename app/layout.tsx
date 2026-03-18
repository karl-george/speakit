import type { Metadata } from "next";
import { IBM_Plex_Serif, Mona_Sans } from "next/font/google";

import "./globals.css";
import Navbar from "@/components/Navbar";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";

const ibmPlexSerif = IBM_Plex_Serif({
  variable: "--font-ibm-plex-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const monaSans = Mona_Sans({
  variable: "--font-mona-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SpeakIt",
  description: "Transform your books into AI conversations.",
};

/**
 * Root layout component that provides the HTML skeleton, applies global fonts and styles, and renders the site navbar.
 *
 * The top-level HTML element has lang="en" and the body includes font CSS variables and utility classes. The Navbar is rendered once and the provided `children` are placed inside the body.
 *
 * @param children - The page content to render inside the layout's body
 * @returns The root HTML structure (`<html>` containing `<body>`) with the Navbar and the given children
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${ibmPlexSerif.variable} ${monaSans.variable} relative font-sans antialiased`}
        >
          <Navbar />
          {children}
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
