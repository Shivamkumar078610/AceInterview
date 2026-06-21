import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { Providers } from "@/components/providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "AceInterview AI — AI-Powered Interview Preparation Platform",
    template: "%s | AceInterview AI",
  },
  description:
    "Practice realistic interviews, receive personalized AI feedback, improve your communication and technical skills, and land your dream job with confidence.",
  keywords: [
    "AI interview preparation",
    "mock interview",
    "technical interview practice",
    "behavioral interview",
    "coding interview",
    "HR interview",
    "job interview practice",
    "AI career coach",
    "resume analyzer",
    "system design interview",
  ],
  authors: [{ name: "AceInterview AI" }],
  creator: "AceInterview AI",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL || "https://aceinterview.ai",
    title: "AceInterview AI — Ace Your Dream Job With AI",
    description:
      "Practice realistic AI-powered interviews and land your dream job with confidence.",
    siteName: "AceInterview AI",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AceInterview AI",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AceInterview AI — Ace Your Dream Job With AI",
    description: "Practice realistic AI-powered interviews and land your dream job.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#050816",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className="font-sans bg-background text-foreground antialiased">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <Providers>
          <main id="main-content">{children}</main>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "rgba(11, 17, 32, 0.95)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#fff",
                backdropFilter: "blur(16px)",
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
