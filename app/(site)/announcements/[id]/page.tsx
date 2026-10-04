import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { SiteHeader } from "@/components/site/site-header"
import { SiteFooter } from "@/components/site/site-footer"
import { Paragraphs } from "@/components/site/text"
import { getAnnouncement } from "@/lib/cms/queries"
import { formatDate } from "@/lib/utils"

export const revalidate = 300

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const announcement = await getAnnouncement((await params).id)
  return announcement ? { title: announcement.title, description: announcement.excerpt || undefined } : {}
}

export default async function AnnouncementDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const announcement = await getAnnouncement((await params).id)
  if (!announcement) notFound()

  const date = announcement.publishedAt ?? announcement.createdAt

  return (
    <>
      <SiteHeader />
      <main id="main" className="bg-paper">
        <article className="site-container max-w-3xl py-14 md:py-20">
          <Link href="/announcements" className="text-link text-sm">
            ← 공지사항 목록
          </Link>
          <header className="mt-8 border-b-2 border-ink pb-8">
            {announcement.featured && <span className="chip chip-dot mb-4 bg-cream text-xs">중요</span>}
            <h1 className="text-[clamp(2rem,4.5vw,3.25rem)] leading-tight font-black tracking-[-0.045em]">{announcement.title}</h1>
            <time dateTime={date} className="mt-4 block font-display text-sm font-bold text-ink-soft">
              {formatDate(date)}
            </time>
          </header>
          <div className="mt-8 space-y-5 text-lg leading-[1.9]">
            <Paragraphs text={announcement.body} linkify />
          </div>
        </article>
      </main>
      <SiteFooter />
    </>
  )
}
