import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ThemeProvider } from "@/components/theme-provider";
import { ParticleField } from "@/components/particle-field";
import { VisitTracker } from "@/components/visit-tracker";
import { getSiteConfig } from "@/lib/site-config";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteConfig();
  return {
    title: {
      default: site.name,
      template: `%s · ${site.name}`,
    },
    description: site.description,
    metadataBase: new URL(site.url),
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="zh-CN"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col text-foreground">
        <ThemeProvider>
          {/* 粒子网络背景(浅灰点不规则运动 + 近距连线) */}
          <ParticleField />
          <VisitTracker />
          <Header />
          <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-8">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
