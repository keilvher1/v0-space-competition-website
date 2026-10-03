import type { Metadata } from "next"
import Link from "next/link"
import { SiteHeader } from "@/components/site/site-header"
import { SiteFooter } from "@/components/site/site-footer"
import { PageIntro } from "@/components/site/page-intro"
import { ArrowRight } from "@/components/site/icons"
import { CURRENT_EDITION } from "@/lib/editions"

export const metadata: Metadata = { title: "자주 묻는 질문" }

// 제2회 핸드오프(public/2026/index.html #faq)의 공식 FAQ 문구.
// Supabase faqs 테이블에는 v0 샘플(영어)만 있어서 쓰지 않는다.
const FAQS = [
  {
    question: "참가와 참관은 어떻게 다른가요?",
    answer:
      "직접 실패담을 들려주실 분은 참가 신청, 다른 사람의 이야기를 듣고 응원하며 투표하실 분은 참관 신청을 선택해주세요. 두 신청서는 서로 다른 링크로 안내합니다.",
  },
  {
    question: "신청 마감은 언제인가요?",
    answer:
      "2026년 10월 31일(토) 23:59까지입니다. 공식 공고에는 선착순 100명 모집으로 안내되어 있습니다. 참가·참관 정원 구분과 실제 접수 상태는 주최 측에 확인해주세요.",
  },
  {
    question: "책은 어떻게 받을 수 있나요?",
    answer:
      "공식 포스터에는 참관 혜택으로 ‘우주실패실록(50명)’이 안내되어 있습니다. 배정 방식과 수령 조건은 주최 측 안내를 확인해주세요.",
  },
  {
    question: "촬영·공개 범위는 어디서 확인하나요?",
    answer:
      "촬영 대상과 공개 채널·기간 등은 주최 측의 안내와 동의 절차를 기준으로 확인해주세요. 구체적인 사항은 아래 문의처로 문의할 수 있습니다.",
  },
]

export default function FAQPage() {
  const edition = CURRENT_EDITION

  return (
    <>
      <SiteHeader />
      <main>
        <PageIntro eyebrow="FAQ" title="자주 묻는 질문">
          {edition.title}({edition.year}) 기준 안내입니다.
        </PageIntro>
        <section className="bg-paper py-12 md:py-16">
          <div className="site-container grid gap-12">
            <div className="grid gap-6 md:grid-cols-[14rem_1fr]">
              <div>
                <h2 className="text-2xl font-extrabold tracking-[-0.03em]">제{edition.number}회 대회</h2>
                <Link href={`${edition.href}#apply`} className="text-link mt-3 text-[15px]">
                  참가·참관 신청 안내 <ArrowRight className="size-5" />
                </Link>
              </div>
              <div className="border-t-2 border-ink">
                {FAQS.map((faq) => (
                  <details key={faq.question} className="group border-b border-line">
                    <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 py-5 text-lg font-bold [&::-webkit-details-marker]:hidden">
                      {faq.question}
                      <span aria-hidden="true" className="font-display text-2xl leading-none transition-transform group-open:rotate-45">
                        +
                      </span>
                    </summary>
                    <p className="pr-10 pb-6 leading-[1.85] text-ink-soft">{faq.answer}</p>
                  </details>
                ))}
              </div>
            </div>
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
