import type { Metadata, Viewport } from "next";
import packageJson from "../package.json";
import "./globals.css";
import {
  repositoryUrl,
  siteDescription,
  siteName,
  siteTitle,
  siteUrl,
} from "./site";

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: siteTitle,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  applicationName: siteName,
  authors: [{ name: "André Nordström", url: "https://github.com/andreedd" }],
  creator: "André Nordström",
  publisher: "André Nordström",
  category: "outdoors",
  keywords: [
    "backpacking gear list",
    "hiking gear planner",
    "pack weight calculator",
    "ultralight backpacking",
    "base weight",
    "gear weight tracker",
  ],
  alternates: {
    canonical: "/",
  },
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName,
    title: siteTitle,
    description: siteDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: siteName,
  },
  formatDetection: {
    address: false,
    email: false,
    telephone: false,
  },
};

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#2e5d44",
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "@id": new URL("/#app", siteUrl).toString(),
  name: siteName,
  url: siteUrl.toString(),
  description: siteDescription,
  applicationCategory: "LifestyleApplication",
  operatingSystem: "Any",
  browserRequirements: "Requires JavaScript and a modern web browser.",
  softwareVersion: packageJson.version,
  isAccessibleForFree: true,
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Local-first gear list storage",
    "Pack weight breakdowns",
    "CSV import and export",
    "Shareable pack-list images",
  ],
  author: {
    "@type": "Person",
    name: "André Nordström",
    url: "https://github.com/andreedd",
  },
  codeRepository: repositoryUrl,
  license: "https://opensource.org/license/mit",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
          }}
          type="application/ld+json"
        />
        {children}
      </body>
    </html>
  );
}
