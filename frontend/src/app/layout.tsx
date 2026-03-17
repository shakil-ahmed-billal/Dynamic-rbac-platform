import type { Metadata } from "next";
import { Onest, Inter } from "next/font/google";
import "./globals.css";

const onest = Onest({
  variable: "--font-onest",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dynamic RBAC Platform",
  description: "Secure and Dynamic Role-Based Access Control System",
};

import { Toaster } from "react-hot-toast";
import QueryProvider from "@/providers/QueryProvider";
import { AuthProvider } from "@/providers/AuthProvider";

import { TooltipProvider } from "@/components/ui/tooltip";
import { DynamicTitle } from "@/components/layout/DynamicTitle";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${onest.variable} ${inter.variable} antialiased`}
        suppressHydrationWarning
      >
        <QueryProvider>
          <AuthProvider>
            <TooltipProvider>
              <DynamicTitle />
              {children}
              <Toaster position="top-center" />
            </TooltipProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
