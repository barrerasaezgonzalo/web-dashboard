import type { Metadata } from "next";
import "./globals.css";
import { DataProvider } from "@/context/DataContext";
import { AuthProvider } from "@/context/AuthContext";
import { CalendarProvider } from "@/context/CalendarContext";

export const metadata: Metadata = {
  title: "Dashboard App",
  description: "Dashboard application built with Next.js and TypeScript",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <AuthProvider>
          <DataProvider>
            <CalendarProvider>{children}</CalendarProvider>
          </DataProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
