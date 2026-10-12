"use client";

import { useRef, useState, type FormEvent } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { validateLink, type ProfileLink } from "@/lib/links";

type Draft = Omit<ProfileLink, "id" | "displayOrder">;

export function AddLinkDialog({ onAdd, disabled = false }: { onAdd: (link: Draft) => Promise<void>; disabled?: boolean }) {
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState<{ title?: string; url?: string }>({});
  const [protocol, setProtocol] = useState("https://");
  const [address, setAddress] = useState("");
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
    setSaveError(null);
    try {
      await onAdd({
        title, url, description: text("description"), category,
        icon: ({ portfolio: "FolderOpen", blog: "BookOpen", social: "Instagram" } as Record<string, string>)[category] ?? "Link2",
        actionText: text("actionText") || "링크 열기",
        isExternal: true,
        badge: text("badge") || null,
      });
      setOpen(false);
    } catch (cause) {
      console.error("Failed to save link:", cause);
      setSaveError("링크를 저장하지 못했어요. 연결 상태를 확인하고 다시 시도해주세요.");
    } finally {
      submitting.current = false;
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(next) => { if (submitting.current) return; setOpen(next); setErrors({}); setSaveError(null); if (next) { setProtocol("https://"); setAddress(""); } }}>
      <DialogTrigger asChild><Button disabled={disabled} className="min-h-11 px-4"><Plus aria-hidden="true" />링크 추가</Button></DialogTrigger>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>새 링크 추가</DialogTitle>
          <DialogDescription>나누고 싶은 링크를 등록하세요. 저장한 링크는 프로필에도 표시됩니다.</DialogDescription>
        </DialogHeader>
        <form noValidate onSubmit={submit} aria-busy={saving} className="space-y-5">
          <fieldset disabled={saving} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="link-title">제목 <span aria-hidden="true">*</span></Label>
              <Input id="link-title" name="title" ref={titleInput} required placeholder="예: 나의 포트폴리오" aria-invalid={!!errors.title} aria-describedby={errors.title ? "link-title-error" : "link-title-help"} />
              {errors.title ? <p id="link-title-error" role="alert" className="text-sm text-destructive">{errors.title}</p> : <p id="link-title-help" className="text-xs text-muted-foreground">필수 · 앞뒤 공백을 제외하고 최대 50자</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="link-url">URL <span aria-hidden="true">*</span></Label>
              <div className="flex gap-2">
                <select id="link-protocol" aria-label="URL 프로토콜" value={protocol} onChange={(event) => setProtocol(event.target.value)} className="h-11 shrink-0 rounded-lg border border-input bg-background px-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <option value="https://">https://</option>
                  <option value="http://">http://</option>
                </select>
                <Input id="link-url" name="url" ref={urlInput} type="text" inputMode="url" required placeholder="example.com" value={address} onChange={(event) => {
                  const value = event.target.value;
                  const fullUrl = value.trim().match(/^(https?:\/\/)(.*)$/i);
                  if (fullUrl) { setProtocol(fullUrl[1].toLowerCase()); setAddress(fullUrl[2]); }
                  else setAddress(value);
                }} className="h-11 min-w-0 flex-1" autoCapitalize="none" spellCheck={false} aria-invalid={!!errors.url} aria-describedby={errors.url ? "link-url-error" : "link-url-help"} />
              </div>
              {errors.url ? <p id="link-url-error" role="alert" className="text-sm text-destructive">{errors.url}</p> : <p id="link-url-help" className="text-xs text-muted-foreground">필수 · 주소만 입력하거나 전체 URL을 붙여넣으세요.</p>}
            </div>
            <div className="space-y-2"><Label htmlFor="link-description">설명</Label><Textarea id="link-description" name="description" placeholder="어떤 이야기를 담은 링크인가요?" /></div>
            <div className="space-y-2">
              <Label htmlFor="link-category">분류</Label>
              <select id="link-category" name="category" defaultValue="portfolio" className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <option value="portfolio">작업물</option><option value="blog">기록</option><option value="social">일상</option><option value="other">기타</option>
              </select>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2"><Label htmlFor="link-action">동작 문구</Label><Input id="link-action" name="actionText" placeholder="링크 열기" /></div>
              <div className="space-y-2"><Label htmlFor="link-badge">배지</Label><Input id="link-badge" name="badge" placeholder="예: NEW" /></div>
            </div>
            <p className="text-xs text-muted-foreground">아이콘은 분류에 맞춰 표시되며 링크는 새 탭으로 열립니다.</p>
            {saveError && <p role="alert" className="text-sm text-destructive">{saveError}</p>}
            <DialogFooter>
              <Button type="button" variant="outline" className="min-h-11" onClick={() => setOpen(false)}>취소</Button>
              <Button type="submit" className="min-h-11">{saving ? "저장 중…" : "추가하기"}</Button>
            </DialogFooter>
          </fieldset>
        </form>
      </DialogContent>
    </Dialog>
  );
}
