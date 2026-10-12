"use client";

import { LinkCard } from "@/components/links/link-card";
import { useLinks } from "@/components/links/links-provider";

export function ProfileLinks() {
  const { links, loading, error } = useLinks();
  return (
    <div className="mt-5" aria-busy={loading}>
      {loading && <p role="status" className="py-6 text-sm text-muted-foreground">링크를 불러오는 중…</p>}
      {error && <p role="alert" className="py-6 text-sm text-destructive">{error}</p>}
      <ul aria-label="프로필 링크 목록" className="space-y-4">
        {links.map((link) => <li key={link.id}><LinkCard link={link} /></li>)}
      </ul>
      {!loading && !error && links.length === 0 && <p className="py-6 text-sm text-muted-foreground">아직 등록된 링크가 없어요.</p>}
    </div>
  );
}
