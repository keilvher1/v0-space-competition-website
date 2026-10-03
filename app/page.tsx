import type React from "react"
import Link from "next/link"
import { SiteHeader } from "@/components/site/site-header"
import { SiteFooter } from "@/components/site/site-footer"
import { Marquee } from "@/components/site/marquee"
import { ArrowDown, ArrowRight, ArrowUpRight, Sparkle } from "@/components/site/icons"
import { CURRENT_EDITION, EDITIONS, STATUS_LABEL, dDayLabel, editionStatus } from "@/lib/editions"

// 신청 상태와 D-day 표시를 한 시간마다 갱신한다
export const revalidate = 3600

const SLOGANS = ["실패해도 괜찮아", "우주에서 제일 멋지게 실패해보자", "실패, 결과가 아닌 질문으로", "FAIL IS OK"]

const PRINCIPLES = [
  {
    title: "진솔하게 꺼내기",
    body: "극복하지 못한 실패도 괜찮습니다. 결과보다 그 안의 경험과 과정을 있는 그대로 이야기합니다.",
  },
  {
    title: "함께 듣고 응원하기",
    body: "실패를 조롱하거나 단정하지 않습니다. 무대 위의 이야기에 귀 기울이고 박수를 보냅니다.",
  },
  {
    title: "기록으로 이어가기",
    body: "한 번의 행사로 끝내지 않고, 책과 아카이브로 다시 읽고 나눌 수 있게 이야기를 남깁니다.",
  },
]

const PARTNERS = [
  { src: "/images/partners/moe.png", alt: "교육부" },
  { src: "/images/partners/pohang.png", alt: "포항시" },
  { src: "/images/partners/handong.png", alt: "한동대학교" },
  { src: "/images/partners/parangteul.png", alt: "파랑뜰" },
  { src: "/images/partners/silso.png", alt: "실소" },
  { src: "/images/partners/house-weather.png", alt: "하우스더웨더", temporary: true },
  { src: "/images/partners/micemore.png", alt: "마이스모어", temporary: true },
  { src: "/images/partners/desker.png", alt: "데스커" },
]

const pad = (n: number) => String(n).padStart(2, "0")

function Sticker() {
  return (
    <div className="relative size-40 -rotate-12 lg:size-48">
      <svg viewBox="0 0 200 200" className="spin-slow absolute inset-0" aria-hidden="true">
        <defs>
          <path id="sticker-ring" d="M100,100 m-76,0 a76,76 0 1,1 152,0 a76,76 0 1,1 -152,0" />
        </defs>
        <circle cx="100" cy="100" r="97" fill="var(--coral)" stroke="var(--cream)" strokeWidth="3" />
        <text fill="var(--ink)" fontSize="17" fontWeight="800">
          <textPath href="#sticker-ring" textLength="470" lengthAdjust="spacing">
            실패해도 괜찮아 ✦ FAIL IS OK ✦ 실패해도 괜찮아 ✦ FAIL IS OK ✦
          </textPath>
        </text>
      </svg>
      <img src="/icon.svg" alt="" width={48} height={48} className="absolute inset-[31%] size-[38%]" />
    </div>
  )
}

