import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { cn } from "@holm/ui";
import { ThemeProvider, ThemeToggle } from "@holm/ui/theme";
import { Toaster } from "@holm/ui/toast";

import { ReactQueryProvider } from "~/query/react";

import "~/app/styles.css";

import PlausibleProvider from "next-plausible";

import { OfflineMessage } from "./_components/OfflineMessage";

export const metadata: Metadata = {
  title: "Ólafur Reddit Hólm Eyþórsson",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <PlausibleProvider domain="reddit-clone-nextjs-six.vercel.app" />
      </head>
      <body
        className={cn(
          "bg-background text-foreground min-h-screen font-sans antialiased",
          geistSans.variable,
          geistMono.variable,
        )}
      >
        <ThemeProvider>
          <ReactQueryProvider>
            <main className="container h-screen py-16">
              <div className="flex flex-col items-center justify-center gap-4">
                <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
                  Ólafur <span className="text-primary">Reddit</span> Hólm
                  Eyþórsson
                </h1>
                <OfflineMessage />
                <div className="w-full max-w-2xl">{props.children}</div>
              </div>
            </main>
          </ReactQueryProvider>
          <div className="absolute right-4 bottom-4">
            <ThemeToggle />
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
