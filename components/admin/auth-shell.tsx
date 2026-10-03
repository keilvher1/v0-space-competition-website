import type React from "react"
import Link from "next/link"

export function AuthShell({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <main className="starfield grid min-h-screen place-items-center bg-ink px-5 py-12">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-8 flex items-center justify-center gap-2.5 text-cream">
          <img src="/icon.svg" alt="" width={36} height={36} className="size-9" />
          <span className="text-lg font-extrabold tracking-[-0.03em]">우주최고실패대회</span>
        </Link>
        <div className="border-2 border-ink bg-paper p-6 shadow-[8px_8px_0_var(--coral)] sm:p-8">
          <p className="eyebrow text-coral-deep">Admin</p>
          <h1 className="mt-2 text-3xl font-black tracking-[-0.04em]">{title}</h1>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">{description}</p>
          <div className="mt-7">{children}</div>
        </div>
      </div>
    </main>
  )
}
