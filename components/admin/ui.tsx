import type React from "react"
import Link from "next/link"

export function PageHeader({
  title,
  description,
  action,
  back,
}: {
  title: string
  description?: React.ReactNode
  action?: { href: string; label: string }
  back?: { href: string; label: string }
}) {
  return (
    <div className="mb-6 md:mb-8">
      {back && (
        <Link href={back.href} className="mb-3 inline-block text-sm font-bold text-ink-soft hover:text-ink">
          ← {back.label}
        </Link>
      )}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[1.75rem] leading-tight font-black tracking-[-0.04em] md:text-3xl">{title}</h1>
          {description && <p className="mt-1.5 max-w-[60ch] text-sm leading-relaxed text-ink-soft">{description}</p>}
        </div>
        {action && (
          <Link href={action.href} className="btn btn-coral min-h-11 px-4 py-2 text-[15px]">
            {action.label}
          </Link>
        )}
      </div>
    </div>
  )
}

export function Badge({ children, tone = "default" }: { children: React.ReactNode; tone?: "default" | "on" | "off" | "warn" }) {
  const cls = {
    default: "border-line bg-white text-ink",
    on: "border-emerald-300 bg-emerald-50 text-emerald-800",
    off: "border-line bg-[#efe8d6] text-ink-soft",
    warn: "border-amber-300 bg-amber-50 text-amber-800",
  }[tone]
  return <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-bold whitespace-nowrap ${cls}`}>{children}</span>
}

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-lg border border-line bg-white ${className}`}>{children}</div>
}

/** 목록 화면의 한 줄: 제목·보조 정보·배지 + 편집 링크 */
export function Row({ href, title, meta, badges, leading }: {
  href: string
  title: string
  meta?: React.ReactNode
  badges?: React.ReactNode
  leading?: React.ReactNode
}) {
  return (
    <li>
      <Link href={href} className="flex items-center gap-4 px-4 py-4 transition hover:bg-cream/60">
        {leading}
        <div className="min-w-0 flex-1">
          <p className="truncate font-extrabold">{title}</p>
          {meta && <p className="mt-0.5 truncate text-sm text-ink-soft">{meta}</p>}
        </div>
        <div className="hidden shrink-0 gap-1.5 sm:flex">{badges}</div>
        <span aria-hidden="true" className="text-ink-soft">
          →
        </span>
      </Link>
    </li>
  )
}

export function EmptyState({ children }: { children: React.ReactNode }) {
  return <p className="px-4 py-10 text-center text-sm text-ink-soft">{children}</p>
}

/** 편집 화면 머리말에 넣는 '사이트에서 보기' 링크. 비공개면 주소만 보여준다. */
export function SiteLink({ href, published }: { href: string; published: boolean }) {
  if (!published) return <>사이트 주소: {href} (비공개 — 공개하면 사이트에 나타납니다)</>
  return (
    <>
      사이트 주소:{" "}
      <a href={href} target="_blank" rel="noopener noreferrer" className="font-bold text-ink underline underline-offset-4">
        {href} ↗
      </a>
    </>
  )
}
