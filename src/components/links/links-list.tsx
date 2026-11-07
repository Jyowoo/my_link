"use client";

import { getEmailDisplayName } from "@/lib/user-profile";

import { useAuth } from "@/components/auth/auth-provider";
import { AuthControls, LoginNotice } from "@/components/auth/auth-controls";
import Link from "next/link";
import { ArrowLeft, Link2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AddLinkDialog } from "@/components/links/add-link-dialog";
import { useLinks } from "@/components/links/links-provider";
import { LinkCard } from "@/components/links/link-card";

export function LinksList() {
  const { user, profile, loading: authLoading } = useAuth();
  const { links, loading, error, addLink } = useLinks();

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-5 py-8 sm:px-8 sm:py-12">
        <nav aria-label="페이지 탐색" className="mb-14 flex flex-wrap items-center justify-between gap-4">
          <Link href="/" className="inline-flex min-h-11 items-center gap-2 text-lg font-bold tracking-tight">
            <Link2 className="size-5" aria-hidden="true" /> mylink<span className="text-blue-600">.</span>
          </Link>
          <AuthControls />
          <Button asChild variant="ghost" className="min-h-11">
            <Link href="/"><ArrowLeft aria-hidden="true" />프로필로</Link>
          </Button>
        </nav>

        <header className="mb-9">
          <p className="mb-3 text-xs font-semibold tracking-[0.18em] text-muted-foreground">MY LITTLE CORNER</p>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">링크 관리</h1>
          <p className="mt-4 max-w-lg text-base leading-7 text-muted-foreground">{user ? `${profile?.displayName || getEmailDisplayName(user.email)}님의 링크를 관리하세요.` : "로그인 후 나만의 링크를 관리할 수 있어요."}</p>
          {user && !authLoading && <>
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <Badge variant="outline">링크 {links.length}개</Badge>
            <Button asChild variant="outline" size="sm"><Link href="/stats">링크 통계</Link></Button>
          </div>
          <div className="mt-5"><AddLinkDialog onAdd={addLink} disabled={loading || !!error} /></div>
          </>}
        </header>

        {!user || authLoading ? <LoginNotice /> : <section aria-label="링크 목록" aria-busy={loading}>
          {loading && <p role="status" className="py-6 text-muted-foreground">링크를 불러오는 중…</p>}
          {error && <p role="alert" className="py-6 text-destructive">{error}</p>}
          <ul className="space-y-4">
            {links.map((link) => <li key={link.id}><LinkCard key={`manage-${link.id}`} ownerId={user.uid} link={link} mode="manage" /></li>)}
          </ul>
          {!loading && !error && links.length === 0 && <p className="rounded-xl border border-dashed p-8 text-center text-muted-foreground">아직 등록된 링크가 없어요.</p>}
        </section>}

        <footer className="mt-12 border-t pt-6 text-xs leading-6 text-muted-foreground">
          <p>작은 링크 하나에, 나다운 이야기를 담아요.</p>
          <p>저장한 링크는 프로필에도 표시됩니다.</p>
        </footer>
      </div>
    </main>
  );
}
