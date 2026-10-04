import type { Metadata } from "next"
import { SiteHeader } from "@/components/site/site-header"
import { SiteFooter } from "@/components/site/site-footer"
import { PageHero } from "@/components/site/page-hero"
import { ArrowRight } from "@/components/site/icons"
import { getCurrentEdition, getEditions, getFaqs, getSiteSettings } from "@/lib/cms/queries"
import { EditionLink } from "@/components/site/edition-link"
import { editionStatus } from "@/lib/cms/utils"

export const revalidate = 300
export const metadata: Metadata = { title: "자주 묻는 질문" }

export default async function FAQPage() {
  const [settings, faqs, editions, current] = await Promise.all([
    getSiteSettings(),
    getFaqs(),
    getEditions(),
    getCurrentEdition(),
  ])
  const hero = settings.pages.faq

  // 회차별로 묶는다(회차 없음 = 일반 질문)
  const groups = new Map<number | null, typeof faqs>()
  for (const faq of faqs) groups.set(faq.editionNumber, [...(groups.get(faq.editionNumber) ?? []), faq])
  const ordered = [...groups.entries()].sort(([a], [b]) => (b ?? -1) - (a ?? -1))

  return (
    <>
      <SiteHeader />
      <main id="main">
        <PageHero eyebrow={hero.eyebrow} title={hero.title} description={hero.description}>
          {editionStatus(current) === "recruiting" && (
            <EditionLink edition={current} hash="#apply" className="btn btn-coral">
              제{current.number}회 참가·참관 신청 안내 <ArrowRight />
            </EditionLink>
          )}
        </PageHero>
        <section className="bg-paper py-14 md:py-20">
          <div className="site-container grid gap-14">
            {ordered.length > 0 ? (
              ordered.map(([number, items]) => {
                const edition = editions.find((e) => e.number === number)
                return (
                  <div key={number ?? "general"} className="grid gap-6 md:grid-cols-[14rem_1fr]">
                    <div>
                      <h2 className="text-2xl font-extrabold tracking-[-0.03em]">
                        {edition ? `제${edition.number}회 대회` : "일반"}
                      </h2>
                      {edition && <p className="mt-1 font-display text-sm font-bold text-ink-soft">{edition.year}</p>}
                    </div>
                    <div className="border-t-2 border-ink">
                      {items.map((faq) => (
                        <details key={faq.id} className="group border-b border-line">
                          <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 py-5 text-lg font-bold [&::-webkit-details-marker]:hidden">
                            {faq.question}
                            <span
                              aria-hidden="true"
                              className="font-display text-2xl leading-none transition-transform group-open:rotate-45"
                            >
                              +
                            </span>
                          </summary>
                          <p className="pr-6 pb-6 leading-[1.85] whitespace-pre-line text-ink-soft md:pr-10">{faq.answer}</p>
                        </details>
                      ))}
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="border-2 border-ink bg-cream p-10 text-center">
                <p className="text-xl font-extrabold">아직 등록된 FAQ가 없습니다</p>
                <p className="mt-2 text-ink-soft">궁금한 점은 이메일로 문의해주세요.</p>
              </div>
            )}
            <div className="flex flex-wrap items-center justify-between gap-4 border-2 border-ink bg-sky p-6 md:p-7">
              <p className="text-lg font-extrabold">더 궁금한 점이 있으신가요?</p>
              <a href={`mailto:${settings.contact.email}`} className="btn btn-cream break-all">
                {settings.contact.email}
              </a>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
