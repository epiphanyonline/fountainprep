import "./globals.css";
import type { Metadata, Viewport } from "next";
import Navbar from "./components/Navbar";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.fountainprep.com"),

  title: {
    default: "Fountain Prep",
    template: "%s | Fountain Prep",
  },

  description:
    "Premium online tutoring with structured curriculum pathways and progress tracking.",

  applicationName: "Fountain Prep",
  manifest: "/manifest.json",

  keywords: [
    "online tutoring",
    "private tutoring",
    "maths tutor",
    "english tutor",
    "science tutor",
    "yoruba lessons",
    "children learning",
    "home education",
    "fountain prep",
  ],

  authors: [{ name: "Fountain Prep" }],
  creator: "Fountain Prep",

  appleWebApp: {
    capable: true,
    title: "Fountain Prep",
    statusBarStyle: "default",
  },

  openGraph: {
    title: "Fountain Prep",
    description:
      "Premium online tutoring with structured curriculum pathways and progress tracking.",
    siteName: "Fountain Prep",
    type: "website",
    locale: "en_GB",
  },

  twitter: {
    card: "summary_large_image",
    title: "Fountain Prep",
    description:
      "Premium online tutoring with structured curriculum pathways and progress tracking.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#7c3aed",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
        <Analytics />
      </body>
    </html>
  );
}