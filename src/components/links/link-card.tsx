"use client";

import { useRef, useState } from "react";
import { Pencil, Trash2, ArrowUpRight, BookOpen, FolderOpen, MessageCircle, Link2, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { LinkForm } from "@/components/links/link-form";
import { useLinks } from "@/components/links/links-provider";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import type { ProfileLink } from "@/lib/links";

const icons: Record<string, LucideIcon> = { FolderOpen, BookOpen, Instagram: MessageCircle };
const categories: Record<string, string> = { portfolio: "작업물", blog: "기록", social: "일상", other: "기타" };

export function LinkCard({ link, mode }: { link: ProfileLink; mode: "view" | "manage" }) {
  const { updateLink, deleteLink, error } = useLinks();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const deletingRef = useRef(false);
  const editButton = useRef<HTMLButtonElement>(null);

  function finishEditing() {
    setEditing(false);
    editButton.current?.focus();
  }

  async function confirmDelete() {
    if (deletingRef.current) return;
    deletingRef.current = true;
    setDeleting(true);
    setDeleteError(null);
    try {
      await deleteLink(link.id);
      setDeleteOpen(false);
    } catch (cause) {
      console.error("Failed to delete link:", cause);
      setDeleteError("링크를 삭제하지 못했어요. 연결 상태를 확인하고 다시 시도해주세요.");
    } finally {
      deletingRef.current = false;
      setDeleting(false);
    }
  }

  const Icon = icons[link.icon] ?? Link2;
  return (
    <Card className="py-6 sm:py-7">
      <CardContent className="flex items-start gap-4 px-5 sm:gap-5 sm:px-7">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-secondary text-secondary-foreground sm:size-14">
          <Icon className="size-6" strokeWidth={1.5} aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted-foreground">{categories[link.category] ?? link.category}</span>
            {link.badge && <Badge variant="secondary">{link.badge}</Badge>}
          </div>
          <h3 className="break-words text-lg font-semibold tracking-tight">{link.title}</h3>
          {link.description && <p className="mt-1.5 break-words text-sm leading-6 text-muted-foreground">{link.description}</p>}
          {mode === "manage" && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Button ref={editButton} type="button" variant="outline" className="min-h-11" disabled={saving || deleting || !!error} aria-label={`${link.title} 수정`} aria-expanded={editing} aria-controls={`edit-link-${link.id}`} onClick={() => setEditing((current) => !current)}>
                <Pencil aria-hidden="true" />수정
              </Button>
              <Dialog open={deleteOpen} onOpenChange={(next) => { if (!deletingRef.current) { setDeleteOpen(next); setDeleteError(null); } }}>
                <DialogTrigger asChild>
                  <Button type="button" variant="destructive" className="min-h-11" disabled={saving || deleting || !!error} aria-label={`${link.title} 삭제`}>
                    <Trash2 aria-hidden="true" />삭제
                  </Button>
                </DialogTrigger>
                <DialogContent showCloseButton={!deleting} aria-busy={deleting}>
                  <DialogHeader>
                    <DialogTitle>정말 삭제하시겠습니까?</DialogTitle>
                    <DialogDescription className="break-words">삭제할 링크: {link.title}</DialogDescription>
                  </DialogHeader>
                  <p className="font-medium text-red-600 dark:text-red-400">이 작업은 되돌릴 수 없습니다</p>
                  {deleteError && <p role="alert" className="text-sm text-destructive">{deleteError}</p>}
                  <DialogFooter>
                    <Button type="button" variant="outline" className="min-h-11" disabled={deleting} autoFocus onClick={() => setDeleteOpen(false)}>취소</Button>
                    <Button type="button" variant="destructive" className="min-h-11" disabled={deleting} onClick={confirmDelete}>{deleting ? "삭제 중…" : "삭제하기"}</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          )}
          {mode === "manage" && editing ? (
            <section id={`edit-link-${link.id}`} aria-label={`${link.title} 수정`} className="mt-5 border-t pt-5">
              <LinkForm initialValue={link} onSave={async (draft) => { await updateLink(link.id, draft); finishEditing(); }} onCancel={finishEditing} onBusyChange={setSaving} />
            </section>
          ) : (
            <Button asChild variant="link" className="mt-4 min-h-11 px-0">
              <a href={link.url} target={link.isExternal ? "_blank" : undefined} rel={link.isExternal ? "noopener noreferrer" : undefined} aria-label={`${link.title}: ${link.actionText}${link.isExternal ? " (새 탭에서 열기)" : ""}`}>
                {link.actionText}<ArrowUpRight className="size-4" aria-hidden="true" />
                {link.isExternal && <span className="sr-only"> (새 탭에서 열기)</span>}
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
