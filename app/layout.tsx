import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Finance Arcade - Learn Finance Through Games",
  description: "Master finance concepts through interactive mini-games. Learn NPV, budgeting, and elasticity in a fun, engaging way.",
  keywords: "finance, education, games, NPV, budgeting, elasticity, learning",
  authors: [{ name: "Finance Arcade Team" }],
  creator: "Finance Arcade",
  publisher: "Finance Arcade",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://my-first-black.vercel.app",
    siteName: "Finance Arcade",
    title: "Finance Arcade - Learn Finance Through Games",
    description: "Master finance concepts through interactive mini-games. Learn NPV, budgeting, and elasticity in a fun, engaging way.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Finance Arcade - Interactive Finance Learning"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Finance Arcade - Learn Finance Through Games",
    description: "Master finance concepts through interactive mini-games. Learn NPV, budgeting, and elasticity in a fun, engaging way.",
    images: ["/og-image.png"]
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Finance Arcade"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#2563eb" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className={inter.className}>
        <div id="root">{children}</div>
      </body>
    </html>
  );
}
