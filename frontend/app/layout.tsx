import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Sidebar } from "@/components/layout/sidebar";
import { Navbar } from "@/components/layout/navbar";
import { BottomNav } from "@/components/layout/bottom-nav";
import { MiniPlayer } from "@/components/features/mini-player";
import { Toaster } from "@/components/ui/sonner";
import { PageTransition } from "@/components/layout/page-transition";
import { AudioEngineProvider } from "@/components/features/audio-engine-provider";
import { AuthGuard } from "@/components/features/auth-guard";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pulse — Music Streaming",
  description: "A premium music streaming platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
<body className="min-h-full flex flex-col">
        <Providers>
          <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex flex-1 flex-col min-w-0">
              <Navbar />
              <main className="flex-1 pb-20 md:pb-0">
                <PageTransition>
                  <AuthGuard>{children}</AuthGuard>
                </PageTransition>
              </main>
            </div>
          </div>
        <AudioEngineProvider />
          <MiniPlayer />
          <BottomNav />
          <Toaster theme="dark" position="bottom-right" />
        </Providers>
      </body>
    </html>
  );
}