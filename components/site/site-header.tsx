import Link from "next/link"
import { CURRENT_EDITION, dDayLabel, editionStatus } from "@/lib/editions"
import { ANNOUNCEMENTS_ENABLED } from "@/lib/site"
import { ArrowRight } from "./icons"

const NAV = [
  { href: "/#about", label: "소개" },
  { href: "/#archive", label: "역대 대회" },
  { href: "/#records", label: "기록" },
  ...(ANNOUNCEMENTS_ENABLED ? [{ href: "/announcements", label: "공지사항" }] : []),
  { href: "/faq", label: "FAQ" },
]

function currentCta() {
  const edition = CURRENT_EDITION
  const status = editionStatus(edition)
  if (status === "recruiting") {
    return { href: `${edition.href}#apply`, label: `제${edition.number}회 신청`, badge: dDayLabel(edition.deadline) }
  }
  return { href: edition.href, label: `제${edition.number}회 대회`, badge: null }
}

export function SiteHeader() {
  const cta = currentCta()

  return (
    <header className="sticky top-0 z-50 border-b-2 border-ink bg-paper/95 backdrop-blur-sm">
      <div className="site-container flex h-16 items-center gap-6 md:h-[72px]">
        <Link href="/" className="flex shrink-0 items-center gap-2.5" aria-label="우주최고실패대회 처음으로">
          <img src="/icon.svg" alt="" width={32} height={32} className="size-8" />
          <span className="text-[17px] font-extrabold tracking-[-0.03em] md:text-lg">우주최고실패대회</span>
        </Link>
        <nav aria-label="주요 메뉴" className="ml-auto hidden items-center gap-7 text-[15px] font-semibold lg:flex">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="decoration-coral decoration-2 underline-offset-8 hover:underline">
              {item.label}
            </Link>
          ))}
        </nav>
        <Link href={cta.href} className="btn btn-coral ml-auto min-h-11 gap-3 px-3.5 py-2 text-sm md:text-[15px] lg:ml-2">
          <span>
            {cta.label}
            {cta.badge && <span className="ml-2 font-display text-[13px] tracking-wide">{cta.badge}</span>}
          </span>
          <ArrowRight />
        </Link>
      </div>
      <nav
        aria-label="주요 메뉴"
        className="flex gap-6 overflow-x-auto border-t border-line px-5 py-2.5 text-sm font-semibold whitespace-nowrap [scrollbar-width:none] lg:hidden"
      >
        {NAV.map((item) => (
          <Link key={item.href} href={item.href}>
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  )
}
