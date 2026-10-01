import type { ReactNode } from "react";
import styles from "./page.module.css";

type IconName = "code" | "github" | "folder" | "book" | "arrow";

// Outline icons use the guide's 24px grid and 1.5px currentColor stroke.
function Icon({ name }: { name: IconName }) {
  const paths: Record<IconName, ReactNode> = {
    code: <><path d="m8 7-5 5 5 5m8-10 5 5-5 5M14 4l-4 16" /></>,
    github: <><path d="M9 19c-4 1-4-2-6-2m6 5v-3.9a3.4 3.4 0 0 1 1-2.6c-3.3-.4-6.8-1.6-6.8-7A5.5 5.5 0 0 1 4.7 4.7 5.1 5.1 0 0 1 4.8 1s1.3-.4 4.2 1.6a14.4 14.4 0 0 1 7.6 0C19.5.6 20.8 1 20.8 1a5.1 5.1 0 0 1 .1 3.7 5.5 5.5 0 0 1 1.5 3.8c0 5.4-3.5 6.6-6.8 7a3.4 3.4 0 0 1 1 2.6V22" transform="translate(1 1) scale(.9)" /></>,
    folder: <path d="M3 7V5a2 2 0 0 1 2-2h5l2 3h7a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" />,
    book: <><path d="M4 19.5V5a2 2 0 0 1 2-2h14v19H6a2.5 2.5 0 0 1 0-5h14M8 7h8M8 11h5" /></>,
    arrow: <><path d="M5 12h14m-6-6 6 6-6 6" /></>,
  };
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

const techStacks = ["TypeScript", "React", "Next.js", "Tailwind CSS", "Node.js", "Git"];
const links: { title: string; description: string; href?: string; icon: IconName }[] = [
  { title: "프로젝트와 포트폴리오", description: "주요 프로젝트와 작업물을 모으고 있어요", icon: "folder" },
  { title: "기술 블로그", description: "배운 점과 문제를 해결한 과정을 기록해요", icon: "book" },
];

export default function ProfilePage() {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.topBar}>
          <a className={styles.wordmark} href="#profile" aria-label="Jyowoo 프로필로 이동">jyowoo<span aria-hidden="true">.</span></a>
          <span className={styles.topLabel}>개발자 프로필</span>
        </header>

        <article id="profile" className={styles.profile} aria-labelledby="profile-name">
          <div className={styles.profileHeader}>
            <div className={styles.avatar} aria-hidden="true"><Icon name="code" /></div>
            <span className={styles.role}>프론트엔드 · 소프트웨어 개발자</span>
          </div>
          <p className={styles.greeting}>안녕하세요,</p>
          <h1 id="profile-name" className={styles.name}>개발자 Jyowoo예요</h1>
          <p className={styles.bio}>사용자 경험을 깊이 고민하고<br className={styles.desktopBreak} /> 직관적인 웹 인터페이스를 만들어요.</p>
          <p className={styles.detail}>새로운 기술을 탐구하고 코드로 문제를 해결하는 것을 좋아해요.</p>
          <a className={styles.primaryButton} href="https://github.com/Jyowoo" target="_blank" rel="noopener noreferrer">
            <Icon name="github" /><span>GitHub에서 작업 보기</span><Icon name="arrow" />
          </a>
        </article>

        <section className={styles.stack} aria-labelledby="stack-title">
          <div className={styles.sectionHeader}><h2 id="stack-title">주로 사용하는 기술</h2><span>기술 스택</span></div>
          <ul className={styles.chips} aria-label="기술 스택">
            {techStacks.map((tech) => <li key={tech}>{tech}</li>)}
          </ul>
        </section>

        <section className={styles.links} aria-labelledby="links-title">
          <div className={styles.sectionHeader}><h2 id="links-title">더 알아보기</h2><span>작업과 이야기</span></div>
          <ul className={styles.linkList}>
            {links.map((link) => {
              const content = <><span className={styles.linkIcon}><Icon name={link.icon} /></span><span className={styles.linkCopy}><span className={styles.linkTitle}>{link.title}</span><span className={styles.linkDescription}>{link.description}</span></span>{link.href ? <span className={styles.linkArrow}><Icon name="arrow" /></span> : <span className={styles.badge}>준비 중</span>}</>;
              return <li key={link.title}>{link.href ? <a className={styles.linkRow} href={link.href}>{content}</a> : <div className={styles.linkRow}>{content}</div>}</li>;
            })}
          </ul>
        </section>

        <footer className={styles.footer}><span>© 2026 Jyowoo</span><span>좋은 경험을 만드는 일을 좋아해요</span></footer>
      </div>
    </main>
  );
}
