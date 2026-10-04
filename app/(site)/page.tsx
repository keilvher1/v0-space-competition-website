import type React from "react"
import Link from "next/link"
import { SiteHeader } from "@/components/site/site-header"
import { SiteFooter } from "@/components/site/site-footer"
import { Marquee } from "@/components/site/marquee"
import { Multiline, WithHighlight } from "@/components/site/text"
import { ArrowDown, ArrowRight, ArrowUpRight, Sparkle } from "@/components/site/icons"
import { getCurrentEdition, getEditions, getPartners, getSiteSettings } from "@/lib/cms/queries"
import { editionHref } from "@/lib/cms/links"
import type { Edition, HighlightTile, Partner, SiteSettings } from "@/lib/cms/types"
import { STATUS_LABEL, contrastOn, dDayLabel, editionStatus, normalizeHex, pad2, safeHref } from "@/lib/cms/utils"

// 관리자가 저장하면 즉시 갱신되고(revalidateTag), 신청 상태·D-day는 최소 5분마다 다시 계산한다
export const revalidate = 300

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

function Hero({ hero, edition }: { hero: SiteSettings["hero"]; edition: Edition }) {
  return (
    <section className="starfield on-dark relative overflow-hidden border-b-2 border-ink bg-ink text-cream">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-36 -right-36 hidden size-[30rem] rounded-full border-2 border-cream md:block lg:size-[36rem]"
        style={{ background: normalizeHex(edition.keyColor) }}
      />
      <div aria-hidden="true" className="absolute top-[58%] right-[9%] hidden size-7 rounded-full border-2 border-cream bg-sun md:block" />
      <div className="absolute top-20 right-[8%] hidden md:block lg:top-24">
        <Sticker />
      </div>

      <div className="site-container relative pt-10 pb-14 md:pt-14 md:pb-20">
        <div className="flex flex-wrap items-center justify-between gap-3 text-cream/70">
          <p className="eyebrow">{hero.eyebrow}</p>
          <p className="eyebrow md:hidden">{hero.subEyebrow}</p>
        </div>
        <h1 className="mt-8 text-[clamp(3.6rem,14.5vw,13.5rem)] leading-[1.02] font-black tracking-[-0.045em] md:mt-10">
          {hero.titleLines.map((line, i) => (
            <span key={i} className="block">
              <WithHighlight text={line} highlight={hero.highlight} className="lettering-shadow" />
            </span>
          ))}
        </h1>
        <div className="mt-10 grid items-end gap-8 md:mt-14 md:grid-cols-[1.1fr_1fr]">
          <p className="max-w-[30ch] text-xl leading-relaxed font-semibold md:text-2xl">
            <Multiline text={hero.body} />
          </p>
          <div className="flex flex-wrap gap-3 sm:gap-4 md:justify-end">
            <Link href={editionHref(edition)} className="btn btn-coral">
              제{edition.number}회 대회 보기 <ArrowRight />
            </Link>
            <Link href="#archive" className="btn btn-ink">
              {hero.secondaryLabel} <ArrowDown />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

function SloganBand({ slogans }: { slogans: string[] }) {
  if (slogans.length === 0) return null
  return (
    <Marquee className="border-b-2 border-ink bg-coral py-4 text-ink" duration="36s">
      {slogans.concat(slogans).map((text, i) => (
        <span key={i} className="flex items-center gap-6 pr-6 text-xl font-extrabold tracking-[-0.02em] whitespace-nowrap md:text-[1.7rem]">
          {text}
          <Sparkle className="size-5 md:size-6" />
        </span>
      ))}
    </Marquee>
  )
}

function NowSection({ edition }: { edition: Edition }) {
  const status = editionStatus(edition)
  const href = editionHref(edition)
  const bg = normalizeHex(edition.keyColor)
  const fg = contrastOn(bg)
  const dark = fg !== "#052031"
  const facts = edition.data.facts.slice(0, 4)

  return (
    <section
      id="now"
      aria-labelledby="now-title"
      className={`border-b-2 border-ink ${dark ? "on-dark" : ""}`}
      style={{ background: bg, color: fg }}
    >
      <div className="site-container grid gap-14 py-20 md:grid-cols-[1.15fr_0.85fr] md:items-center md:py-28">
        <div className="reveal">
          <div className="flex flex-wrap items-center gap-3">
            <span className="eyebrow">
              {status === "ended" ? "Latest" : "Now"} · No.{pad2(edition.number)} · {edition.year}
            </span>
            <span className="chip chip-dot bg-cream text-ink">
              {STATUS_LABEL[status]}
              {status === "recruiting" && dDayLabel(edition.data.deadline) && ` · 마감 ${dDayLabel(edition.data.deadline)}`}
            </span>
          </div>
          <h2 id="now-title" className="mt-6 text-[clamp(2.5rem,6vw,5.25rem)] leading-[1.04] font-black tracking-[-0.05em]">
            {edition.data.title}
          </h2>
          {edition.data.tagline && <p className="mt-6 text-xl font-semibold md:text-2xl">{edition.data.tagline}</p>}
          {facts.length > 0 && (
            <dl className="mt-10 grid grid-cols-2 gap-[2px] border-2 border-ink bg-ink text-ink md:grid-cols-4">
              {facts.map((fact) => (
                <div key={fact.label} className="bg-cream px-4 py-4">
                  <dt className="text-[13px] font-semibold text-ink-soft">{fact.label}</dt>
                  <dd className="mt-1 text-[17px] leading-snug font-extrabold tracking-[-0.02em] md:text-lg">{fact.value}</dd>
                </div>
              ))}
            </dl>
          )}
          <div className="mt-8 flex flex-wrap gap-3 sm:gap-4">
            {status === "recruiting" && (
              <Link href={`${href}#apply`} className="btn btn-coral">
                참가·참관 신청 안내 <ArrowRight />
              </Link>
            )}
            <Link href={href} className="btn btn-cream">
              대회 페이지 보기 <ArrowRight />
            </Link>
          </div>
        </div>
        {edition.data.poster.url && (
          <Link
            href={href}
            className="poster-tilt reveal mx-auto block w-[min(100%,380px)] border-2 border-ink bg-cream p-2.5 shadow-[10px_10px_0_var(--coral)]"
            aria-label={`${edition.data.title} 대회 페이지로 이동`}
          >
            <img
              src={edition.data.poster.url}
              width={edition.data.poster.width || undefined}
              height={edition.data.poster.height || undefined}
              alt={edition.data.poster.alt}
            />
          </Link>
        )}
      </div>
    </section>
  )
}

function ArchiveSection({ editions, archive }: { editions: Edition[]; archive: SiteSettings["archive"] }) {
  return (
    <section id="archive" aria-labelledby="archive-title" className="border-b-2 border-ink bg-paper py-20 md:py-28">
      <div className="site-container">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow text-coral-deep">Archive</p>
            <h2 id="archive-title" className="mt-3 text-[clamp(2.25rem,5vw,4rem)] font-black tracking-[-0.05em]">
              {archive.title}
            </h2>
          </div>
          <p className="max-w-[34ch] text-ink-soft">{archive.description}</p>
        </div>
        <ol className="mt-12 border-t-2 border-ink">
          {editions.map((edition) => {
            const status = editionStatus(edition)
            const bg = normalizeHex(edition.keyColor)
            const rowStyle = { "--row-bg": bg, "--row-fg": contrastOn(bg) } as React.CSSProperties
            return (
              <li key={edition.id} className="reveal">
                <Link
                  href={editionHref(edition)}
                  style={rowStyle}
                  className="archive-row relative grid grid-cols-[auto_1fr_auto] items-center gap-x-4 gap-y-3 border-b-2 border-ink px-2 py-7 sm:gap-x-5 md:grid-cols-[6.5rem_7rem_1fr_auto_3rem] md:px-5 md:py-10"
                >
                  <span className="font-display text-5xl leading-none font-bold tracking-[-0.04em] md:text-7xl">
                    {pad2(edition.number)}
                  </span>
                  <span className="font-display text-xl font-bold md:text-2xl">{edition.year}</span>
                  <span className="order-last col-span-full md:order-none md:col-span-1">
                    <strong className="block text-2xl font-extrabold tracking-[-0.03em] md:text-[2rem]">
                      {edition.data.title}
                    </strong>
                    <span className="mt-1.5 block text-[15px] opacity-80">
                      {[edition.data.dateLabel, edition.data.venue].filter(Boolean).join(" · ")}
                    </span>
                  </span>
                  <span className={`chip ${status === "ended" ? "" : "chip-dot"}`}>{STATUS_LABEL[status]}</span>
                  <ArrowRight className="archive-arrow hidden size-8 md:block" />
                  {edition.data.poster.url && (
                    <img
                      src={edition.data.poster.url}
                      alt=""
                      loading="lazy"
                      className="archive-peek pointer-events-none absolute top-1/2 right-[15rem] z-10 hidden w-36 border-2 border-ink shadow-[6px_6px_0_var(--ink)] [@media(hover:hover)_and_(min-width:1024px)]:block"
                    />
                  )}
                </Link>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}

function AboutSection({ about }: { about: SiteSettings["about"] }) {
  return (
    <section id="about" aria-labelledby="about-title" className="border-b-2 border-ink bg-cream py-20 md:py-28">
      <div className="site-container">
        <p className="eyebrow text-coral-deep">About</p>
        <h2
          id="about-title"
          className="reveal mt-5 max-w-[24ch] text-[clamp(2rem,4.6vw,4.25rem)] leading-[1.18] font-black tracking-[-0.045em]"
        >
          <WithHighlight text={about.title} highlight={about.highlight} className="bg-coral px-2 whitespace-nowrap" />
        </h2>
        <div className="mt-12 grid gap-8 md:grid-cols-2 md:gap-16">
          {about.paragraphs.map((p, i) => (
            <p key={i} className="text-lg leading-[1.85] text-ink-soft">
              {p}
            </p>
          ))}
        </div>
        {about.principles.length > 0 && (
          <ol className="mt-16 grid border-t-2 border-ink md:grid-cols-3">
            {about.principles.map((principle, i) => (
              <li
                key={i}
                className="reveal border-b border-ink/25 py-8 md:border-b-0 md:pr-10 md:[&:not(:first-child)]:border-l md:[&:not(:first-child)]:border-ink md:[&:not(:first-child)]:pl-10"
              >
                <span className="font-display text-sm font-bold text-coral-deep">{pad2(i + 1)}</span>
                <h3 className="mt-3 text-2xl font-extrabold tracking-[-0.03em]">{principle.title}</h3>
                <p className="mt-3 leading-relaxed text-ink-soft">{principle.body}</p>
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  )
}

const TILE_SPAN: Record<HighlightTile["size"], string> = {
  "1x1": "col-span-1",
  "2x1": "col-span-2",
  "3x1": "col-span-2 lg:col-span-3",
  "2x2": "col-span-2 lg:row-span-2",
}

function TileLink({ tile }: { tile: HighlightTile }) {
  const href = safeHref(tile.linkUrl)
  if (!href) return null
  const external = /^https?:\/\//.test(href)
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="text-link mt-3 self-start"
    >
      {tile.linkLabel || "자세히 보기"} <ArrowUpRight className="size-5" />
    </a>
  )
}

function Tile({ tile }: { tile: HighlightTile }) {
  const span = TILE_SPAN[tile.size] ?? "col-span-1"
  if (tile.kind === "photo") {
    return (
      <figure className={`reveal relative min-h-72 overflow-hidden border-2 border-ink ${span}`}>
        {tile.imageUrl && (
          <img src={tile.imageUrl} alt={tile.title} loading="lazy" className="absolute inset-0 size-full object-cover" />
        )}
        {(tile.title || tile.body) && (
          <figcaption className="absolute inset-x-0 bottom-0 border-t-2 border-ink bg-ink/90 px-5 py-4 text-cream">
            {tile.title && <strong className="block">{tile.title}</strong>}
            {tile.body && <span className="text-sm text-cream/75">{tile.body}</span>}
          </figcaption>
        )}
      </figure>
    )
  }

  const bg = normalizeHex(tile.color, "#fcedce")
  const style = { background: bg, color: contrastOn(bg) }

  if (tile.kind === "stat") {
    return (
      <div className={`reveal flex min-h-44 flex-col justify-between gap-6 border-2 border-ink p-5 md:min-h-52 md:p-6 ${span}`} style={style}>
        <p className="font-semibold">{tile.title}</p>
        <div>
          <p className="font-display text-6xl leading-none font-bold tracking-[-0.05em] md:text-7xl">
            {tile.value}
            {tile.unit && <span className="ml-1 font-sans text-2xl font-extrabold">{tile.unit}</span>}
          </p>
          {tile.body && <p className="mt-3 text-sm opacity-80">{tile.body}</p>}
        </div>
      </div>
    )
  }

  if (tile.kind === "feature") {
    return (
      <article className={`reveal grid grid-cols-[auto_1fr] items-center gap-5 border-2 border-ink p-5 sm:gap-6 sm:p-6 ${span}`} style={style}>
        {tile.imageUrl && (
          <img src={tile.imageUrl} alt="" loading="lazy" className="w-20 border border-ink shadow-[5px_5px_0_var(--ink)] sm:w-24 md:w-28" />
        )}
        <div className="flex flex-col">
          {tile.kicker && <p className="eyebrow text-coral-deep">{tile.kicker}</p>}
          <h3 className="mt-2 text-2xl font-extrabold tracking-[-0.03em]">{tile.title}</h3>
          {tile.body && <p className="mt-2 leading-relaxed opacity-80">{tile.body}</p>}
          <TileLink tile={tile} />
        </div>
      </article>
    )
  }

  return (
    <article className={`reveal flex flex-col justify-between gap-6 border-2 border-ink p-6 md:p-8 ${span}`} style={style}>
      {tile.kicker && <p className="eyebrow opacity-60">{tile.kicker}</p>}
      <div>
        <h3 className="text-[clamp(1.75rem,3.4vw,2.75rem)] leading-tight font-extrabold tracking-[-0.04em]">{tile.title}</h3>
        {tile.body && <p className="mt-3 max-w-[52ch] opacity-75">{tile.body}</p>}
      </div>
      <TileLink tile={tile} />
    </article>
  )
}

function RecordsSection({ records }: { records: SiteSettings["records"] }) {
  if (records.tiles.length === 0) return null
  return (
    <section id="records" aria-labelledby="records-title" className="border-b-2 border-ink bg-paper py-20 md:py-28">
      <div className="site-container">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow text-coral-deep">Records</p>
            <h2 id="records-title" className="mt-3 text-[clamp(2.25rem,5vw,4rem)] font-black tracking-[-0.05em]">
              {records.title}
            </h2>
          </div>
          <p className="max-w-[36ch] text-ink-soft">{records.description}</p>
        </div>
        <div className="mt-12 grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
          {records.tiles.map((tile, i) => (
            <Tile key={i} tile={tile} />
          ))}
        </div>
        {records.note && <p className="mt-6 text-[13px] text-ink-soft">{records.note}</p>}
      </div>
    </section>
  )
}

function PartnersSection({ partners, copy }: { partners: Partner[]; copy: SiteSettings["partners"] }) {
  const withLogo = partners.filter((p) => p.logoUrl)
  if (withLogo.length === 0) return null
  return (
    <section aria-labelledby="partners-title" className="bg-paper py-14 md:py-16">
      <div className="site-container flex flex-wrap items-baseline justify-between gap-3">
        <h2 id="partners-title" className="text-xl font-extrabold tracking-[-0.02em]">
          {copy.title}
        </h2>
        <p className="text-sm text-ink-soft">{copy.description}</p>
      </div>
      <Marquee label={`${copy.title} 로고`} className="mt-8" duration="45s">
        {withLogo.map((partner) => (
          <div key={partner.id} className="flex h-20 w-44 shrink-0 items-center justify-center px-5 sm:w-48 sm:px-6">
            <img
              src={partner.logoUrl}
              alt={partner.name}
              loading="lazy"
              className={`max-h-12 max-w-[140px] object-contain sm:max-w-[150px] ${partner.temporary ? "brightness-0" : "grayscale"}`}
            />
          </div>
        ))}
      </Marquee>
      {copy.note && <p className="site-container mt-6 text-xs text-ink-soft">{copy.note}</p>}
    </section>
  )
}

export default async function HomePage() {
  const [settings, editions, current, partners] = await Promise.all([
    getSiteSettings(),
    getEditions(),
    getCurrentEdition(),
    getPartners(),
  ])

  return (
    <>
      <SiteHeader />
      <main>
        <Hero hero={settings.hero} edition={current} />
        <SloganBand slogans={settings.slogans} />
        <NowSection edition={current} />
        <ArchiveSection editions={editions} archive={settings.archive} />
        <AboutSection about={settings.about} />
        <RecordsSection records={settings.records} />
        <PartnersSection partners={partners} copy={settings.partners} />
      </main>
      <SiteFooter />
    </>
  )
}
