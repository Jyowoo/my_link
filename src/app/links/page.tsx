import type { Metadata } from "next";
import { LinksList } from "@/components/links/links-list";

export const metadata: Metadata = {
  title: "링크 모음 | 마이링크",
  description: "작업과 기록, 일상을 만나는 마이링크 링크 모음입니다.",
};

export default function LinksPage() {
  return <LinksList />;
}
