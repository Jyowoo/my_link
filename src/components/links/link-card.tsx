import { ArrowUpRight, BookOpen, FolderOpen, MessageCircle, Link2, type LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { ProfileLink } from "@/lib/links";

const icons: Record<string, LucideIcon> = { FolderOpen, BookOpen, Instagram: MessageCircle };
const categories: Record<string, string> = { portfolio: "작업물", blog: "기록", social: "일상", other: "기타" };

export function LinkCard({ link }: { link: ProfileLink }) {
  const Icon = icons[link.icon] ?? Link2;
  return (
    <a href={link.url} target={link.isExternal ? "_blank" : undefined} rel={link.isExternal ? "noopener noreferrer" : undefined}
      className="group block rounded-xl outline-none transition-transform focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 motion-safe:hover:-translate-y-0.5">
      <Card className="py-6 transition-shadow group-hover:shadow-md sm:py-7">
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
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium">
              {link.actionText}<ArrowUpRight className="size-4" aria-hidden="true" />
              {link.isExternal && <span className="sr-only"> (새 탭에서 열기)</span>}
            </span>
          </div>
        </CardContent>
      </Card>
    </a>
  );
}
