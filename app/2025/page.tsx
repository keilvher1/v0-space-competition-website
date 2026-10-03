import type { Metadata } from "next"
import Link from "next/link"
import { SiteHeader } from "@/components/site/site-header"
import { SiteFooter } from "@/components/site/site-footer"
import { ArrowRight, ArrowUpRight } from "@/components/site/icons"
import { EDITIONS } from "@/lib/editions"

// 헤더의 신청 D-day 표시를 한 시간마다 갱신한다
export const revalidate = 3600

export const metadata: Metadata = {
  title: "제1회 대회 · 2025",
  description:
    "2025년 11월 8일 포항에서 열린 제1회 우주최고실패대회의 기록. 일정과 규칙, 시상, 현장 사진과 기사를 모았습니다.",
}

const edition = EDITIONS.find((e) => e.year === 2025)!
const nextEdition = EDITIONS.find((e) => e.number === edition.number + 1)

const FACTS = [
  { label: "본선", value: "2025.11.08 (토)", sub: "13:00–17:00" },
  { label: "장소", value: "환동해지역혁신원", sub: "파랑뜰 2층 드림홀" },
  { label: "신청자", value: "71명", sub: "국민일보 보도 기준" },
  { label: "본선 진출", value: "10명", sub: "오프라인 PT 발표" },
]

const TIMELINE = [
  { date: "~ 2025.10.27 (월)", title: "참가 신청", body: "1분 분량의 영상 또는 서면으로 접수" },
  { date: "2025.11.04 (화)", title: "예선 합격자 발표", body: "본선 진출자 안내" },
  {
    date: "2025.11.08 (토) 13:00",
    title: "본선",
    body: "오프라인 PT · 환동해지역혁신원 파랑뜰 2층 드림홀 (경상북도 포항시 북구 장성로 109)",
  },
  { date: "2025.11.14 (금)", title: "최종 합격자 발표", body: "트랙별 수상자 발표" },
]

const RULES = [
  { title: "참가 자격", body: "자신의 실패 경험을 공유하고자 하는 모든 연령층. 학생, 직장인, 주부 등 실패를 나누고 싶은 누구나." },
  { title: "참가 제한", body: "1인당 1개 실패 경험만 참가할 수 있었습니다." },
  { title: "참가 비용", body: "무료" },
  {
    title: "참가 방식",
    body: "예선은 말하기·노래·춤 등 자유로운 표현을 담은 1분 분량의 영상 또는 서면, 본선은 오프라인 PT로 진행했습니다.",
  },
  { title: "지원 트랙", body: "청소년 트랙(만 18세까지)과 일반 트랙(만 19세부터)으로 나누어 진행했습니다." },
]

const ORGANIZERS = [
  { src: "/images/partners/moe.png", alt: "교육부" },
  { src: "/images/partners/pohang.png", alt: "포항시" },
  { src: "/images/partners/handong.png", alt: "한동대학교" },
  { src: "/images/partners/parangteul.png", alt: "파랑뜰" },
]

function SectionTitle({ eyebrow, title, id, light }: { eyebrow: string; title: string; id: string; light?: boolean }) {
  return (
    <div>
      <p className={`eyebrow ${light ? "text-mint" : "text-coral-deep"}`}>{eyebrow}</p>
      <h2 id={id} className="mt-3 text-[clamp(2rem,4.4vw,3.5rem)] leading-tight font-black tracking-[-0.045em]">
        {title}
      </h2>
    </div>
  )
}

