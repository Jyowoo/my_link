export default function ProfilePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gradient-to-b from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-zinc-900">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-sm border border-zinc-200/80 dark:bg-zinc-900 dark:border-zinc-800 text-center flex flex-col items-center">
        {/* 프로필 아바타 */}
        <div className="w-24 h-24 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-3xl font-semibold text-zinc-700 dark:text-zinc-200 shadow-inner mb-5">
          홍
        </div>

        {/* 이름 */}
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
          홍길동
        </h1>

        {/* 소개글 */}
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          바이브코딩 베워보기
        </p>

        {/* 심플한 디바이더 */}
        <div className="w-full border-t border-zinc-100 dark:border-zinc-800 my-6" />

        {/* 링크 / 액션 버튼 예시 */}
        <div className="w-full flex flex-col gap-2.5">
          <a
            href="#"
            className="w-full py-2.5 px-4 rounded-xl text-sm font-medium bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-colors"
          >
            포트폴리오 보러가기
          </a>
          <a
            href="#"
            className="w-full py-2.5 px-4 rounded-xl text-sm font-medium border border-zinc-200 text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800/60 transition-colors"
          >
            연락하기
          </a>
        </div>
      </div>
    </main>
  );
}
