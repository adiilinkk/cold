import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "@/components/providers/session-provider";
import { ToastProvider } from "@/components/ui/toast";

export const metadata: Metadata = {
  title: {
    default: "OutreachIQ — AI Cold Email Personalizer",
    template: "%s | OutreachIQ",
  },
  description:
    "AI-powered cold email personalization platform. Generate hyper-personalized cold emails in seconds using prospect data and Claude AI.",
  keywords: ["cold email", "AI email", "outreach", "sales", "personalization"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <SessionProvider>
          <ToastProvider>{children}</ToastProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
