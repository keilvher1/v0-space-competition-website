import type { Metadata } from "next"
import Link from "next/link"
import { SiteHeader } from "@/components/site/site-header"
import { SiteFooter } from "@/components/site/site-footer"
import { PageHero } from "@/components/site/page-hero"
import { ArrowRight } from "@/components/site/icons"
import { getAnnouncements, getSiteSettings } from "@/lib/cms/queries"
import { formatDate } from "@/lib/utils"

export const revalidate = 300
export const metadata: Metadata = { title: "공지사항" }

export default async function AnnouncementsPage() {
  const [settings, announcements] = await Promise.all([getSiteSettings(), getAnnouncements()])
  const hero = settings.pages.announcements

  return (
    <>
      <SiteHeader />
      <main id="main">
        <PageHero eyebrow={hero.eyebrow} title={hero.title} description={hero.description} />
        <section className="bg-paper py-12 md:py-16">
          <div className="site-container">
            {announcements.length > 0 ? (
              <ul className="border-t-2 border-ink">
                {announcements.map((announcement) => {
                  const date = announcement.publishedAt ?? announcement.createdAt
                  return (
                    <li key={announcement.id}>
                      <Link
                        href={`/announcements/${announcement.id}`}
                        className="group grid gap-2 border-b-2 border-ink px-2 py-7 transition-colors hover:bg-cream md:grid-cols-[8.5rem_1fr_auto] md:items-center md:gap-8 md:px-4"
                      >
                        <time dateTime={date} className="font-display text-sm font-bold text-ink-soft">
                          {formatDate(date)}
                        </time>
                        <span>
                          {announcement.featured && <span className="chip chip-dot mb-2 bg-cream text-xs">중요</span>}
                          <strong className="block text-xl font-extrabold tracking-[-0.03em] md:text-2xl">
                            {announcement.title}
                          </strong>
                          {announcement.excerpt && <span className="mt-1 block text-ink-soft">{announcement.excerpt}</span>}
                        </span>
                        <ArrowRight className="hidden size-7 transition-transform group-hover:translate-x-1 md:block" />
                      </Link>
                    </li>
                  )
                })}
              </ul>
            ) : (
              <div className="border-2 border-ink bg-cream p-10 text-center">
                <p className="text-xl font-extrabold">아직 공지사항이 없습니다</p>
                <p className="mt-2 text-ink-soft">새로운 소식이 올라오면 여기에 표시됩니다.</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
