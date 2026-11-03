"use client";

import { useRef, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { LinkForm, type LinkDraft } from "@/components/links/link-form";

export function AddLinkDialog({ onAdd, disabled = false }: { onAdd: (link: LinkDraft) => Promise<void>; disabled?: boolean }) {
  const [open, setOpen] = useState(false);
  const busy = useRef(false);
  const [saving, setSaving] = useState(false);
  return (
    <Dialog open={open} onOpenChange={(next) => { if (!busy.current) setOpen(next); }}>
      <DialogTrigger asChild><Button disabled={disabled} className="min-h-11 px-4"><Plus aria-hidden="true" />링크 추가</Button></DialogTrigger>
      <DialogContent showCloseButton={!saving} className="max-h-[90dvh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>새 링크 추가</DialogTitle>
          <DialogDescription>나누고 싶은 링크를 등록하세요. 저장한 링크는 프로필에도 표시됩니다.</DialogDescription>
        </DialogHeader>
        <LinkForm idPrefix="link" onSave={async (draft) => { await onAdd(draft); setOpen(false); }} onCancel={() => setOpen(false)} onBusyChange={(next) => { busy.current = next; setSaving(next); }} />
      </DialogContent>
    </Dialog>
  );
}
