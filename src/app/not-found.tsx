import Link from "next/link";

export default function NotFound() {
  return <main className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center gap-4 px-6 text-center">
    <p className="text-sm font-semibold text-muted-foreground">404</p>
    <h1 className="text-2xl font-bold">페이지를 찾을 수 없어요</h1>
    <p className="text-muted-foreground">사용자가 없거나 이름이 변경되었을 수 있어요.</p>
    <Link href="/" className="inline-flex min-h-11 items-center font-semibold underline underline-offset-4">홈으로 돌아가기</Link>
  </main>;
}
