import type { Metadata } from "next";
import "./globals.css";
import { DataProvider } from "@/context/DataContext";
import { UserProvider } from "@/context/UserContext";

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
        <UserProvider>
          <DataProvider>{children}</DataProvider>
        </UserProvider>
      </body>
    </html>
  );
}
