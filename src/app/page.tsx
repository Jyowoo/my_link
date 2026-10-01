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
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-12 sm:px-6 md:py-16 lg:py-20">
      {/* ── Animated gradient background ── */}
      <div
        className="pointer-events-none fixed inset-0 -z-10 animate-gradient bg-[length:300%_300%]"
        style={{
          backgroundImage:
            "linear-gradient(135deg, #e0e7ff 0%, #f0fdf4 25%, #fdf2f8 50%, #ecfeff 75%, #ede9fe 100%)",
        }}
      />
      {/* dark overlay */}
      <div className="pointer-events-none fixed inset-0 -z-10 bg-zinc-950/0 dark:bg-zinc-950/80" />

      {/* ── Decorative blobs ── */}
      <div className="pointer-events-none fixed top-[-20%] left-[-10%] -z-[5] h-[500px] w-[500px] rounded-full bg-violet-300/30 blur-3xl dark:bg-violet-800/15" />
      <div className="pointer-events-none fixed bottom-[-15%] right-[-10%] -z-[5] h-[450px] w-[450px] rounded-full bg-cyan-300/30 blur-3xl dark:bg-cyan-800/15" />

      {/* ── Main card ── */}
      <div className="w-full max-w-md md:max-w-lg animate-fade-in-up rounded-[2rem] bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl p-6 sm:p-8 md:p-10 shadow-2xl shadow-zinc-300/40 dark:shadow-black/30 border border-white/60 dark:border-zinc-800/80 flex flex-col items-center text-center">
        {/* ── Avatar ── */}
        <div className="relative mb-6">
          {/* Spinning gradient ring */}
          <div className="absolute -inset-1 rounded-full bg-[conic-gradient(from_0deg,#6366f1,#06b6d4,#10b981,#f59e0b,#ef4444,#6366f1)] animate-ring-spin opacity-70 blur-[2px]" />
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white dark:bg-zinc-900 p-1 shadow-lg">
            <div className="w-full h-full rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-mono font-bold text-xl sm:text-2xl select-none">
              &lt;Dev/&gt;
            </div>
          </div>
          {/* Status dot */}
          <span
            className="absolute bottom-1 right-1 sm:bottom-1.5 sm:right-1.5 w-4 h-4 sm:w-5 sm:h-5 bg-emerald-500 border-[2.5px] border-white dark:border-zinc-900 rounded-full animate-pulse-soft"
            title="현재 활동 중"
          />
        </div>

        {/* ── Name & role ── */}
        <div className="flex items-center gap-2.5">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
            Jyowoo
          </h1>
          <span className="text-[11px] sm:text-xs px-2.5 py-1 rounded-full font-semibold bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200/70 dark:border-indigo-500/30">
            Dev
          </span>
        </div>

        <p className="mt-1.5 text-sm sm:text-base font-medium bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          Frontend &amp; Software Developer
        </p>

        {/* ── Bio ── */}
        <div className="mt-4 px-2 sm:px-4">
          <p className="text-sm sm:text-[0.9375rem] leading-relaxed text-zinc-600 dark:text-zinc-400 break-keep">
            사용자 경험을 깊이 고민하고 직관적인 웹 인터페이스를 만듭니다.
            새로운 기술을 탐구하고 코드로 일상의 문제를 해결하는 것을
            좋아합니다.
          </p>
        </div>

        {/* ── Tech stack chips ── */}
        <div className="flex flex-wrap justify-center gap-2 mt-5 sm:mt-6">
          {techStacks.map((tech) => (
            <span
              key={tech}
              className="text-xs font-mono px-3 py-1.5 rounded-full bg-zinc-100/80 dark:bg-zinc-800/60 text-zinc-700 dark:text-zinc-300 border border-zinc-200/80 dark:border-zinc-700/60 transition-all duration-200 hover:scale-105 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-400 dark:hover:border-indigo-500/30 cursor-default"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* ── Divider ── */}
        <div className="w-16 sm:w-20 h-0.5 rounded-full bg-gradient-to-r from-transparent via-zinc-300 dark:via-zinc-700 to-transparent my-7 sm:my-8" />

        {/* ── Links ── */}
        <div className="w-full flex flex-col gap-3">
          {links.map((link, idx) => (
            <a
              key={link.title}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={
                link.href.startsWith("http") ? "noopener noreferrer" : undefined
              }
              className={`group flex items-center justify-between p-3.5 sm:p-4 rounded-2xl border transition-all duration-300 ${
                link.isPrimary
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-transparent hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 dark:shadow-indigo-500/15 dark:hover:shadow-indigo-500/30 hover:-translate-y-0.5"
                  : "bg-white/60 dark:bg-zinc-800/40 text-zinc-800 dark:text-zinc-200 border-zinc-200/80 dark:border-zinc-700/50 hover:bg-white hover:border-zinc-300 dark:hover:bg-zinc-800/70 dark:hover:border-zinc-600 shadow-sm hover:shadow-md hover:-translate-y-0.5"
              }`}
              style={{ animationDelay: `${idx * 80}ms` }}
            >
              <div className="flex items-center gap-3 text-left">
                <span
                  className={`p-2.5 rounded-xl transition-all duration-300 ${
                    link.isPrimary
                      ? "bg-white/20 text-white group-hover:bg-white/30"
                      : "bg-zinc-100 text-zinc-600 dark:bg-zinc-700/50 dark:text-zinc-300 group-hover:bg-indigo-50 group-hover:text-indigo-600 dark:group-hover:bg-indigo-500/10 dark:group-hover:text-indigo-400"
                  }`}
                >
                  {link.icon}
                </span>
                <div>
                  <div className="text-sm sm:text-[0.9375rem] font-semibold tracking-tight">
                    {link.title}
                  </div>
                  <div
                    className={`text-xs sm:text-[0.8125rem] mt-0.5 ${
                      link.isPrimary
                        ? "text-indigo-100/80"
                        : "text-zinc-500 dark:text-zinc-400"
                    }`}
                  >
                    {link.description}
                  </div>
                </div>
              </div>
              <svg
                className={`w-4 h-4 sm:w-5 sm:h-5 ml-2 shrink-0 transition-transform duration-300 group-hover:translate-x-1 ${
                  link.isPrimary
                    ? "text-indigo-200"
                    : "text-zinc-400 dark:text-zinc-500 group-hover:text-indigo-500 dark:group-hover:text-indigo-400"
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

        {/* ── Footer ── */}
        <p className="mt-8 sm:mt-10 text-xs text-zinc-400 dark:text-zinc-500 font-mono tracking-wide">
          © 2026 Jyowoo
        </p>
      </div>
    </main>
  );
}
