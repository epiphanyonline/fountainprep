import "./globals.css";
import type { Metadata, Viewport } from "next";
import Script from "next/script";
import RouteChrome from "./components/RouteChrome";
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
      <head>
        {/* Meta Pixel */}
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '2146915996259107');
            fbq('track', 'PageView');
          `}
        </Script>

        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=2146915996259107&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
      </head>

      <body>
        <RouteChrome />
        {children}
        <Analytics />
      </body>
    </html>
  );
}