import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://apps.pkdiv.com'),
  title: 'Simple Apps | Minimal Web Tools',
  description: 'A collection of beautiful, minimal web tools — tap counter, pomodoro timer, CSV chart generator, and timezone converter. Fast, free, and works offline.',
  keywords: ['web tools', 'simple apps', 'utility apps', 'tap counter', 'pomodoro timer', 'csv chart', 'timezone converter'],
  openGraph: {
    title: 'Simple Apps | Minimal Web Tools',
    description: 'A collection of beautiful, minimal web tools. Fast, free, and works offline.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Simple Apps | Minimal Web Tools',
    description: 'A collection of beautiful, minimal web tools. Fast, free, and works offline.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <body>
        {children}
      </body>
    </html>
  );
}
