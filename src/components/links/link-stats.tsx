"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ChartColumn, Link2, MousePointer2, Trophy } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { AuthControls } from "@/components/auth/auth-controls";
import { useAuth } from "@/components/auth/auth-provider";
import { useLinks } from "@/components/links/links-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";

const chartConfig = { clicks: { label: "클릭 수", color: "var(--color-blue-600)" } } satisfies ChartConfig;
const number = new Intl.NumberFormat("ko-KR");

export function LinkStats() {
  const { user, loading: authLoading } = useAuth();
  const { links, loading, error } = useLinks();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) router.replace("/");
  }, [authLoading, user, router]);

  if (authLoading || !user) {
    return <main className="mx-auto max-w-4xl p-6"><p role="status" className="text-sm text-muted-foreground">로그인 상태를 확인하고 있어요…</p></main>;
  }

  const data = links.map((link) => ({ id: link.id, title: link.title, clicks: link.clickCount ?? 0 }))
    .sort((a, b) => b.clicks - a.clicks);
  const total = data.reduce((sum, link) => sum + link.clicks, 0);
  const leader = total > 0 ? data[0] : undefined;
  const chartData = data.slice(0, 8);
  const titles = new Map(chartData.map((item) => [item.id, item.title]));

  return (
    <main className="min-h-screen bg-muted/40 text-foreground">
      <div className="mx-auto max-w-5xl space-y-6 px-4 py-6 sm:px-8 sm:py-10">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <Button asChild variant="ghost" className="min-h-11"><Link href="/links"><ArrowLeft aria-hidden="true" />링크 관리</Link></Button>
          <AuthControls />
        </header>

        <section aria-labelledby="stats-title" className="rounded-3xl border bg-card px-6 py-8 text-card-foreground shadow-sm sm:px-10 sm:py-10">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 dark:bg-blue-500/15 dark:text-blue-300">
              <ChartColumn className="size-4" aria-hidden="true" /> 내 링크 대시보드
            </div>
            <h1 id="stats-title" className="text-3xl font-bold tracking-tight sm:text-4xl">링크 통계</h1>
            <p className="mt-3 break-keep text-sm leading-6 text-muted-foreground">내 링크가 얼마나 많이 열렸는지 확인하세요. 소유자가 누른 클릭은 집계에서 제외됩니다.</p>
            {!loading && !error && <div className="mt-8 border-t border-border pt-5">
              <p className="flex items-center gap-2 text-sm font-medium text-muted-foreground"><MousePointer2 className="size-4" aria-hidden="true" />총 클릭 수</p>
              <p className="mt-2 break-all text-5xl font-bold text-blue-600 dark:text-blue-400 tracking-tight tabular-nums sm:text-6xl">{number.format(total)}<span className="ml-2 text-xl font-semibold text-card-foreground">회</span></p>
            </div>}
          </div>
        </section>

        {loading ? (
          <Card><CardContent><p role="status" className="text-sm text-muted-foreground">통계를 불러오는 중…</p></CardContent></Card>
        ) : error ? (
          <Card><CardContent><p role="alert" className="text-sm text-destructive">{error}</p></CardContent></Card>
        ) : <>
          <div className="grid gap-4 sm:grid-cols-2">
            <Card className="gap-3">
              <CardHeader><CardTitle className="flex items-center gap-2 text-sm text-muted-foreground"><Link2 className="size-4 text-blue-600 dark:text-blue-400" aria-hidden="true" />등록한 링크</CardTitle></CardHeader>
              <CardContent><p className="text-2xl font-bold tabular-nums">{number.format(data.length)}<span className="ml-1 text-base font-medium text-muted-foreground">개</span></p></CardContent>
            </Card>
            <Card className="gap-3">
              <CardHeader><CardTitle className="flex items-center gap-2 text-sm text-muted-foreground"><Trophy className="size-4 text-amber-600 dark:text-amber-400" aria-hidden="true" />가장 많이 열린 링크</CardTitle></CardHeader>
              <CardContent>
                <p className="break-words text-lg font-bold">{leader?.title ?? "아직 클릭이 없어요"}</p>
                {leader && <p className="mt-1 text-sm text-muted-foreground">{number.format(leader.clicks)}회 클릭</p>}
              </CardContent>
            </Card>
          </div>

          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle className="text-lg">링크별 클릭 수</CardTitle>
              <CardDescription>{data.length > 8 ? "클릭 수가 많은 링크 8개를 차트로 보여줘요." : "클릭 수가 많은 순서대로 비교해 보세요."}</CardDescription>
            </CardHeader>
            <CardContent>
              {data.length === 0 ? (
                <div className="grid place-items-center gap-3 rounded-2xl border border-dashed px-4 py-10 text-center">
                  <Link2 className="size-6 text-muted-foreground" aria-hidden="true" />
                  <p className="font-semibold">아직 등록된 링크가 없어요</p>
                  <Button asChild variant="outline"><Link href="/links">링크 추가하러 가기</Link></Button>
                </div>
              ) : (
                <>
                  <div className="rounded-2xl bg-muted/50 px-2 py-4 sm:px-4">
                    <ChartContainer config={chartConfig} className="aspect-auto min-h-48 w-full" style={{ height: Math.max(192, chartData.length * 40 + 32) }}>
                      <BarChart accessibilityLayer data={chartData} layout="vertical" margin={{ right: 16 }}>
                        <CartesianGrid horizontal={false} strokeDasharray="4 4" />
                        <XAxis type="number" allowDecimals={false} tickLine={false} axisLine={false} domain={[0, (max: number) => Math.max(1, max)]} />
                        <YAxis type="category" dataKey="id" width={92} tickLine={false} axisLine={false}
                          tickFormatter={(id: string) => { const title = titles.get(id) ?? ""; return title.length > 9 ? title.slice(0, 9) + "…" : title; }} />
                        <ChartTooltip content={<ChartTooltipContent labelFormatter={(_, payload) => payload[0]?.payload?.title} />} />
                        <Bar dataKey="clicks" fill="var(--color-clicks)" radius={[0, 6, 6, 0]} maxBarSize={22} />
                      </BarChart>
                    </ChartContainer>
                  </div>
                  <div className="mt-6">
                    <div className="flex justify-between border-b pb-2 text-xs font-semibold text-muted-foreground"><span>링크 순위</span><span>누적 클릭</span></div>
                    <ol className="divide-y text-sm" aria-label="링크 클릭 순위">
                      {data.map((item, index) => (
                        <li key={item.id} className="flex items-center gap-3 py-3">
                          <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-muted text-xs font-semibold tabular-nums text-muted-foreground" aria-hidden="true">{index + 1}</span>
                          <span className="min-w-0 flex-1 break-words font-medium">{item.title}</span>
                          <span className="shrink-0 font-semibold tabular-nums">{number.format(item.clicks)}회</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </>}
      </div>
    </main>
  );
}
