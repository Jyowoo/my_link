import { ogSize, renderOgImage } from "@/lib/og-image";

export const alt = "마이링크 — 나를 보여주는 단 하나의 링크";
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return renderOgImage();
}
