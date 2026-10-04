import Link from "next/link"
import { getAnnouncements, getCurrentEdition } from "@/lib/cms/queries"
import { dDayLabel, editionStatus } from "@/lib/cms/utils"
import { EditionLink } from "./edition-link"
import { ArrowRight } from "./icons"
import { NavLink } from "./nav-link"

export async function SiteHeader() {
  const [edition, announcements] = await Promise.all([getCurrentEdition(), getAnnouncements()])
  const nav = [
    { href: "/#about", label: "소개" },
    { href: "/#archive", label: "역대 대회" },
    { href: "/#records", label: "기록" },
    ...(announcements.length > 0 ? [{ href: "/announcements", label: "공지사항" }] : []),
    { href: "/faq", label: "FAQ" },
  ]

  const recruiting = editionStatus(edition) === "recruiting"
  const cta = recruiting
    ? { hash: "#apply", label: `제${edition.number}회 신청`, badge: dDayLabel(edition.data.deadline) }
    : { hash: "", label: `제${edition.number}회 대회`, badge: null }

  return (
    <>
      <a href="#main" className="skip-link">
        본문 바로가기
      </a>
      <header className="sticky top-0 z-50 border-b-2 border-ink bg-paper/95 backdrop-blur-sm">
        {/* 360px 이하 폰에서도 한 줄에 들어가도록 간격·글자 크기를 줄인다 */}
        <div className="site-container flex h-16 items-center gap-3 sm:gap-6 md:h-[72px]">
          <Link href="/" className="flex min-h-11 shrink-0 items-center gap-2 sm:gap-2.5" aria-label="우주최고실패대회 처음으로">
            <img src="/icon.svg" alt="" width={32} height={32} className="size-7 sm:size-8" />
            <span className="text-[15px] font-extrabold tracking-[-0.03em] min-[360px]:text-[17px] md:text-lg">우주최고실패대회</span>
          </Link>
          <nav aria-label="주요 메뉴" className="ml-auto hidden items-center gap-7 text-[15px] font-semibold lg:flex">
            {nav.map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                className="flex min-h-11 items-center decoration-coral decoration-2 underline-offset-8 hover:underline aria-[current=page]:underline"
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <EditionLink
            edition={edition}
            hash={cta.hash}
            className="btn btn-coral ml-auto min-h-11 gap-2 px-3 py-2 text-sm sm:gap-3 sm:px-3.5 md:text-[15px] lg:ml-2"
          >
            <span className="whitespace-nowrap">
              {cta.label}
              {cta.badge && <span className="ml-2 font-display text-[13px] tracking-wide">{cta.badge}</span>}
            </span>
            <ArrowRight className="max-[379px]:hidden" />
          </EditionLink>
        </div>
        <nav
          aria-label="주요 메뉴"
          className="flex gap-4 overflow-x-auto border-t border-line px-4 py-0.5 text-sm font-semibold whitespace-nowrap [scrollbar-width:none] sm:gap-6 sm:px-5 lg:hidden"
        >
          {nav.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              className="flex min-h-11 min-w-11 items-center justify-center px-1 decoration-coral decoration-2 underline-offset-[6px] aria-[current=page]:underline"
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>
    </>
  )
}
