import type { Metadata } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import { cn } from "@/lib/utils";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { Toaster } from "@/components/ui/sonner";
import { GlobalNav } from "@/components/layout/GlobalNav";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MiLyfe — House of Autonomous Infrastructure",
  description:
    "MiLyfe forges autonomous businesses. Staffed by agents. Built to run without you.",
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
        "dark",
        fraunces.variable,
        inter.variable,
        jetbrainsMono.variable
      )}
    >
      <body className="bg-milyfe-bg text-milyfe-text font-inter antialiased min-h-screen">
        <AuthProvider>
          <GlobalNav />
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
