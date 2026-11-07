"use client";

import { getEmailDisplayName, publicProfilePath } from "@/lib/user-profile";

import Link from "next/link";
import { LogIn, UserRound } from "lucide-react";
import { ProfileMenu } from "@/components/auth/profile-menu";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/auth-provider";

export function AuthControls() {
  const { user, profile, loading, busy, error, login } = useAuth();
  return <div className="min-w-0 text-right">
    <div className="flex flex-wrap items-center justify-end gap-2">
      {loading ? <span role="status" className="text-sm text-muted-foreground">로그인 확인 중…</span> : user ? <>{profile?.username && <Button asChild variant="ghost" className="min-h-11"><Link href={publicProfilePath(profile.username)}>내 페이지</Link></Button>}<ProfileMenu /></> : <Button className="min-h-11" disabled={busy} onClick={login}><LogIn aria-hidden="true" />Google로 로그인</Button>}
    </div>
    {error && <p role="alert" className="mt-2 max-w-sm text-sm text-destructive">{error}</p>}
  </div>;
}
export function LoginNotice() {
  const { loading } = useAuth();
  return <div className="rounded-xl border border-dashed p-6 text-center">
    {loading ? <p role="status" className="text-muted-foreground">로그인 상태를 확인하고 있어요…</p> : <>
      <h2 className="text-lg font-bold">로그인하고 나만의 링크를 모아보세요</h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">상단의 Google 로그인 버튼으로 시작하세요. 로그인하면 프로필과 링크를 확인하고 추가·수정·삭제할 수 있어요.</p>
    </>}
  </div>;
}
export function UserProfile() {
  const { user, profile, loading, profileLoading, profileError } = useAuth();
  if (loading || !user) return <LoginNotice />;
  const name = profile?.displayName || getEmailDisplayName(user.email);
  const photo = profile?.photoURL || user.photoURL;
  const safePhoto = photo?.startsWith("https://") ? photo : null;
  return <div className="space-y-3">
    <div className="flex items-center gap-4">
      <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-secondary">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {safePhoto ? <img src={safePhoto} alt="" referrerPolicy="no-referrer" className="size-full object-cover" /> : <UserRound aria-hidden="true" className="size-8" />}
      </div>
      <div className="min-w-0">
        <h1 className="break-words text-2xl font-bold">{name}</h1>
        <p className="break-all text-sm text-muted-foreground">{profile?.email || user.email}</p>
      </div>
    </div>
    {profile?.bio && <p className="whitespace-pre-wrap break-words text-sm leading-6">{profile.bio}</p>}
    <p className="text-sm text-muted-foreground">나만의 링크와 이야기를 한곳에 모아보세요.</p>
    {profileLoading && <p role="status" className="text-sm text-muted-foreground">사용자 정보를 불러오는 중…</p>}
    {profileError && <p role="alert" className="text-sm text-destructive">{profileError}</p>}
  </div>;
}
export function ManageLinksButton() {
  const { user, loading } = useAuth();
  if (loading || !user) return null;
  return <Button asChild variant="outline" className="min-h-11 shrink-0 font-bold"><Link href="/links">링크 관리</Link></Button>;
}
