"use client";

import { Toaster as Sonner } from "sonner";

export function Toaster() {
  return <Sonner
    theme="system"
    position="top-center"
    richColors
    closeButton
    toastOptions={{
      style: { fontFamily: "var(--font-pretendard), sans-serif" },
      classNames: {
        toast: "p-5! shadow-lg!",
        title: "text-base! font-bold! leading-6!",
        description: "text-sm! font-medium! leading-6! text-inherit! opacity-100!",
      },
    }}
  />;
}
