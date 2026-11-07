"use client";

import { useState, type ReactNode } from "react";
import { ArrowRight, ArrowUpRight, BookOpen, BriefcaseBusiness, Camera, Code2, Link2, Mail, Palette } from "lucide-react";
import { useAuth } from "@/components/auth/auth-provider";
import { Button } from "@/components/ui/button";

export function HomeExperience({ landing, children }: { landing: ReactNode; children: ReactNode }) {
  const { user, loading } = useAuth();
  return !loading && user ? children : landing;
}

export function LandingStartButton({ className }: { className?: string }) {
  const { loading, busy, login } = useAuth();
  return <Button className={className} disabled={loading || busy} onClick={login}>Google로 시작하기<ArrowRight aria-hidden="true" /></Button>;
}

const examples = [
  {
    label: "포트폴리오", address: "studio-min", initials: "민", name: "스튜디오 민", description: "생각을 화면으로 만드는 디자이너",
    avatar: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
    links: [{ title: "프로젝트 모아보기", icon: BriefcaseBusiness }, { title: "디자인 작업 노트", icon: Palette }, { title: "함께 작업해요", icon: Mail }],
  },
  {
    label: "크리에이터", address: "daily-jin", initials: "진", name: "하루 한 장, 진", description: "일상의 작은 순간을 기록합니다",
    avatar: "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300",
    links: [{ title: "사진 모아보기", icon: Camera }, { title: "이번 주 기록", icon: BookOpen }, { title: "협업 문의", icon: Mail }],
  },
  {
    label: "개발자", address: "dev-log", initials: "D", name: "개발하는 도현", description: "만들고 배운 것을 나눕니다",
    avatar: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
    links: [{ title: "만든 프로젝트", icon: Code2 }, { title: "개발 블로그", icon: BookOpen }, { title: "다른 작업 둘러보기", icon: Link2 }],
  },
] as const;

export function LandingDemo() {
  const [selected, setSelected] = useState(0);
  const example = examples[selected];
  return (
    <section id="examples" aria-label="프로필 예시" className="min-w-0 scroll-mt-6 rounded-[2rem] border bg-card p-3 shadow-xl shadow-blue-900/5 sm:p-4">
      <div className="flex flex-wrap items-center justify-between gap-2 px-2 pb-3">
        <span className="text-xs font-bold text-muted-foreground">프로필 예시</span>
        <div className="flex flex-wrap gap-1" role="group" aria-label="예시 유형">
          {examples.map((item, index) => (
            <button key={item.address} type="button" aria-pressed={index === selected} onClick={() => setSelected(index)}
              className="min-h-9 rounded-full px-3 text-xs font-semibold text-muted-foreground transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 aria-pressed:bg-blue-100 aria-pressed:text-blue-800 dark:aria-pressed:bg-blue-950 dark:aria-pressed:text-blue-200">{item.label}</button>
          ))}
        </div>
      </div>
      <div aria-live="polite" className="rounded-[1.5rem] bg-muted/60 p-4 sm:p-6">
        <div className="mb-5 flex items-center gap-3">
          <span className={`grid size-12 shrink-0 place-items-center rounded-2xl text-lg font-bold ${example.avatar}`}>{example.initials}</span>
          <div className="min-w-0">
            <p className="truncate text-lg font-bold">{example.name}</p>
            <p className="break-keep text-sm text-muted-foreground">{example.description}</p>
          </div>
        </div>
        <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-muted-foreground"><Link2 className="size-3.5" aria-hidden="true" />내 주소 /{example.address}</div>
        <ul className="space-y-2">
          {example.links.map(({ title, icon: Icon }) => (
            <li key={title} className="flex min-h-12 items-center gap-3 rounded-xl border bg-card px-3 py-2 text-sm font-semibold">
              <Icon className="size-4 shrink-0 text-blue-600 dark:text-blue-400" aria-hidden="true" />
              <span className="min-w-0 flex-1 break-keep">{title}</span><ArrowUpRight className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
