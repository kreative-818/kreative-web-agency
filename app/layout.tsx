
// Force rebuild to fix hosting connection - Oct 30, 2025

// Force all pages to be dynamic to avoid Vercel timeout issues
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "@/components/providers";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { AIChatbot } from "@/components/ai-chatbot";
import AISalesChatbot from "@/components/ai-sales-chatbot";
import ChatbotPrompt from "@/components/chatbot-prompt";
import { SchemaMarkupScript } from "@/components/schema-markup-script";
import { getOrganizationSchema, getLocalBusinessSchema } from "@/lib/schema-markup";
import { SPARedirectHandler } from "@/components/spa-redirect-handler";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://kreativeaiagency.com'),
  title: {
    default: "Kreative Intelligence | Premium AI-Powered Web Development & Automation",
    template: "%s | Kreative Intelligence",
  },
  description: "Kreative Intelligence delivers enterprise-grade websites, custom web applications, and AI automation that drives real revenue growth. 430% average ROI. Fast turnaround. Proven results.",
  keywords: [
    "AI web development",
    "intelligent automation",
    "premium web design",
    "custom web applications",
    "AI automation services",
    "enterprise web solutions",
    "digital transformation",
    "AI-powered websites",
    "business automation",
    "SaaS development",
    "AI consulting",
    "intelligent web solutions",
    "revenue growth",
    "conversion optimization",
  ],
  authors: [{ name: "Kreative Intelligence" }],
  creator: "Kreative Intelligence",
  publisher: "Kreative Intelligence",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://kreativeaiagency.com",
    siteName: "Kreative Intelligence",
    title: "Kreative Intelligence | Premium AI-Powered Web Development & Automation",
    description: "Enterprise-grade web solutions with 430% average ROI. We architect intelligent digital solutions that multiply revenue, not just look pretty.",
    images: [
      {
        url: "/logo-square.png",
        width: 1024,
        height: 1024,
        alt: "Kreative Intelligence",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kreative Intelligence | Premium AI-Powered Web Development",
    description: "Enterprise-grade web solutions with 430% average ROI. AI automation that works 24/7. Proven results.",
    images: ["/logo-square.png"],
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/apple-touch-icon.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add your verification tokens here when you set up Google Search Console, etc.
    // google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const organizationSchema = getOrganizationSchema();
  const localBusinessSchema = getLocalBusinessSchema();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <SchemaMarkupScript schema={[organizationSchema, localBusinessSchema]} />
      </head>
      <body className={inter.className}>
        <Providers>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <SPARedirectHandler />
            <Navigation />
            <main>{children}</main>
            <Footer />
            <Toaster />
            <ChatbotPrompt />
            <AISalesChatbot />
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
