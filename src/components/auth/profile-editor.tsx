"use client";

import { useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { useAuth } from "@/components/auth/auth-provider";
import { AuthControls, LoginNotice } from "@/components/auth/auth-controls";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { isUsernameAvailable, UsernameTakenError, isDisplayNameAvailable, NameTakenError, saveUserProfile } from "@/lib/profile-store";
import { normalizeUsername, validateUsername, publicProfilePath, getEmailDisplayName, normalizeDisplayName, validateProfile, type ProfileDraft } from "@/lib/user-profile";

export function ProfileEditor() {
  const { user, loading } = useAuth();
  return <main className="mx-auto min-h-screen w-full max-w-xl px-6 py-8">
    <header className="mb-8 flex flex-wrap items-center justify-between gap-3">
      <Link href="/" className="inline-flex min-h-11 items-center font-bold">mylink.</Link><AuthControls />
    </header>
    <h1 className="mb-6 text-2xl font-bold">프로필 수정</h1>
    {loading || !user ? <LoginNotice /> : <ProfileForm key={user.uid} />}
  </main>;
}
function ProfileForm() {
  const { user, profileLoading, profileError } = useAuth();
  if (!user) return null;
  if (profileLoading) return <p role="status">프로필을 불러오는 중…</p>;
  if (profileError) return <p role="alert" className="text-destructive">{profileError} 새로고침 후 다시 시도해주세요.</p>;
  return <ProfileFields key={user.uid} />;
}
function ProfileFields() {
  const { user, profile } = useAuth();
  const [draft, setDraft] = useState<ProfileDraft>({
    displayName: profile?.displayName || getEmailDisplayName(user?.email),
    bio: profile?.bio ?? "", username: profile?.username ?? "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ProfileDraft, string>>>({});
  const [check, setCheck] = useState<{ name: string; available: boolean } | null>(null);
  const [checking, setChecking] = useState(false);
  const [addressCheck, setAddressCheck] = useState<{ value: string; available: boolean } | null>(null);
  const [addressChecking, setAddressChecking] = useState(false);
  const addressSequence = useRef(0);
  const addressInput = useRef<HTMLInputElement>(null);
  const username = normalizeUsername(draft.username ?? "");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const checkingSequence = useRef(0);
  const submitting = useRef(false);
  const titleInput = useRef<HTMLInputElement>(null);
  const bioInput = useRef<HTMLTextAreaElement>(null);
  const savedName = profile?.displayName ?? "";
  const normalizedName = normalizeDisplayName(draft.displayName);
  const unchangedClaimedName = !!profile?.displayNameKey && normalizedName === savedName;
  async function checkName() {
    if (!user) return;
    const error = validateProfile({ ...draft, bio: "" }).displayName;
    if (error) { setErrors((current) => ({ ...current, displayName: error })); titleInput.current?.focus(); return; }
    const sequence = ++checkingSequence.current;
    setChecking(true); setCheck(null); setErrors((current) => ({ ...current, displayName: undefined }));
    try {
      const available = await isDisplayNameAvailable(user.uid, normalizedName);
      if (sequence === checkingSequence.current) setCheck({ name: normalizedName, available });
    } catch {
      if (sequence === checkingSequence.current) toast.error("중복 확인에 실패했어요. 연결과 Firestore 권한을 확인해주세요.");
    } finally { if (sequence === checkingSequence.current) setChecking(false); }
  }
  async function checkAddress() {
    if (!user) return;
    const error = validateUsername(username);
    if (error) { setErrors((current) => ({ ...current, username: error })); addressInput.current?.focus(); return; }
    const sequence = ++addressSequence.current;
    setAddressChecking(true); setAddressCheck(null);
    setErrors((current) => ({ ...current, username: undefined }));
    try {
      const available = await isUsernameAvailable(user.uid, username);
      if (sequence === addressSequence.current) setAddressCheck({ value: username, available });
    } catch {
      if (sequence === addressSequence.current) toast.error("주소 중복 확인에 실패했어요. 잠시 후 다시 시도해주세요.");
    } finally { if (sequence === addressSequence.current) setAddressChecking(false); }
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user || submitting.current) return;
    const validation = validateProfile(draft);
    if (!validation.displayName && !unchangedClaimedName && !(check?.available && check.name === normalizedName)) validation.displayName = "이름 중복 확인을 완료해주세요.";
    if (!validation.username && username !== profile?.username && !(addressCheck?.available && addressCheck.value === username)) validation.username = "주소 중복 확인을 완료해주세요.";
    setErrors(validation);
    if (Object.keys(validation).length) {
      (validation.displayName ? titleInput : validation.username ? addressInput : bioInput).current?.focus(); return;
    }
    submitting.current = true; setSaving(true); setSaveError(null);
    try {
      await saveUserProfile(user, draft);
      setDraft((current) => ({ ...current, displayName: normalizedName, username }));
      toast.success("프로필을 저장했어요.");
    } catch (cause) {
      if (cause instanceof UsernameTakenError) {
        setAddressCheck({ value: username, available: false });
        setErrors({ username: cause.message }); addressInput.current?.focus();
      } else if (cause instanceof NameTakenError) {
        setCheck({ name: normalizedName, available: false });
        setErrors({ displayName: cause.message }); titleInput.current?.focus();
      } else {
        setSaveError("프로필을 저장하지 못했어요. 연결과 Firestore 권한을 확인하고 다시 시도해주세요.");
        toast.error("프로필을 저장하지 못했어요.");
      }
    } finally { submitting.current = false; setSaving(false); }
  }
  return <form noValidate onSubmit={submit} aria-busy={saving} className="rounded-2xl border p-6">
    <fieldset disabled={saving} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="profile-name">표시 이름</Label>
        <div className="flex gap-2">
          <Input id="profile-name" ref={titleInput} value={draft.displayName} onChange={(event) => {
            checkingSequence.current++; setChecking(false); setCheck(null);
            setErrors((current) => ({ ...current, displayName: undefined }));
            setDraft({ ...draft, displayName: event.target.value });
          }} aria-invalid={!!errors.displayName} aria-describedby="profile-name-help profile-name-result" className="h-11 min-w-0" autoComplete="nickname" required />
          <Button type="button" variant="outline" className="min-h-11 shrink-0" disabled={checking} onClick={checkName}>{checking ? "확인 중…" : "중복 확인"}</Button>
        </div>
        <p id="profile-name-help" className="text-xs leading-5 text-muted-foreground">2~30자의 한글·영문·숫자·._+-를 사용할 수 있어요. 영문 대소문자는 같은 이름으로 취급합니다.</p>
        <div id="profile-name-result" aria-live="polite">
          {errors.displayName ? <p role="alert" className="text-sm text-destructive">{errors.displayName}</p> : check && <p className={check.available ? "text-sm text-green-700 dark:text-green-400" : "text-sm text-destructive"}>{check.available ? "사용할 수 있는 이름이에요. 최종 저장 시 다시 확인합니다." : "이미 사용 중인 이름이에요."}</p>}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="profile-username">주소 아이디</Label>
        <div className="flex gap-2">
          <Input id="profile-username" ref={addressInput} value={draft.username ?? ""} onChange={(event) => {
            addressSequence.current++; setAddressChecking(false); setAddressCheck(null);
            setErrors((current) => ({ ...current, username: undefined }));
            setDraft({ ...draft, username: event.target.value });
          }} className="h-11 min-w-0" required autoCapitalize="none" spellCheck={false} aria-invalid={!!errors.username} aria-describedby="profile-address-help profile-address-result" />
          <Button type="button" variant="outline" className="min-h-11 shrink-0" disabled={addressChecking} onClick={checkAddress}>{addressChecking ? "확인 중…" : "중복 확인"}</Button>
        </div>
        <p id="profile-address-help" className="text-xs leading-5 text-muted-foreground">영문·숫자로 시작하는 3~30자의 영문·숫자·밑줄·하이픈. 소문자로 저장됩니다. 표시 이름을 바꿔도 이 주소는 유지됩니다.</p>
        {username && <p className="break-all text-sm text-muted-foreground">내 페이지: {publicProfilePath(username)}</p>}
        <p className="text-xs text-destructive">주소를 바꾸면 이전 주소는 사용할 수 없으며 다른 사용자가 등록할 수 있습니다.</p>
        <div id="profile-address-result" aria-live="polite">
          {errors.username ? <p role="alert" className="text-sm text-destructive">{errors.username}</p> : addressCheck && <p className={addressCheck.available ? "text-sm text-green-700 dark:text-green-400" : "text-sm text-destructive"}>{addressCheck.available ? "사용 가능한 주소예요. 저장 시 다시 확인합니다." : "이미 사용 중인 주소예요."}</p>}
        </div>
      </div>
      <div className="space-y-2"><Label htmlFor="profile-email">이메일</Label><Input id="profile-email" value={profile?.email || user?.email || ""} readOnly className="h-11 bg-muted" /><p className="text-xs text-muted-foreground">Google 계정 이메일은 여기에서 변경할 수 없어요.</p></div>
      <div className="space-y-2">
        <Label htmlFor="profile-bio">소개</Label>
        <Textarea id="profile-bio" ref={bioInput} value={draft.bio} onChange={(event) => setDraft({ ...draft, bio: event.target.value })} aria-invalid={!!errors.bio} aria-describedby="profile-bio-help" />
        <p id="profile-bio-help" className="text-xs text-muted-foreground">{Array.from(draft.bio).length}/200자</p>
        {errors.bio && <p role="alert" className="text-sm text-destructive">{errors.bio}</p>}
      </div>
      {saveError && <p role="alert" className="text-sm text-destructive">{saveError}</p>}
      <div className="flex justify-end gap-2">
        <Button asChild variant="outline" className="min-h-11"><Link href="/">돌아가기</Link></Button>
        <Button type="submit" disabled={checking || addressChecking} className="min-h-11">{saving ? "저장 중…" : "저장하기"}</Button>
      </div>
    </fieldset>
  </form>;
}
