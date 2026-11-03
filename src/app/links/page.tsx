import type { Metadata } from "next";
import { LinksList } from "@/components/links/links-list";

export const metadata: Metadata = {
  title: "링크 관리 | 마이링크",
  description: "로그인한 사용자의 링크를 추가하고 관리하는 페이지입니다.",
};

export default function LinksPage() {
  return <LinksList />;
}
