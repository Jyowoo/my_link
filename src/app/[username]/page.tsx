import Link from "next/link";
import { notFound } from "next/navigation";
import { AuthControls } from "@/components/auth/auth-controls";
import { LinkCard } from "@/components/links/link-card";
import { getPublicProfile } from "@/lib/public-profile";
import { UserRound } from "lucide-react";

export const dynamic = "force-dynamic";
export default async function PublicProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const profile = await getPublicProfile(username);
  if (!profile) notFound();
  return <main className="mx-auto min-h-screen w-full max-w-xl px-6 py-8">
    <header className="mb-8 flex flex-wrap items-center justify-between gap-3">
      <Link href="/" className="inline-flex min-h-11 items-center text-xl font-bold">mylink.</Link>
      <AuthControls />
    </header>
    <article className="rounded-2xl border bg-card p-6">
      <div className="flex items-center gap-4">
        <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-secondary">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {profile.photoURL ? <img src={profile.photoURL} alt="" referrerPolicy="no-referrer" className="size-full object-cover" /> : <UserRound aria-hidden="true" className="size-8" />}
        </div>
        <h1 className="min-w-0 break-words text-2xl font-bold">{profile.displayName}</h1>
      </div>
      {profile.bio && <p className="mt-4 whitespace-pre-wrap break-words leading-7">{profile.bio}</p>}
    </article>
    <section className="mt-8" aria-labelledby="public-links-title">
      <h2 id="public-links-title" className="mb-5 text-lg font-bold">더 알아보기</h2>
      <ul className="space-y-4">{profile.links.map((link) => <li key={link.id}><LinkCard ownerId={profile.uid} link={link} mode="view" /></li>)}</ul>
      {!profile.links.length && <p className="py-6 text-sm text-muted-foreground">아직 등록된 링크가 없어요.</p>}
    </section>
  </main>;
}
