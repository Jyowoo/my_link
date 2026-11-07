import { pageMetadata } from "@/lib/seo";
import { LinkStats } from "@/components/links/link-stats";

export const metadata = pageMetadata({
  title: "링크 통계 | 마이링크",
  description: "내 링크의 총 클릭 수와 링크별 방문자 클릭 순위를 확인하세요.",
});

export default function StatsPage() {
  return <LinkStats />;
}