function Hero() {
  return (
    <section className="starfield on-dark relative overflow-hidden border-b-2 border-ink bg-ink text-cream">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-36 -right-36 hidden size-[30rem] rounded-full border-2 border-cream bg-sky md:block lg:size-[36rem]"
      />
      <div aria-hidden="true" className="absolute top-[58%] right-[9%] hidden size-7 rounded-full border-2 border-cream bg-sun md:block" />
      <div className="absolute top-20 right-[8%] hidden md:block lg:top-24">
        <Sticker />
      </div>

      <div className="site-container relative pt-10 pb-14 md:pt-14 md:pb-20">
        <div className="flex flex-wrap items-center justify-between gap-3 text-cream/70">
          <p className="eyebrow">Universe&apos;s Best Failure Contest</p>
          <p className="eyebrow md:hidden">Since 2025 · Pohang</p>
        </div>
        <h1 className="mt-8 text-[clamp(4rem,14.5vw,13.5rem)] leading-[1.02] font-black tracking-[-0.045em] md:mt-10">
          <span className="block">우주최고</span>
          <span className="block">
            <span className="lettering-shadow">실패</span>대회
          </span>
        </h1>
        <div className="mt-10 grid items-end gap-8 md:mt-14 md:grid-cols-[1.1fr_1fr]">
          <p className="max-w-[30ch] text-xl leading-relaxed font-semibold md:text-2xl">
            실패해도 괜찮아.
            <br />
            숨기지 않고 꺼내 놓은 실패를
            <br />
            함께 듣고 응원하는 무대입니다.
          </p>
          <div className="flex flex-wrap gap-4 md:justify-end">
            <Link href={CURRENT_EDITION.href} className="btn btn-coral">
              제{CURRENT_EDITION.number}회 대회 보기 <ArrowRight />
            </Link>
            <Link href="#archive" className="btn btn-ink">
              역대 대회 <ArrowDown />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

function SloganBand() {
  return (
    <Marquee className="border-b-2 border-ink bg-coral py-4 text-ink" duration="36s">
      {SLOGANS.concat(SLOGANS).map((text, i) => (
        <span key={i} className="flex items-center gap-6 pr-6 text-xl font-extrabold tracking-[-0.02em] whitespace-nowrap md:text-[1.7rem]">
          {text}
          <Sparkle className="size-5 md:size-6" />
        </span>
      ))}
    </Marquee>
  )
}

function NowSection() {
  const edition = CURRENT_EDITION
  const status = editionStatus(edition)
  const facts = [
    { label: "일시", value: "11.11 (수) 19:00" },
    { label: "장소", value: edition.venue },
    { label: "신청 마감", value: "10.31 (토) 23:59" },
    { label: "모집", value: "선착순 100명" },
  ]

  return (
    <section id="now" aria-labelledby="now-title" className="border-b-2 border-ink bg-sky">
      <div className="site-container grid gap-14 py-20 md:grid-cols-[1.15fr_0.85fr] md:items-center md:py-28">
        <div className="reveal">
          <div className="flex flex-wrap items-center gap-3">
            <span className="eyebrow">
              {status === "ended" ? "Latest" : "Now"} · No.{pad(edition.number)} · {edition.year}
            </span>
            <span className="chip chip-dot bg-cream">
              {STATUS_LABEL[status]}
              {status === "recruiting" && ` · 마감 ${dDayLabel(edition.deadline)}`}
            </span>
          </div>
          <h2 id="now-title" className="mt-6 text-[clamp(2.5rem,6vw,5.25rem)] leading-[1.02] font-black tracking-[-0.05em]">
            제{edition.number}회
            <br />
            우주최고실패대회
          </h2>
          <p className="mt-6 text-xl font-semibold md:text-2xl">{edition.tagline}</p>
          <dl className="mt-10 grid grid-cols-2 gap-[2px] border-2 border-ink bg-ink md:grid-cols-4">
            {facts.map((fact) => (
              <div key={fact.label} className="bg-cream px-4 py-4">
                <dt className="text-[13px] font-semibold text-ink-soft">{fact.label}</dt>
                <dd className="mt-1 text-lg leading-snug font-extrabold tracking-[-0.02em]">{fact.value}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-8 flex flex-wrap gap-4">
            {status === "recruiting" && (
              <Link href={`${edition.href}#apply`} className="btn btn-coral">
                참가·참관 신청 안내 <ArrowRight />
              </Link>
            )}
            <Link href={edition.href} className="btn btn-cream">
              대회 페이지 보기 <ArrowRight />
            </Link>
          </div>
        </div>
        <Link
          href={edition.href}
          className="poster-tilt reveal mx-auto block w-[min(100%,380px)] border-2 border-ink bg-cream p-2.5 shadow-[10px_10px_0_var(--coral)]"
          aria-label={`${edition.title} 대회 페이지로 이동`}
        >
          <img src={edition.poster.src} width={edition.poster.width} height={edition.poster.height} alt={edition.poster.alt} />
        </Link>
      </div>
    </section>
  )
}

function ArchiveSection() {
  return (
    <section id="archive" aria-labelledby="archive-title" className="border-b-2 border-ink bg-paper py-20 md:py-28">
      <div className="site-container">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow text-coral-deep">Archive</p>
            <h2 id="archive-title" className="mt-3 text-[clamp(2.25rem,5vw,4rem)] font-black tracking-[-0.05em]">
              역대 대회
            </h2>
          </div>
          <p className="max-w-[34ch] text-ink-soft">해마다 다른 실패, 하나의 질문. 지난 대회의 기록을 회차별로 보존합니다.</p>
        </div>
        <ol className="mt-12 border-t-2 border-ink">
          {EDITIONS.map((edition) => {
            const status = editionStatus(edition)
            const rowStyle = { "--row-bg": edition.theme.bg, "--row-fg": edition.theme.fg } as React.CSSProperties
            return (
              <li key={edition.year} className="reveal">
                <Link
                  href={edition.href}
                  style={rowStyle}
                  className="archive-row relative grid grid-cols-[auto_1fr_auto] items-center gap-x-5 gap-y-3 border-b-2 border-ink px-2 py-7 md:grid-cols-[6.5rem_7rem_1fr_auto_3rem] md:px-5 md:py-10"
                >
                  <span className="font-display text-5xl leading-none font-bold tracking-[-0.04em] md:text-7xl">
                    {pad(edition.number)}
                  </span>
                  <span className="font-display text-xl font-bold md:text-2xl">{edition.year}</span>
                  <span className="order-last col-span-full md:order-none md:col-span-1">
                    <strong className="block text-2xl font-extrabold tracking-[-0.03em] md:text-[2rem]">{edition.title}</strong>
                    <span className="mt-1.5 block text-[15px] opacity-80">
                      {edition.dateLabel} · {edition.venue}
                    </span>
                  </span>
                  <span className={`chip ${status === "ended" ? "" : "chip-dot"}`}>{STATUS_LABEL[status]}</span>
                  <ArrowRight className="archive-arrow hidden size-8 md:block" />
                  <img
                    src={edition.poster.src}
                    width={edition.poster.width}
                    height={edition.poster.height}
                    alt=""
                    loading="lazy"
                    className="archive-peek pointer-events-none absolute top-1/2 right-[15rem] z-10 hidden w-36 border-2 border-ink shadow-[6px_6px_0_var(--ink)] [@media(hover:hover)_and_(min-width:1024px)]:block"
                  />
                </Link>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}

function AboutSection() {
  return (
    <section id="about" aria-labelledby="about-title" className="border-b-2 border-ink bg-cream py-20 md:py-28">
      <div className="site-container">
        <p className="eyebrow text-coral-deep">About</p>
        <h2
          id="about-title"
          className="reveal mt-5 max-w-[24ch] text-[clamp(2rem,4.6vw,4.25rem)] leading-[1.18] font-black tracking-[-0.045em]"
        >
          실패는 개인의 몫처럼 보이지만, 사실은{" "}
          <span className="bg-coral px-2 whitespace-nowrap">사회가 함께</span> 책임져야 할 감정입니다.
        </h2>
        <div className="mt-12 grid gap-8 md:grid-cols-2 md:gap-16">
          <p className="text-lg leading-[1.85] text-ink-soft">
            우주최고실패대회는 실패를 극복하고 결국 희망과 웃음으로 마무리하는 자리가 아닙니다. 포항 지역 최초의 실패 독려
            프로젝트로서, 실패를 개인의 낙인으로 치부하지 않고 사회가 함께 격려하고 축하하는 축제의 장을 만듭니다.
          </p>
          <p className="text-lg leading-[1.85] text-ink-soft">
            실패를 공유할 언어와 공간이 있을 때, 실패는 실패 이후로 나아갈 수 있습니다. 성공담으로 포장하지 않은 실패 그
            자체를 있는 그대로 회고하고, 그 이야기를 함께 듣고 응원합니다.
          </p>
        </div>
        <ol className="mt-16 grid border-t-2 border-ink md:grid-cols-3">
          {PRINCIPLES.map((principle, i) => (
            <li
              key={principle.title}
              className="reveal border-b border-ink/25 py-8 md:border-b-0 md:pr-10 md:[&:not(:first-child)]:border-l md:[&:not(:first-child)]:border-ink md:[&:not(:first-child)]:pl-10"
            >
              <span className="font-display text-sm font-bold text-coral-deep">{pad(i + 1)}</span>
              <h3 className="mt-3 text-2xl font-extrabold tracking-[-0.03em]">{principle.title}</h3>
              <p className="mt-3 leading-relaxed text-ink-soft">{principle.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

function StatTile({ label, value, note, className }: { label: string; value: string; note?: string; className: string }) {
  return (
    <div className={`reveal flex min-h-44 flex-col justify-between gap-6 border-2 border-ink p-5 md:min-h-52 md:p-6 ${className}`}>
      <p className="font-semibold">{label}</p>
      <div>
        <p className="font-display text-6xl leading-none font-bold tracking-[-0.05em] md:text-7xl">
          {value}
          <span className="ml-1 font-sans text-2xl font-extrabold">명</span>
        </p>
        {note && <p className="mt-3 text-sm opacity-80">{note}</p>}
      </div>
    </div>
  )
}

function RecordsSection() {
  return (
    <section id="records" aria-labelledby="records-title" className="border-b-2 border-ink bg-paper py-20 md:py-28">
      <div className="site-container">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow text-coral-deep">Records</p>
            <h2 id="records-title" className="mt-3 text-[clamp(2.25rem,5vw,4rem)] font-black tracking-[-0.05em]">
              실패가 남긴 기록
            </h2>
          </div>
          <p className="max-w-[36ch] text-ink-soft">첫 대회의 이야기는 책과 기사로, 그리고 다음 대회로 이어지고 있습니다.</p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
          <figure className="reveal relative col-span-2 min-h-72 overflow-hidden border-2 border-ink lg:row-span-2">
            <img
              src="/images/2025/first-event-group.webp"
              width={1200}
              height={671}
              loading="lazy"
              alt="제1회 우주최고실패대회 현장에서 참석자들이 행사 현수막과 함께 촬영한 단체 사진"
              className="absolute inset-0 size-full object-cover"
            />
            <figcaption className="absolute inset-x-0 bottom-0 border-t-2 border-ink bg-ink/90 px-5 py-4 text-cream">
              <strong className="block">2025.11.08 · 제1회 현장</strong>
              <span className="text-sm text-cream/75">환동해지역혁신원 파랑뜰 2층 드림홀</span>
            </figcaption>
          </figure>
          <StatTile label="제1회 신청자" value="71" className="bg-violet text-cream" />
          <StatTile label="제1회 본선 진출" value="10" className="bg-coral" />
          <article className="reveal col-span-2 grid grid-cols-[auto_1fr] items-center gap-6 border-2 border-ink bg-cream p-6">
            <img
              src="/images/book/book-cover.webp"
              width={400}
              height={588}
              loading="lazy"
              alt="『우주실패실록』 표지"
              className="w-24 border border-ink shadow-[5px_5px_0_var(--ink)] md:w-28"
            />
            <div>
              <p className="eyebrow text-coral-deep">Book</p>
              <h3 className="mt-2 text-2xl font-extrabold tracking-[-0.03em]">『우주실패실록』</h3>
              <p className="mt-2 leading-relaxed text-ink-soft">
                첫 대회의 과정을 담은 책입니다. 한국교육신문은 2026년 3월 이 책의 출간 소식을 전했습니다.
              </p>
              <a
                href="https://www.hangyo.com/news/article.html?no=106959"
                target="_blank"
                rel="noopener noreferrer"
                className="text-link mt-3"
              >
                출간 기사 읽기 <ArrowUpRight className="size-5" />
              </a>
            </div>
          </article>
          <article className="reveal col-span-2 flex flex-col justify-between gap-6 border-2 border-ink bg-ink p-6 text-cream md:p-8 lg:col-span-3">
            <p className="eyebrow text-cream/60">Press · 국민일보 · 2025.11.13</p>
            <div>
              <h3 className="text-[clamp(1.75rem,3.4vw,2.75rem)] leading-tight font-extrabold tracking-[-0.04em]">
                실패도 응원받는 사회를 향해.
              </h3>
              <p className="mt-3 max-w-[52ch] text-cream/75">
                포항에서 열린 첫 대회. 참가자들이 경험을 나누고 서로의 이야기에 공감한 현장을 전했습니다.
              </p>
            </div>
            <a
              href="https://www.kmib.co.kr/article/view.asp?arcid=0028970435"
              target="_blank"
              rel="noopener noreferrer"
              className="text-link"
            >
              기사 읽기 <ArrowUpRight className="size-5" />
            </a>
          </article>
          <StatTile label="제2회 모집" value="100" note="선착순 · 공식 공고 기준" className="col-span-2 bg-sky lg:col-span-1" />
        </div>
        <p className="mt-6 text-[13px] text-ink-soft">제1회 신청자·본선 인원은 2025년 국민일보 보도 기준입니다.</p>
      </div>
    </section>
  )
}

function PartnersSection() {
  return (
    <section aria-labelledby="partners-title" className="bg-paper py-14 md:py-16">
      <div className="site-container flex flex-wrap items-baseline justify-between gap-3">
        <h2 id="partners-title" className="text-xl font-extrabold tracking-[-0.02em]">
          함께한 기관·기업
        </h2>
        <p className="text-sm text-ink-soft">제1회와 제2회를 함께 만든 곳들입니다.</p>
      </div>
      <Marquee label="함께한 기관·기업 로고" className="mt-8" duration="45s">
        {PARTNERS.map((partner) => (
          <div key={partner.alt} className="flex h-20 w-48 shrink-0 items-center justify-center px-6">
            <img
              src={partner.src}
              alt={partner.alt}
              loading="lazy"
              className={`max-h-12 max-w-[150px] object-contain ${partner.temporary ? "brightness-0" : "grayscale"}`}
            />
          </div>
        ))}
      </Marquee>
      <p className="site-container mt-6 text-xs text-ink-soft">
        하우스더웨더·마이스모어 로고는 제2회 포스터에서 추출한 임시 로고입니다.
      </p>
    </section>
  )
}

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <SloganBand />
        <NowSection />
        <ArchiveSection />
        <AboutSection />
        <RecordsSection />
        <PartnersSection />
      </main>
      <SiteFooter />
    </>
  )
}
