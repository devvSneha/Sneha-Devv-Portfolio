import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { site } from "@/data/portfolio";
import { THEME_BG, themeInitScript } from "@/lib/config";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-inter" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"], display: "swap", variable: "--font-jetbrains" });
/** Distinctive display font used just for the hero name. */
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], weight: ["600", "700"], display: "swap", variable: "--font-space-grotesk" });

const title = `${site.fullName} — ${site.role}`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: title, template: `%s · ${site.name}` },
  description: site.description,
  keywords: site.keywords,
  authors: [{ name: site.fullName, url: site.url }],
  creator: site.fullName,
  alternates: { canonical: "/" },
  openGraph: { type: "website", url: site.url, siteName: site.fullName, title, description: site.description, locale: "en_US" },
  twitter: { card: "summary_large_image", title, description: site.description },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
};

export const viewport: Viewport = {
  themeColor: THEME_BG.dark,
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme="dark" className={`${inter.variable} ${jetbrains.variable} ${spaceGrotesk.variable}`} suppressHydrationWarning>
      <head>
        {/* Applies the saved light/dark theme before first paint (no flash). */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="relative min-h-dvh overflow-x-hidden">
        <div className="page-glow" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
