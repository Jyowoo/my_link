import type { Metadata } from "next";
import Link from "next/link";
import { UserProfile } from "@/components/auth/auth-controls";
import { ProfileLinks } from "@/components/links/profile-links";

export const metadata: Metadata = { title: "내 페이지 미리보기 | 마이링크", robots: { index: false, follow: false } };

export default function PreviewPage() {
  return <main className="mx-auto min-h-screen w-full max-w-xl px-6 py-8">
    <header className="mb-8 flex flex-wrap items-center justify-between gap-3">
      <span className="text-sm font-semibold text-muted-foreground">내 페이지 미리보기</span>
      <Link href="/" className="inline-flex min-h-11 items-center text-sm font-semibold underline underline-offset-4">프로필로 돌아가기</Link>
    </header>
    <section className="rounded-2xl border bg-card p-6"><UserProfile /></section>
    <section className="mt-8" aria-labelledby="preview-links-title">
      <h2 id="preview-links-title" className="text-lg font-semibold">더 알아보기</h2>
      <ProfileLinks />
    </section>
  </main>;
}
