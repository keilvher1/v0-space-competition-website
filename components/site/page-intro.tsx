import type React from "react"

// 공지사항·FAQ 같은 하위 페이지의 상단 제목 영역
export function PageIntro({ eyebrow, title, children }: { eyebrow: string; title: string; children?: React.ReactNode }) {
  return (
    <section className="border-b-2 border-ink bg-cream">
      <div className="site-container py-14 md:py-20">
        <p className="eyebrow text-coral-deep">{eyebrow}</p>
        <h1 className="mt-3 text-[clamp(2.5rem,6vw,4.5rem)] leading-tight font-black tracking-[-0.05em]">{title}</h1>
        {children && <div className="mt-4 text-lg text-ink-soft">{children}</div>}
      </div>
    </section>
  )
}