export default function FirstEditionPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="starfield on-dark relative overflow-hidden border-b-2 border-ink bg-violet-deep text-cream">
          <div className="site-container grid gap-14 pt-12 pb-16 md:grid-cols-[1.25fr_0.75fr] md:items-center md:pt-16 md:pb-24">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="eyebrow text-cream/70">Archive · No.01 · 2025</span>
                <span className="chip text-cream">종료된 대회</span>
              </div>
              <h1 className="mt-8 leading-[1.02] font-black tracking-[-0.045em]">
                <span className="block text-[clamp(1.5rem,3vw,2.25rem)] tracking-[-0.03em]">제1회</span>
                <span className="mt-2 block text-[clamp(3.5rem,10vw,8.5rem)]">
                  <span className="text-mint">우주</span>
                  <span className="text-sun">최고</span>
                  <br className="sm:hidden" />
                  <span className="text-pink">실패</span>
                  <span>대회</span>
                </span>
              </h1>
              <p className="mt-8 text-xl font-semibold md:text-2xl">{edition.tagline}</p>
              <dl className="mt-10 grid grid-cols-2 gap-[2px] border-2 border-cream bg-cream md:grid-cols-4">
                {FACTS.map((fact) => (
                  <div key={fact.label} className="bg-violet px-4 py-4">
                    <dt className="text-[13px] font-semibold text-cream/70">{fact.label}</dt>
                    <dd className="mt-1 text-lg leading-snug font-extrabold tracking-[-0.02em]">{fact.value}</dd>
                    <dd className="mt-0.5 text-[13px] text-cream/70">{fact.sub}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <figure className="mx-auto w-[min(100%,340px)]">
              <a
                href="/images/poster.jpg"
                target="_blank"
                rel="noopener noreferrer"
                className="poster-tilt block border-2 border-cream bg-cream p-2.5 shadow-[10px_10px_0_var(--pink)]"
                aria-label="제1회 포스터 원본 보기, 새 창"
              >
                <img src={edition.poster.src} width={edition.poster.width} height={edition.poster.height} alt={edition.poster.alt} />
              </a>
              <figcaption className="mt-6 text-center text-sm text-cream/75">
                포스터를 누르면 원본을 볼 수 있습니다
              </figcaption>
            </figure>
          </div>
        </section>

        <section aria-labelledby="intro-title" className="border-b-2 border-ink bg-paper py-20 md:py-24">
          <div className="site-container">
            <SectionTitle eyebrow="About" title="실패, 결과가 아닌 질문으로" id="intro-title" />
            <div className="mt-12 grid gap-6 md:grid-cols-2">
              <article className="reveal border-2 border-ink bg-cream p-7 md:p-9">
                <h3 className="text-2xl font-extrabold tracking-[-0.03em]">대회 소개</h3>
                <div className="mt-5 space-y-4 leading-[1.85] text-ink-soft">
                  <p>
                    제1회 우주 최고 실패 대회는{" "}
                    <strong className="text-ink">
                      &ldquo;단순히 실패를 극복하고 결국 희망과 웃음으로 마무리하는 자리&rdquo;가 아닙니다.
                    </strong>
                  </p>
                  <p>
                    포항 지역 최초의 실패 독려 프로젝트로서, 실패를 개인의 낙인으로 치부하지 않고 사회가 함께 격려하고 축하하는
                    축제의 장을 마련하고자 했습니다.
                  </p>
                  <p className="font-semibold text-ink">
                    참가자 모두가 자신이 극복하지 못한 실패를 진솔하게 나누는 것이 이 대회의 가장 중요한 목표였습니다.
                  </p>
                </div>
              </article>
              <article className="reveal border-2 border-ink bg-violet p-7 text-cream md:p-9">
                <h3 className="text-2xl font-extrabold tracking-[-0.03em]">대회 철학과 목적</h3>
                <p className="mt-5 text-xl leading-snug font-bold">
                  실패는 개인의 몫처럼 보이지만,
                  <br />
                  사실은 사회가 함께 책임져야 할 감정
                </p>
                <div className="mt-5 space-y-4 leading-[1.85] text-cream/80">
                  <p>만약 실패를 공유할 수 있는 언어와 공간이 없다면 실패는 그저 실패로 끝날 수밖에 없습니다.</p>
                  <p>
                    하지만 실패를 나누고 교류하는 과정에서 실패를 조금씩 익숙하게 받아들이고, 이로써 실패는 실패 이후로 나아가게
                    됩니다.
                  </p>
                  <p>
                    단순히 희망적이고 성공담으로 포장하지 않은 실패 그 자체를, 있는 그대로 회고하는 순간을 만들어 많은 분들의
                    이야기를 들려드리고자 했습니다.
                  </p>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section aria-labelledby="timeline-title" className="border-b-2 border-ink bg-cream py-20 md:py-24">
          <div className="site-container">
            <SectionTitle eyebrow="Timeline" title="대회 일정" id="timeline-title" />
            <ol className="mt-12 grid border-t-2 border-ink md:grid-cols-4">
              {TIMELINE.map((step, i) => (
                <li
                  key={step.title}
                  className="reveal relative border-b border-ink/25 py-8 md:border-b-0 md:pr-8 md:[&:not(:first-child)]:border-l md:[&:not(:first-child)]:border-ink md:[&:not(:first-child)]:pl-8"
                >
                  <span className="font-display text-sm font-bold text-coral-deep">STEP {String(i + 1).padStart(2, "0")}</span>
                  <p className="mt-3 font-display text-lg font-bold tracking-[-0.01em]">{step.date}</p>
                  <h3 className="mt-2 text-2xl font-extrabold tracking-[-0.03em]">{step.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{step.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section aria-labelledby="rules-title" className="border-b-2 border-ink bg-paper py-20 md:py-24">
          <div className="site-container grid gap-12 lg:grid-cols-[1.3fr_1fr]">
            <div>
              <SectionTitle eyebrow="Rules" title="참가 방식" id="rules-title" />
              <dl className="mt-10 border-t-2 border-ink">
                {RULES.map((rule) => (
                  <div key={rule.title} className="reveal grid gap-2 border-b border-line py-5 sm:grid-cols-[8rem_1fr] sm:gap-6">
                    <dt className="font-extrabold">{rule.title}</dt>
                    <dd className="leading-relaxed text-ink-soft">{rule.body}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div>
              <SectionTitle eyebrow="Awards" title="시상" id="awards-title" />
              <div className="mt-10 space-y-4">
                <div className="reveal border-2 border-ink bg-sun p-6">
                  <p className="text-sm font-semibold">참가자 전원</p>
                  <p className="mt-2 text-xl font-extrabold tracking-[-0.02em]">「우주 최고 실패」 디지털 뱃지 수여</p>
                </div>
                <div className="reveal border-2 border-ink bg-pink p-6">
                  <p className="text-sm font-semibold">트랙별 수상자 · 청소년·일반 트랙 각 최대 3명</p>
                  <p className="mt-2 text-xl font-extrabold tracking-[-0.02em]">실패 도서 출간 저자 기회 제공</p>
                  <p className="mt-1 text-xl font-extrabold tracking-[-0.02em]">트로피 수여</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section aria-labelledby="scene-title" className="starfield border-b-2 border-ink bg-violet py-20 text-cream md:py-24">
          <div className="site-container">
            <SectionTitle eyebrow="Records" title="그날의 기록" id="scene-title" light />
            <div className="mt-12 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
              <figure className="reveal border-2 border-cream bg-cream">
                <img
                  src="/images/2025/first-event-group.webp"
                  width={1200}
                  height={671}
                  loading="lazy"
                  alt="제1회 우주최고실패대회 현장에서 참석자들이 행사 현수막과 함께 촬영한 단체 사진"
                />
                <figcaption className="border-t-2 border-ink px-5 py-4 text-ink">
                  <strong>함께 모여 남긴 한 장</strong>
                  <span className="ml-2 text-sm text-ink-soft">2025.11.08 · 파랑뜰 2층 드림홀</span>
                </figcaption>
              </figure>
              <div className="grid gap-6">
                <article className="reveal border-2 border-cream p-6">
                  <p className="eyebrow text-cream/60">Press · 국민일보 · 2025.11.13</p>
                  <h3 className="mt-3 text-2xl font-extrabold tracking-[-0.03em]">실패도 응원받는 사회를 향해.</h3>
                  <p className="mt-2 leading-relaxed text-cream/75">
                    참가자들이 경험을 나누고 서로의 이야기에 공감한 현장을 전했습니다.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
                    <a
                      href="https://www.kmib.co.kr/article/view.asp?arcid=0028970435"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-link"
                    >
                      기사 읽기 <ArrowUpRight className="size-5" />
                    </a>
                    <a
                      href="https://v.daum.net/v/20251113172048160?f=p"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-cream/75 underline underline-offset-4"
                    >
                      다음 게재본
                    </a>
                  </div>
                </article>
                <article className="reveal grid grid-cols-[auto_1fr] items-center gap-5 border-2 border-cream bg-cream p-6 text-ink">
                  <img
                    src="/images/book/book-cover.webp"
                    width={400}
                    height={588}
                    loading="lazy"
                    alt="『우주실패실록』 표지"
                    className="w-20 border border-ink"
                  />
                  <div>
                    <h3 className="text-xl font-extrabold tracking-[-0.02em]">『우주실패실록』</h3>
                    <p className="mt-1 text-[15px] leading-relaxed text-ink-soft">
                      제1회의 과정을 담은 책. 2026년 3월 출간 소식이 전해졌습니다.
                    </p>
                    <a
                      href="https://www.hangyo.com/news/article.html?no=106959"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-link mt-2 text-[15px]"
                    >
                      출간 기사 <ArrowUpRight className="size-5" />
                    </a>
                  </div>
                </article>
              </div>
            </div>
          </div>
        </section>

        <section aria-labelledby="video-title" className="border-b-2 border-ink bg-paper py-20 md:py-24">
          <div className="site-container grid items-center gap-12 md:grid-cols-[1fr_330px]">
            <div>
              <SectionTitle eyebrow="Video" title="대회 소개 영상" id="video-title" />
              <p className="mt-6 max-w-[40ch] text-lg leading-relaxed text-ink-soft">
                제1회 모집 당시 공개한 영상입니다. 대회가 던지고 싶었던 질문을 70초에 담았습니다.
              </p>
            </div>
            <div className="reveal mx-auto w-full max-w-[330px] border-2 border-ink bg-ink p-2 shadow-[8px_8px_0_var(--violet)]">
              <div className="relative aspect-[9/16]">
                <iframe
                  src="https://player.vimeo.com/video/1123631620?title=0&byline=0&portrait=0&badge=0&dnt=1"
                  title="제1회 우주최고실패대회 소개 영상"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                  className="absolute inset-0 size-full"
                />
              </div>
            </div>
          </div>
        </section>

        <section aria-labelledby="org-title" className="border-b-2 border-ink bg-cream py-16">
          <div className="site-container">
            <h2 id="org-title" className="text-xl font-extrabold tracking-[-0.02em]">
              주최·주관
            </h2>
            <ul className="mt-8 grid grid-cols-2 gap-[2px] border-2 border-ink bg-ink sm:grid-cols-4">
              {ORGANIZERS.map((org) => (
                <li key={org.alt} className="flex h-28 items-center justify-center bg-paper px-6">
                  <img src={org.src} alt={org.alt} loading="lazy" className="max-h-12 max-w-[150px] object-contain" />
                </li>
              ))}
            </ul>
          </div>
        </section>

        {nextEdition && (
          <Link
            href={nextEdition.href}
            className="group block border-b-2 border-ink bg-sky transition-colors hover:bg-coral"
            aria-label={`다음 대회: ${nextEdition.title}`}
          >
            <div className="site-container flex flex-wrap items-center justify-between gap-6 py-12 md:py-16">
              <div>
                <p className="eyebrow">Next · No.02 · {nextEdition.year}</p>
                <p className="mt-3 text-[clamp(2rem,5vw,4rem)] leading-tight font-black tracking-[-0.05em]">{nextEdition.title}</p>
              </div>
              <ArrowRight className="size-14 transition-transform group-hover:translate-x-2" />
            </div>
          </Link>
        )}
      </main>
      <SiteFooter />
    </>
  )
}
