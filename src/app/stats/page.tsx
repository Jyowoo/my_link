import type { Metadata } from "next";
import { LinkStats } from "@/components/links/link-stats";

export const metadata: Metadata = { title: "링크 통계 | 마이링크", robots: { index: false } };

export default function StatsPage() {
  return <LinkStats />;
}
