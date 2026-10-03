import Link from "next/link"
import { EDITIONS } from "@/lib/editions"
import { ANNOUNCEMENTS_ENABLED } from "@/lib/site"

export function SiteFooter() {
  return (
    <footer className="bg-ink text-cream">
      <div className="site-container py-16 md:py-20">
        <p className="text-[clamp(2.75rem,9vw,8.5rem)] leading-[1.02] font-black tracking-[-0.045em]">
          우주최고
          <br />
          <span className="lettering-shadow">실패</span>대회
        </p>
        <div className="mt-14 grid gap-10 border-t border-cream/25 pt-10 text-[15px] sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="eyebrow text-cream/60">Editions</p>
            <ul className="mt-4 space-y-2.5">
              {EDITIONS.map((edition) => (
                <li key={edition.year}>
                  <Link href={edition.href} className="hover:underline">
                    {edition.title} <span className="font-display text-cream/60">{edition.year}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow text-cream/60">News</p>
            <ul className="mt-4 space-y-2.5">
              {ANNOUNCEMENTS_ENABLED && (
                <li>
                  <Link href="/announcements" className="hover:underline">
                    공지사항
                  </Link>
                </li>
              )}
              <li>
                <Link href="/faq" className="hover:underline">
                  자주 묻는 질문
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="eyebrow text-cream/60">Contact</p>
            <p className="mt-4">행사 문의</p>
            <a href="mailto:jyjpeter79@gmail.com" className="mt-1 inline-block font-semibold underline underline-offset-4">
              jyjpeter79@gmail.com
            </a>
          </div>
          <div>
            <p className="eyebrow text-cream/60">Host</p>
            <p className="mt-4 leading-relaxed">한동대학교 IRIS · 심규진 교수 리빙랩 프로젝트</p>
          </div>
        </div>
        <div className="mt-14 flex flex-wrap items-center justify-between gap-4 text-[13px] text-cream/60">
          <p>© 2025–2026 우주최고실패대회</p>
          <Link href="/admin" className="hover:text-cream hover:underline">
            관리자
          </Link>
        </div>
      </div>
    </footer>
  )
}
