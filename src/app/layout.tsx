import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Serif } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import QueryProvider from "./query-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import Sidebar from "@/components/layout/sidebar";

const notoSerifHeading = Noto_Serif({
  subsets: ["latin"],
  variable: "--font-heading",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ClaudeGPT",
  description: "Your personal AI assistant",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        notoSerifHeading.variable,
      )}
    >
      <QueryProvider>
        <TooltipProvider>
          <body className="flex h-screen overflow-hidden">
            <Sidebar />
            <main className="flex-1">{children}</main>
          </body>
        </TooltipProvider>
      </QueryProvider>
    </html>
  );
}
