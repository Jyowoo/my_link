import { pageMetadata } from "@/lib/seo";
import { LinksList } from "@/components/links/links-list";

export const metadata = pageMetadata({
  title: "링크 관리 | 마이링크",
  description: "내 마이링크에 표시할 링크를 추가하거나 수정하고, 링크별 클릭 수를 확인하세요.",
});

export default function LinksPage() {
  return <LinksList />;
}
