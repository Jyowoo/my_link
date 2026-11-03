import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AuthProvider } from "@/components/auth/auth-provider";
import { LinksProvider } from "@/components/links/links-provider";
import { FirebaseAnalytics } from "@/components/firebase-analytics";

const pretendard = localFont({
  src: "./fonts/PretendardVariable.woff2",
  variable: "--font-pretendard",
  weight: "45 920",
  display: "swap",
});

export const metadata: Metadata = {
  title: "마이링크 | 나만의 링크",
  description: "Google 로그인으로 내 프로필과 링크를 관리하세요.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ko"
      className={`${pretendard.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <FirebaseAnalytics />
        <AuthProvider><LinksProvider>{children}</LinksProvider></AuthProvider>
      </body>
    </html>
  );
}
