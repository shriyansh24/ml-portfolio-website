import { Geist, Geist_Mono } from "next/font/google";
import { generateMetadata } from "@/components/SEOHead";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-background text-foreground`}
      >
        {children}
      </body>
    </html>
  );
}
