import Link from "next/link"
import { getAnnouncements, getEditions, getSiteSettings } from "@/lib/cms/queries"
import { EditionLink } from "./edition-link"

export async function SiteFooter() {
  const [settings, editions, announcements] = await Promise.all([getSiteSettings(), getEditions(), getAnnouncements()])

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
            <ul className="mt-3 grid gap-0.5">
              {editions.map((edition) => (
                <li key={edition.id}>
                  <EditionLink edition={edition} className="inline-flex min-h-10 items-center gap-1.5 hover:underline">
                    {edition.data.title} <span className="font-display text-cream/60">{edition.year}</span>
                  </EditionLink>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow text-cream/60">News</p>
            <ul className="mt-3 grid gap-0.5">
              {announcements.length > 0 && (
                <li>
                  <Link href="/announcements" className="inline-flex min-h-10 items-center hover:underline">
                    공지사항
                  </Link>
                </li>
              )}
              <li>
                <Link href="/faq" className="inline-flex min-h-10 items-center hover:underline">
                  자주 묻는 질문
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="eyebrow text-cream/60">Contact</p>
            <p className="mt-4">{settings.contact.label}</p>
            <a
              href={`mailto:${settings.contact.email}`}
              className="inline-flex min-h-10 items-center font-semibold break-all underline underline-offset-4"
            >
              {settings.contact.email}
            </a>
          </div>
          <div>
            <p className="eyebrow text-cream/60">Host</p>
            <p className="mt-4 leading-relaxed">{settings.host}</p>
          </div>
        </div>
        <div className="mt-14 flex flex-wrap items-center justify-between gap-4 text-[13px] text-cream/60">
          <p>{settings.copyright}</p>
          <Link href="/admin" prefetch={false} className="inline-flex min-h-11 min-w-11 items-center justify-center hover:text-cream hover:underline">
            관리자
          </Link>
        </div>
      </div>
    </footer>
  )
}
