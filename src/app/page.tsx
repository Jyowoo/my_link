import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import { HomeExperience } from "@/components/home/home-experience";
import { LandingPage } from "@/components/home/landing-page";
import { AuthControls, ManageLinksButton, UserProfile } from "@/components/auth/auth-controls";
import { ProfileLinks } from "@/components/links/profile-links";
import styles from "./page.module.css";

export const metadata = pageMetadata({
  title: "마이링크 — 나를 보여주는 단 하나의 링크",
  description: "포트폴리오, 블로그, SNS 링크를 한 페이지에 모으고 내 주소로 공유하세요. 마이링크에서 방문자 클릭 통계도 확인할 수 있어요.",
  canonical: "/",
});

export default function ProfilePage() {
  return <HomeExperience landing={<LandingPage />}><main className={styles.page}>
    <div className={styles.container}>
      <header className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <Link className={styles.wordmark} href="/">mylink<span aria-hidden="true">.</span></Link>
        <AuthControls />
      </header>
      <article className={styles.profile}><UserProfile /></article>
      <section className={styles.links} aria-labelledby="links-title">
        <div className={styles.sectionHeader}><h2 id="links-title">더 알아보기</h2><ManageLinksButton /></div>
        <ProfileLinks showClickCount />
      </section>
      <footer className={styles.footer}><span>© 2026 mylink</span><span>나만의 이야기를 담은 링크</span></footer>
    </div>
  </main></HomeExperience>;
}
