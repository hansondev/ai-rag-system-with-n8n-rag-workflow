import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "AI Chat Based RAG Document Upload & Query App",
    template: "%s | AI Chat Based RAG Document Upload & Query App",
  },
  description:
    "This is the Agentic RAG System Chat App With Uploading Own Documents and Chat With Your Documents Like ChatGPT",
  keywords: [
    "Next.js",
    "React",
    "TypeScript",
    "AI",
    "OpenRouter",
    "RAG",
    "Authentication",
    "PostgreSQL",
  ],
  authors: [{ name: "Hanson Dev" }],
  creator: "Hanson Dev",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "AI Chat Based RAG Document Upload & Query App",
    title: "AI Chat Based RAG Document Upload & Query App",
    description:
      "This is the Agentic RAG System Chat App With Uploading Own Documents and Chat With Your Documents Like ChatGPT",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Chat Based RAG Document Upload & Query App",
    description:
      "This is the Agentic RAG System Chat App With Uploading Own Documents and Chat With Your Documents Like ChatGPT",
  },
  robots: {
    index: true,
    follow: true,
  },
};

// JSON-LD structured data for SEO
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "AI Chat Based RAG Document Upload & Query App",
  description:
    "This is the Agentic RAG System Chat App With Uploading Own Documents and Chat With Your Documents Like ChatGPT",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  author: {
    "@type": "Person",
    name: "Hanson Dev",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SiteHeader />
          <main id="main-content" className="flex-1">{children}</main>
          <SiteFooter />
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
