import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ThemeProvider } from "@/components/theme-provider";
import { siteConfig } from "@/lib/site";

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
    default: siteConfig.name,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
};

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
        {/* 深红锦缎背景:立体布褶 + 流动缎光 + 极简金线(不参与交互) */}
        <svg aria-hidden="true" focusable="false" className="absolute h-0 w-0">
          <defs>
            <filter id="silk-fold" x="-25%" y="-25%" width="150%" height="150%">
              <feTurbulence type="fractalNoise" baseFrequency="0.005 0.011" numOctaves="3" seed="4" result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="70" xChannelSelector="R" yChannelSelector="G" />
            </filter>
          </defs>
        </svg>
        <div className="silk-bg" aria-hidden="true">
          <div className="silk-fold-a" />
          <div className="silk-fold-b" />
          <div className="silk-sheen" />
          <div className="silk-vignette" />
          <svg className="silk-gold" viewBox="0 0 1440 900" preserveAspectRatio="none">
            <path vectorEffect="non-scaling-stroke" d="M-80,720 C 280,620 500,760 800,660 C 1100,560 1300,610 1520,530" />
            <path vectorEffect="non-scaling-stroke" d="M-80,320 C 260,240 540,360 800,300 C 1060,240 1260,280 1520,200" />
            <path vectorEffect="non-scaling-stroke" d="M220,-80 C 280,180 240,480 360,740 C 400,840 440,920 480,980" />
            <path vectorEffect="non-scaling-stroke" d="M1180,-80 C 1120,180 1160,460 1060,720 C 1020,820 980,900 940,980" />
          </svg>
        </div>
        <ThemeProvider>
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
