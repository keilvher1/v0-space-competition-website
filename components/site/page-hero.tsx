import type React from "react"

// FAQ·공지사항 같은 하위 페이지의 히어로. 메인과 같은 우주 배경에 큰 제목.
export function PageHero({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string
  title: string
  description?: string
  children?: React.ReactNode
}) {
  return (
    <section className="starfield on-dark relative overflow-hidden border-b-2 border-ink bg-ink text-cream">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -bottom-24 size-64 rounded-full border-2 border-cream bg-sky md:-right-10 md:-bottom-32 md:size-96"
      />
      <div aria-hidden="true" className="absolute top-10 right-[30%] hidden size-5 rounded-full border-2 border-cream bg-sun md:block" />
      <div className="site-container relative py-16 md:py-24">
        <p className="eyebrow text-cream/70">{eyebrow}</p>
        <h1 className="mt-5 max-w-[16ch] text-[clamp(2.75rem,8vw,6.5rem)] leading-[1.02] font-black tracking-[-0.045em]">
          {title}
        </h1>
        {description && <p className="mt-6 max-w-[40ch] text-lg leading-relaxed font-semibold text-cream/85 md:text-xl">{description}</p>}
        {children && <div className="mt-8 flex flex-wrap gap-4">{children}</div>}
      </div>
    </section>
  )
}
