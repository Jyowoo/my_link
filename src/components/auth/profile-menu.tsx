"use client";

import Link from "next/link";
import { toast } from "sonner";
import { Pencil, ChevronDown, Copy, ExternalLink, LogOut, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/components/auth/auth-provider";
import { getEmailDisplayName, publicProfilePath } from "@/lib/user-profile";

export function ProfileMenu() {
  const { user, profile, busy, logout } = useAuth();
  if (!user) return null;
  const name = profile?.displayName || getEmailDisplayName(user.email);
  const pagePath = profile?.username ? publicProfilePath(profile.username) : null;
  async function copyLink() {
    if (!pagePath) { toast.error("프로필을 준비 중이에요. 잠시 후 다시 시도해주세요."); return; }
    try {
      await navigator.clipboard.writeText(new URL(pagePath, window.location.origin).href);
      toast.success("프로필 주소를 복사했어요.", { description: "누구나 이 주소에서 내 프로필과 링크를 볼 수 있어요.", id: "profile-link-copy" });
    } catch {
      toast.error("주소를 복사하지 못했어요.", { description: "브라우저 주소창에서 복사해주세요.", id: "profile-link-copy" });
    }
  }
  return <>
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="min-h-11 max-w-60" disabled={busy} aria-label="프로필 메뉴">
          <UserRound aria-hidden="true" /><span className="truncate">{name}</span><ChevronDown aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel className="max-w-72 px-3 py-2">
          <p className="truncate font-semibold">{name}</p>
          <p className="truncate text-xs font-normal text-muted-foreground">{profile?.email || user.email}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="my-1 h-px bg-border" />
        <DropdownMenuItem asChild><Link href="/settings/profile"><Pencil aria-hidden="true" />프로필 수정</Link></DropdownMenuItem>
        <DropdownMenuItem asChild disabled={!pagePath}><Link href={pagePath ?? "/"}><UserRound aria-hidden="true" />내 페이지로 이동</Link></DropdownMenuItem>
        <DropdownMenuItem disabled={!pagePath} onSelect={copyLink}><Copy aria-hidden="true" />링크 복사</DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href="/preview" target="_blank" rel="noopener noreferrer"><ExternalLink aria-hidden="true" />내 페이지 미리보기<span className="sr-only"> (새 탭)</span></a>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="my-1 h-px bg-border" />
        <DropdownMenuItem disabled={busy} className="text-destructive" onSelect={logout}><LogOut aria-hidden="true" />로그아웃</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </>;
}
