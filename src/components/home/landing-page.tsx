import Link from "next/link";
import { ChartColumn, Link2, Share2, Sparkles } from "lucide-react";
import { AuthControls } from "@/components/auth/auth-controls";
import { LandingDemo, LandingStartButton } from "@/components/home/home-experience";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  { icon: Link2, title: "흩어진 링크를 한곳에", description: "포트폴리오, 블로그, SNS처럼 나를 소개하는 링크를 한 페이지에 모아보세요.", color: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300" },
  { icon: Share2, title: "내 주소 하나로 공유", description: "원하는 주소 아이디를 정하고, 누구나 열 수 있는 내 페이지를 공유하세요.", color: "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300" },
  { icon: ChartColumn, title: "어떤 링크가 인기인지", description: "방문자가 링크를 얼마나 열었는지 내 통계 화면에서 확인하세요.", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" },
];

export function LandingPage() {
  return <main className="min-h-svh bg-background text-foreground">
    <header className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-4 sm:px-8">
      <Link href="/" className="inline-flex min-h-11 items-center text-2xl font-bold tracking-tight">mylink<span className="text-blue-600">.</span></Link>
      <AuthControls />
    </header>

    <div className="mx-auto max-w-6xl px-5 pb-12 sm:px-8">
      <section aria-labelledby="landing-title" className="grid items-center gap-8 rounded-[2rem] border bg-linear-to-br from-blue-50 via-background to-violet-50 p-5 sm:p-9 lg:grid-cols-2 lg:gap-12 lg:p-12 dark:from-blue-950/45 dark:to-violet-950/35">
        <div className="min-w-0">
          <p className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1.5 text-xs font-bold text-blue-800 dark:bg-blue-950 dark:text-blue-200"><Sparkles className="size-3.5" aria-hidden="true" /> 나를 소개하는 가장 쉬운 방법</p>
          <h1 id="landing-title" className="mt-5 break-keep text-4xl leading-[1.15] font-bold tracking-tight sm:text-5xl lg:text-6xl">나를 보여주는<br /><span className="text-blue-600 dark:text-blue-400">단 하나의 링크</span></h1>
          <p className="mt-5 max-w-md break-keep text-base leading-7 text-muted-foreground sm:text-lg">작업물부터 SNS까지, 흩어진 링크를 한곳에 모으세요. 나만의 주소 하나로 더 많은 이야기를 전할 수 있어요.</p>
          <div className="mt-7 flex flex-col gap-2 sm:flex-row">
            <LandingStartButton className="min-h-12 bg-blue-600 px-5 font-bold text-white hover:bg-blue-700" />
            <Button asChild variant="outline" className="min-h-12 px-5"><a href="#examples">예시 둘러보기</a></Button>
          </div>
        </div>
        <LandingDemo />
      </section>

      <section aria-labelledby="features-title" className="mt-14 sm:mt-20">
        <h2 id="features-title" className="break-keep text-2xl font-bold tracking-tight sm:text-3xl">모으고, 공유하고, 확인하세요</h2>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {features.map(({ icon: Icon, title, description, color }) => (
            <Card key={title} className="gap-3">
              <CardHeader>
                <span className={`mb-3 grid size-10 place-items-center rounded-xl ${color}`}><Icon className="size-5" aria-hidden="true" /></span>
                <CardTitle className="break-keep text-base font-bold">{title}</CardTitle>
              </CardHeader>
              <CardContent><p className="break-keep text-sm leading-6 text-muted-foreground">{description}</p></CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section aria-labelledby="start-title" className="mt-12 flex flex-col items-start justify-between gap-5 rounded-3xl bg-muted/70 p-6 sm:flex-row sm:items-center sm:p-8">
        <div>
          <h2 id="start-title" className="break-keep text-xl font-bold sm:text-2xl">이제 내 링크를 모아볼까요?</h2>
          <p className="mt-2 break-keep text-sm leading-6 text-muted-foreground">Google 계정으로 시작하고, 나를 보여줄 첫 링크를 추가하세요.</p>
        </div>
        <LandingStartButton className="min-h-12 w-full shrink-0 bg-blue-600 px-5 font-bold text-white hover:bg-blue-700 sm:w-auto" />
      </section>
      <footer className="mt-10 flex flex-wrap items-center justify-between gap-2 border-t pt-5 text-xs text-muted-foreground"><span>© 2026 mylink</span><span>나만의 이야기를 담은 링크</span></footer>
    </div>
  </main>;
}
