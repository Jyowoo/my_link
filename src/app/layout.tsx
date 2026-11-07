import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AuthProvider } from "@/components/auth/auth-provider";
import { LinksProvider } from "@/components/links/links-provider";
import { Toaster } from "@/components/ui/sonner";
import { FirebaseAnalytics } from "@/components/firebase-analytics";

const pretendard = localFont({
  src: "./fonts/PretendardVariable.woff2",
  variable: "--font-pretendard",
  weight: "45 920",
  display: "swap",
});

const deploymentHost = process.env.VERCEL_ENV === "preview"
  ? process.env.VERCEL_URL
  : process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || (deploymentHost ? `https://${deploymentHost}` : "http://localhost:3000")),
  applicationName: "마이링크",
  title: "마이링크 | 나만의 링크",
  description: "나를 소개하는 링크를 한곳에 모아 내 주소로 공유하세요.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ko"
      className={`${pretendard.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <FirebaseAnalytics />
        <Toaster />
        <AuthProvider><LinksProvider>{children}</LinksProvider></AuthProvider>
      </body>
    </html>
  );
}
