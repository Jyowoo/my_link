import { ogSize, renderOgImage } from "@/lib/og-image";
import { getPublicIdentity } from "@/lib/public-profile";

export const alt = "마이링크 공개 프로필";
export const size = ogSize;
export const contentType = "image/png";
export const dynamic = "force-dynamic";

export default async function Image({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const profile = await getPublicIdentity(username);
  if (!profile) return new Response(null, { status: 404 });
  return renderOgImage(profile);
}
