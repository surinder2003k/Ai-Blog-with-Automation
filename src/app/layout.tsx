import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Blog - Modern Full-stack Personal Blog",
  description: "A modern, AI-powered personal blog built with Next.js 15, Clerk, and Gemini AI.",
};

import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning generic-font-families="sans-serif">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background text-foreground flex flex-col`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
            <Toaster richColors position="top-center" />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
