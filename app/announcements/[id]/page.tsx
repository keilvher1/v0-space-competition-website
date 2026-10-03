import Link from "next/link"
import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { SiteHeader } from "@/components/site/site-header"
import { SiteFooter } from "@/components/site/site-footer"
import { formatDate } from "@/lib/utils"

export default async function AnnouncementDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: announcement } = await supabase
    .from("announcements")
    .select("*")
    .eq("id", id)
    .eq("is_published", true)
    .single()

  if (!announcement) {
    notFound()
  }

  const date = announcement.published_at ?? announcement.created_at

  return (
    <>
      <SiteHeader />
      <main className="bg-paper">
        <article className="site-container max-w-3xl py-14 md:py-20">
          <Link href="/announcements" className="text-link text-sm">
            ← 공지사항 목록
          </Link>
          <header className="mt-8 border-b-2 border-ink pb-8">
            {announcement.is_featured && <span className="chip chip-dot mb-4 bg-cream text-xs">중요</span>}
            <h1 className="text-[clamp(2rem,4.5vw,3.25rem)] leading-tight font-black tracking-[-0.045em]">
              {announcement.title}
            </h1>
            <time dateTime={date} className="mt-4 block font-display text-sm font-bold text-ink-soft">
              {formatDate(date)}
            </time>
          </header>
          <div
            className="mt-8 text-lg leading-[1.9] whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: announcement.content }}
          />
        </article>
      </main>
      <SiteFooter />
    </>
  )
}
