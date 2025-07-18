import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { generateMetadata } from "@/components/SEOHead";
import { Providers } from "./providers";
import { DatabaseInitializer } from "./db-initializer";
import { initPerformanceMonitoring, preloadCriticalResources } from "@/lib/performanceUtils";
import "./globals.css";

// Optimize font loading with display: swap
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

// Generate metadata using our SEOHead component
export const metadata = generateMetadata({
  title: "ML Portfolio | Machine Learning Engineer",
  description: "Portfolio website showcasing machine learning projects, blog posts, and research papers focused on LLMs and AI",
  keywords: ["machine learning", "artificial intelligence", "LLM", "portfolio", "transformer", "deep learning"],
  ogImage: "/og-image.jpg",
  ogUrl: "https://ml-portfolio.example.com",
  ogType: "website",
  author: "ML Engineer",
  twitterHandle: "@mlportfolio",
  // Enhanced schema properties
  schemaType: "WebSite",
  organization: {
    name: "ML Portfolio",
    logo: "/images/logo.png",
    url: "https://ml-portfolio.example.com",
  },
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Initialize database during server-side rendering
  await DatabaseInitializer();
  
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Preload critical assets */}
        <link rel="preload" href="/images/logo.png" as="image" />
        
        {/* DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-background text-foreground`}
      >
        <Providers>{children}</Providers>
        
        {/* Initialize performance monitoring */}
        <Script id="performance-monitoring" strategy="afterInteractive">
          {`
            (function() {
              ${initPerformanceMonitoring.toString()}
              ${preloadCriticalResources.toString()}
              
              // Initialize performance monitoring
              initPerformanceMonitoring();
              // Preload critical resources
              preloadCriticalResources();
            })();
          `}
        </Script>
        
        {/* Google Analytics */}
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
