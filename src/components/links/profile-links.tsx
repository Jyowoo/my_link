"use client";

import { useAuth } from "@/components/auth/auth-provider";
import { LinkCard } from "@/components/links/link-card";
import { useLinks } from "@/components/links/links-provider";

export function ProfileLinks({ showClickCount = false }: { showClickCount?: boolean } = {}) {
  const { user, loading: authLoading } = useAuth();
  const { links, loading, error } = useLinks();
  if (authLoading) return <p role="status" className="py-6 text-sm text-muted-foreground">로그인 상태를 확인하고 있어요…</p>;
  if (!user) return <p className="py-6 text-sm text-muted-foreground">로그인하면 내 계정에 저장한 링크가 여기에 표시됩니다.</p>;
  return (
    <div className="mt-5" aria-busy={loading}>
      {loading && <p role="status" className="py-6 text-sm text-muted-foreground">링크를 불러오는 중…</p>}
      {error && <p role="alert" className="py-6 text-sm text-destructive">{error}</p>}
      <ul aria-label="프로필 링크 목록" className="space-y-4">
        {links.map((link) => <li key={link.id}><LinkCard ownerId={user.uid} link={link} mode="view" showClickCount={showClickCount} /></li>)}
      </ul>
      {!loading && !error && links.length === 0 && <p className="py-6 text-sm text-muted-foreground">아직 등록된 링크가 없어요.</p>}
    </div>
  );
}
