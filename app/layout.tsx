import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  debug: true,
  enabled: true,
  environment: "development",
  initialScope: {
    tags: { test: "manual-init" },
  },
});

declare global {
  interface Window {
    Sentry: typeof Sentry;
  }
}

if (typeof window !== "undefined") {
  window.Sentry = Sentry;
}

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
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
