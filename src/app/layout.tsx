import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CyberQuest — Cybersecurity MCQ Tests & Practice",
  description:
    "Sharpen your cybersecurity skills with interactive MCQ tests and a searchable question bank covering network security, cryptography, web security, malware, IAM, SOC, cloud security, and ethical hacking.",
  keywords: [
    "cybersecurity",
    "MCQ",
    "quiz",
    "practice tests",
    "network security",
    "cryptography",
    "OWASP",
    "ethical hacking",
    "security operations",
  ],
  authors: [{ name: "CyberQuest" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "CyberQuest — Cybersecurity MCQ Tests & Practice",
    description:
      "Interactive cybersecurity MCQ tests and a searchable question bank across 8 domains.",
    siteName: "CyberQuest",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
          <Toaster />
          <SonnerToaster position="top-center" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
