export default function ProfilePage() {
  const techStacks = [
    "TypeScript",
    "React",
    "Next.js",
    "Tailwind CSS",
    "Node.js",
    "Git",
  ];

  const links = [
    {
      title: "GitHub",
      description: "소스 코드 & 오픈소스 프로젝트 둘러보기",
      href: "https://github.com/Jyowoo",
      isPrimary: true,
      icon: (
        <svg
          className="w-5 h-5 shrink-0"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      title: "Projects & Portfolio",
      description: "진행했던 주요 프로젝트와 작업물",
      href: "#",
      isPrimary: false,
      icon: (
        <svg
          className="w-5 h-5 shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
          />
        </svg>
      ),
    },
    {
      title: "Tech Blog",
      description: "배운 점과 트러블슈팅 경험을 정리하는 기록 공간",
      href: "#",
      isPrimary: false,
      icon: (
        <svg
          className="w-5 h-5 shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
          />
        </svg>
      ),
    },
    {
      title: "Contact",
      description: "협업 제안이나 커피챗은 언제든 환영합니다",
      href: "mailto:jch980324@gmail.com",
      isPrimary: false,
      icon: (
        <svg
          className="w-5 h-5 shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
    },
  ];

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-6 bg-gradient-to-b from-zinc-50 via-zinc-100 to-zinc-200 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
      <div className="w-full max-w-md rounded-3xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md p-6 sm:p-8 shadow-xl shadow-zinc-200/50 dark:shadow-none border border-zinc-200/70 dark:border-zinc-800 flex flex-col items-center text-center">
        {/* 프로필 이미지 / 아바타 영역 */}
        <div className="relative mb-5">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-zinc-800 to-zinc-600 dark:from-zinc-700 dark:to-zinc-500 p-0.5 shadow-md">
            <div className="w-full h-full rounded-full bg-white dark:bg-zinc-900 flex items-center justify-center text-zinc-900 dark:text-zinc-100 font-mono font-bold text-2xl">
              &lt;Dev/&gt;
            </div>
          </div>
          {/* 상태 표시 뱃지 */}
          <span
            className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-zinc-900 rounded-full"
            title="현재 활동 중"
          />
        </div>

        {/* 이름 및 직무 */}
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
            Jyowoo
          </h1>
          <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-zinc-200/60 dark:border-zinc-700">
            Dev
          </span>
        </div>

        <p className="mt-1 text-sm font-medium text-emerald-600 dark:text-emerald-400">
          Frontend &amp; Software Developer
        </p>

        {/* 개발자 소개글 */}
        <div className="mt-3.5 px-2">
          <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 break-keep">
            사용자 경험을 깊이 고민하고 직관적인 웹 인터페이스를 만듭니다.
            새로운 기술을 탐구하고 코드로 일상의 문제를 해결하는 것을 좋아합니다.
          </p>
        </div>

        {/* 기술 스택 칩 목록 */}
        <div className="flex flex-wrap justify-center gap-1.5 mt-5">
          {techStacks.map((tech) => (
            <span
              key={tech}
              className="text-xs font-mono px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 border border-zinc-200/80 dark:border-zinc-800 transition hover:scale-105"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* 구분선 */}
        <div className="w-full border-t border-zinc-200/60 dark:border-zinc-800/80 my-6" />

        {/* 링크 목록 */}
        <div className="w-full flex flex-col gap-3">
          {links.map((link) => (
            <a
              key={link.title}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className={`group flex items-center justify-between p-3.5 rounded-2xl border transition-all duration-200 ${
                link.isPrimary
                  ? "bg-zinc-900 text-white border-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:border-zinc-100 dark:hover:bg-zinc-200 shadow-sm"
                  : "bg-white/60 dark:bg-zinc-800/40 text-zinc-800 dark:text-zinc-200 border-zinc-200/90 dark:border-zinc-700/60 hover:bg-zinc-50 dark:hover:bg-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-600 shadow-xs"
              }`}
            >
              <div className="flex items-center gap-3 text-left">
                <span
                  className={`p-2 rounded-xl ${
                    link.isPrimary
                      ? "bg-zinc-800 text-white dark:bg-zinc-200 dark:text-zinc-900"
                      : "bg-zinc-100 text-zinc-700 dark:bg-zinc-700/60 dark:text-zinc-300 group-hover:bg-zinc-200/80 dark:group-hover:bg-zinc-700"
                  } transition-colors`}
                >
                  {link.icon}
                </span>
                <div>
                  <div className="text-sm font-semibold tracking-tight">
                    {link.title}
                  </div>
                  <div
                    className={`text-xs ${
                      link.isPrimary
                        ? "text-zinc-300 dark:text-zinc-600"
                        : "text-zinc-500 dark:text-zinc-400"
                    }`}
                  >
                    {link.description}
                  </div>
                </div>
              </div>
              <svg
                className={`w-4 h-4 ml-2 transition-transform duration-200 group-hover:translate-x-1 ${
                  link.isPrimary
                    ? "text-zinc-400 dark:text-zinc-500"
                    : "text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-600 dark:group-hover:text-zinc-300"
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </a>
          ))}
        </div>

        {/* 푸터 */}
        <p className="mt-8 text-xs text-zinc-400 dark:text-zinc-500 font-mono">
          © 2026 Jyowoo. All rights reserved.
        </p>
      </div>
    </main>
  );
}
