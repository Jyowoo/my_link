"use client";

import { LinkCard } from "@/components/links/link-card";
import { useLinks } from "@/components/links/links-provider";

export function ProfileLinks() {
  const { links } = useLinks();
  return (
    <div className="mt-5">
      <ul aria-label="프로필 링크 목록" className="space-y-4">
        {links.map((link) => <li key={link.id}><LinkCard link={link} /></li>)}
      </ul>
      {links.length === 0 && <p className="py-6 text-sm text-muted-foreground">아직 등록된 링크가 없어요.</p>}
    </div>
  );
}
