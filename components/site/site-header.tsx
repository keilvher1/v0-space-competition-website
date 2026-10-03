import Link from "next/link"
import { getAnnouncements, getCurrentEdition } from "@/lib/cms/queries"
import { dDayLabel, editionStatus } from "@/lib/cms/utils"
import { editionHref } from "@/lib/cms/links"
import { ArrowRight } from "./icons"

export async function SiteHeader() {
  const [edition, announcements] = await Promise.all([getCurrentEdition(), getAnnouncements()])
  const nav = [
    { href: "/#about", label: "소개" },
    { href: "/#archive", label: "역대 대회" },
    { href: "/#records", label: "기록" },
    ...(announcements.length > 0 ? [{ href: "/announcements", label: "공지사항" }] : []),
    { href: "/faq", label: "FAQ" },
  ]

  const href = editionHref(edition)
  const recruiting = editionStatus(edition) === "recruiting"
  const cta = recruiting
    ? { href: `${href}#apply`, label: `제${edition.number}회 신청`, badge: dDayLabel(edition.data.deadline) ?? "" }
    : { href, label: `제${edition.number}회 대회`, badge: null }

  return (
    <header className="sticky top-0 z-50 border-b-2 border-ink bg-paper/95 backdrop-blur-sm">
      <div className="site-container flex h-16 items-center gap-6 md:h-[72px]">
        <Link href="/" className="flex shrink-0 items-center gap-2.5" aria-label="우주최고실패대회 처음으로">
          <img src="/icon.svg" alt="" width={32} height={32} className="size-8" />
          <span className="text-[17px] font-extrabold tracking-[-0.03em] md:text-lg">우주최고실패대회</span>
        </Link>
        <nav aria-label="주요 메뉴" className="ml-auto hidden items-center gap-7 text-[15px] font-semibold lg:flex">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="decoration-coral decoration-2 underline-offset-8 hover:underline">
              {item.label}
            </Link>
          ))}
        </nav>
        <Link href={cta.href} className="btn btn-coral ml-auto min-h-11 gap-3 px-3.5 py-2 text-sm md:text-[15px] lg:ml-2">
          <span className="whitespace-nowrap">
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
        {nav.map((item) => (
          <Link key={item.href} href={item.href} className="py-1">
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  )
}
