import type { Metadata } from "next"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { SiteHeader } from "@/components/site/site-header"
import { SiteFooter } from "@/components/site/site-footer"
import { PageIntro } from "@/components/site/page-intro"
import { CURRENT_EDITION } from "@/lib/editions"

export const metadata: Metadata = { title: "자주 묻는 질문" }

// DB에 영어로 저장된 카테고리를 화면에서는 한국어로 보여준다
const CATEGORY_LABEL: Record<string, string> = {
  Registration: "참가 신청",
  Eligibility: "참가 자격",
  Judging: "심사",
  Fees: "참가비",
}

export default async function FAQPage() {
  const supabase = await createClient()

  const { data: faqs } = await supabase
    .from("faqs")
    .select("*")
    .eq("is_published", true)
    .order("sort_order", { ascending: true })

  const grouped = new Map<string, NonNullable<typeof faqs>>()
  for (const faq of faqs ?? []) {
    const category = CATEGORY_LABEL[faq.category] ?? faq.category ?? "일반"
    grouped.set(category, [...(grouped.get(category) ?? []), faq])
  }

  return (
    <>
      <SiteHeader />
      <main>
        <PageIntro eyebrow="FAQ" title="자주 묻는 질문">
          제{CURRENT_EDITION.number}회 대회 일정·신청 관련 질문은{" "}
          <Link href={`${CURRENT_EDITION.href}#faq`} className="text-link text-ink">
            제{CURRENT_EDITION.number}회 대회 페이지
          </Link>
          에서도 확인할 수 있습니다.
        </PageIntro>
        <section className="bg-paper py-12 md:py-16">
          <div className="site-container grid gap-12">
            {grouped.size > 0 ? (
              [...grouped].map(([category, items]) => (
                <div key={category} className="grid gap-6 md:grid-cols-[14rem_1fr]">
                  <h2 className="text-2xl font-extrabold tracking-[-0.03em]">{category}</h2>
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
                        <p className="pr-10 pb-6 leading-[1.85] whitespace-pre-wrap text-ink-soft">{faq.answer}</p>
                      </details>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="border-2 border-ink bg-cream p-10 text-center">
                <p className="text-xl font-extrabold">아직 등록된 FAQ가 없습니다</p>
                <p className="mt-2 text-ink-soft">궁금한 점은 이메일로 문의해주세요.</p>
              </div>
            )}
            <div className="flex flex-wrap items-center justify-between gap-4 border-2 border-ink bg-sky p-7">
              <p className="text-lg font-extrabold">더 궁금한 점이 있으신가요?</p>
              <a href="mailto:jyjpeter79@gmail.com" className="btn btn-cream">
                jyjpeter79@gmail.com
              </a>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
