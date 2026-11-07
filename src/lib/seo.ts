import type { Metadata } from "next";

type PageSeo = { title: string; description: string; canonical?: string; username?: string };

export function pageMetadata({ title, description, canonical, username }: PageSeo): Metadata {
  const social = { title, description, siteName: "마이링크", locale: "ko_KR", url: canonical };
  return {
    title,
    description,
    ...(canonical ? { alternates: { canonical } } : { robots: { index: false, follow: false } }),
    openGraph: username ? { ...social, type: "profile", username } : {
      ...social,
      type: "website",
      // A child Open Graph object replaces the inherited one, including the root image.
      ...(!canonical && { images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "마이링크 — 나를 보여주는 단 하나의 링크" }] }),
    },
    twitter: { card: "summary_large_image", title, description },
  };
}
