"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { validateLink, type ProfileLink } from "@/lib/links";

export type LinkDraft = Omit<ProfileLink, "id" | "displayOrder" | "clickCount">;

export function LinkForm({ initialValue, onSave, onCancel, onBusyChange, idPrefix }: {
  initialValue?: ProfileLink;
  onSave: (link: LinkDraft) => Promise<void>;
  onCancel: () => void;
  onBusyChange?: (busy: boolean) => void;
  idPrefix?: string;
}) {
  const generatedId = useId();
  const prefix = idPrefix ?? generatedId;
  const initialUrl = initialValue?.url.match(/^(https?:\/\/)(.*)$/i);
  const [errors, setErrors] = useState<{ title?: string; url?: string }>({});
  const [protocol, setProtocol] = useState(initialUrl?.[1].toLowerCase() ?? "https://");
  const [address, setAddress] = useState(initialUrl?.[2] ?? initialValue?.url ?? "");
  const titleInput = useRef<HTMLInputElement>(null);
  const urlInput = useRef<HTMLInputElement>(null);
  const submitting = useRef(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;
    const form = new FormData(event.currentTarget);
    const text = (name: string) => String(form.get(name) ?? "").trim();
    const title = text("title");
    const enteredAddress = address.trim();
    const url = !enteredAddress ? "" : /^[a-z][a-z\d+.-]*:(?:\/\/|[^0-9])/i.test(enteredAddress)
      ? enteredAddress
      : `${protocol}${enteredAddress}`;
    const validation = validateLink(title, url);
    setErrors(validation);
    if (validation.title || validation.url) {
      (validation.title ? titleInput : urlInput).current?.focus();
      return;
    }
    const category = text("category");
    submitting.current = true;
    setSaving(true);
    onBusyChange?.(true);
    setSaveError(null);
    try {
      await onSave({
        title, url, description: text("description"), category,
        icon: initialValue && category === initialValue.category ? initialValue.icon : ({ portfolio: "FolderOpen", blog: "BookOpen", social: "Instagram" } as Record<string, string>)[category] ?? "Link2",
        actionText: text("actionText") || "링크 열기",
        isExternal: initialValue?.isExternal ?? true,
        badge: text("badge") || null,
      });
    } catch (cause) {
      console.error("Failed to save link:", cause);
      setSaveError("링크를 저장하지 못했어요. 연결 상태를 확인하고 다시 시도해주세요.");
    } finally {
      submitting.current = false;
      setSaving(false);
      onBusyChange?.(false);
    }
  }
  return (
    <form noValidate onSubmit={submit} aria-busy={saving} className="space-y-5">
      <fieldset disabled={saving} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor={`${prefix}-title`}>제목 <span aria-hidden="true">*</span></Label>
          <Input id={`${prefix}-title`} name="title" defaultValue={initialValue?.title} autoFocus={!!initialValue} ref={titleInput} required placeholder="예: 나의 포트폴리오" aria-invalid={!!errors.title} aria-describedby={errors.title ? `${prefix}-title-error` : `${prefix}-title-help`} />
          {errors.title ? <p id={`${prefix}-title-error`} role="alert" className="text-sm text-destructive">{errors.title}</p> : <p id={`${prefix}-title-help`} className="text-xs text-muted-foreground">필수 · 앞뒤 공백을 제외하고 최대 50자</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${prefix}-url`}>URL <span aria-hidden="true">*</span></Label>
          <div className="flex gap-2">
            <select id={`${prefix}-protocol`} aria-label="URL 프로토콜" value={protocol} onChange={(event) => setProtocol(event.target.value)} className="h-11 shrink-0 rounded-lg border border-input bg-background px-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <option value="https://">https://</option>
              <option value="http://">http://</option>
            </select>
            <Input id={`${prefix}-url`} name="url" ref={urlInput} type="text" inputMode="url" required placeholder="example.com" value={address} onChange={(event) => {
              const value = event.target.value;
              const fullUrl = value.trim().match(/^(https?:\/\/)(.*)$/i);
              if (fullUrl) { setProtocol(fullUrl[1].toLowerCase()); setAddress(fullUrl[2]); }
              else setAddress(value);
            }} className="h-11 min-w-0 flex-1" autoCapitalize="none" spellCheck={false} aria-invalid={!!errors.url} aria-describedby={errors.url ? `${prefix}-url-error` : `${prefix}-url-help`} />
          </div>
          {errors.url ? <p id={`${prefix}-url-error`} role="alert" className="text-sm text-destructive">{errors.url}</p> : <p id={`${prefix}-url-help`} className="text-xs text-muted-foreground">필수 · 주소만 입력하거나 전체 URL을 붙여넣으세요.</p>}
        </div>
        <div className="space-y-2"><Label htmlFor={`${prefix}-description`}>설명</Label><Textarea id={`${prefix}-description`} name="description" defaultValue={initialValue?.description} placeholder="어떤 이야기를 담은 링크인가요?" /></div>
        <div className="space-y-2">
          <Label htmlFor={`${prefix}-category`}>분류</Label>
          <select id={`${prefix}-category`} name="category" defaultValue={initialValue?.category ?? "portfolio"} className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring">
            {initialValue && !["portfolio", "blog", "social", "other"].includes(initialValue.category) && <option value={initialValue.category}>{initialValue.category}</option>}
            <option value="portfolio">작업물</option><option value="blog">기록</option><option value="social">일상</option><option value="other">기타</option>
          </select>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2"><Label htmlFor={`${prefix}-action`}>동작 문구</Label><Input id={`${prefix}-action`} name="actionText" defaultValue={initialValue?.actionText} placeholder="링크 열기" /></div>
          <div className="space-y-2"><Label htmlFor={`${prefix}-badge`}>배지</Label><Input id={`${prefix}-badge`} name="badge" defaultValue={initialValue?.badge ?? ""} placeholder="예: NEW" /></div>
        </div>
        <p className="text-xs text-muted-foreground">아이콘은 분류에 맞춰 표시되며 링크는 새 탭으로 열립니다.</p>
        {saveError && <p role="alert" className="text-sm text-destructive">{saveError}</p>}
        <div className="flex flex-wrap justify-end gap-2">
          <Button type="button" variant="outline" className="min-h-11" onClick={onCancel}>취소</Button>
          <Button type="submit" className="min-h-11">{saving ? "저장 중…" : initialValue ? "저장하기" : "추가하기"}</Button>
        </div>
      </fieldset>
    </form>
  );
}
