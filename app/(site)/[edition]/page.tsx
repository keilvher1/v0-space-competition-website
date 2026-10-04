import type React from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { SiteHeader } from "@/components/site/site-header"
import { SiteFooter } from "@/components/site/site-footer"
import { Paragraphs } from "@/components/site/text"
import { ArrowRight, ArrowUpRight } from "@/components/site/icons"
import { getEdition, getEditions, getFaqs, getPartners } from "@/lib/cms/queries"
import { editionHref } from "@/lib/cms/links"
import { videoEmbedUrl } from "@/lib/cms/embed"
import type { Edition } from "@/lib/cms/types"
import { STATUS_LABEL, contrastOn, editionStatus, editionTheme, normalizeHex, pad2, safeHref, themeVars } from "@/lib/cms/utils"

export const revalidate = 300

export async function generateStaticParams() {
  const editions = await getEditions()
  return editions.filter((e) => e.pageMode === "cms").map((e) => ({ edition: e.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ edition: string }> }): Promise<Metadata> {
  const edition = await getEdition((await params).edition)
  if (!edition) return {}
  return {
    title: `${edition.data.title} · ${edition.year}`,
    description: edition.data.tagline || undefined,
    openGraph: edition.data.poster.url ? { images: [{ url: edition.data.poster.url }] } : undefined,
  }
}

function SectionTitle({ eyebrow, title, id, onDark }: { eyebrow: string; title: string; id: string; onDark?: boolean }) {
  return (
    <div>
      <p className="eyebrow" style={{ color: onDark ? "var(--accent-1)" : "var(--coral-deep)" }}>
        {eyebrow}
      </p>
      <h2 id={id} className="mt-3 text-[clamp(2rem,4.4vw,3.5rem)] leading-tight font-black tracking-[-0.045em]">
        {title}
      </h2>
    </div>
  )
}

function external(url: string) {
  return /^https?:\/\//.test(url) ? { target: "_blank", rel: "noopener noreferrer" } : {}
}

function Hero({ edition }: { edition: Edition }) {
  const { data } = edition
  const status = editionStatus(edition)
  const theme = editionTheme(edition)
  const words = data.hero.titleWords.length ? data.hero.titleWords : [data.title]
  const posterLink = safeHref(data.poster.originalUrl) ?? safeHref(data.poster.url)
  const dark = theme.onDeep !== "#052031"

  return (
    <section
      className={`starfield relative overflow-hidden border-b-2 border-ink ${dark ? "on-dark" : ""}`}
      style={{ background: "var(--key-deep)", color: "var(--on-deep)" }}
    >
      <div className="site-container grid gap-14 pt-12 pb-16 md:grid-cols-[1.25fr_0.75fr] md:items-center md:pt-16 md:pb-24">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="eyebrow opacity-70">{data.hero.eyebrow || `Archive · No.${pad2(edition.number)} · ${edition.year}`}</span>
            <span className={`chip ${status === "ended" ? "" : "chip-dot"}`}>
              {status === "ended" ? "종료된 대회" : STATUS_LABEL[status]}
            </span>
          </div>
          <h1 className="mt-8 leading-[1.02] font-black tracking-[-0.045em]">
            {data.hero.titleTop && (
              <span className="block text-[clamp(1.5rem,3vw,2.25rem)] tracking-[-0.03em]">{data.hero.titleTop}</span>
            )}
            <span className="mt-2 block text-[clamp(3.25rem,10vw,8.5rem)]">
              {words.map((word, i) => (
                <span key={i} style={{ color: theme.accents[i % theme.accents.length] }}>
                  {word}
                  {i === 1 && words.length === 4 && <br className="sm:hidden" />}
                </span>
              ))}
            </span>
          </h1>
          {(data.hero.subtitle || data.tagline) && (
            <p className="mt-8 text-xl font-semibold md:text-2xl">{data.hero.subtitle || data.tagline}</p>
          )}
          {data.facts.length > 0 && (
            <dl
              className="mt-10 grid grid-cols-2 gap-[2px] border-2 md:grid-cols-4"
              style={{ borderColor: "var(--on-deep)", background: "var(--on-deep)" }}
            >
              {data.facts.map((fact) => (
                <div key={fact.label} className="px-4 py-4" style={{ background: "var(--key)", color: "var(--on-key)" }}>
                  <dt className="text-[13px] font-semibold opacity-70">{fact.label}</dt>
                  <dd className="mt-1 text-[17px] leading-snug font-extrabold tracking-[-0.02em] md:text-lg">{fact.value}</dd>
                  {fact.sub && <dd className="mt-0.5 text-[13px] opacity-70">{fact.sub}</dd>}
                </div>
              ))}
            </dl>
          )}
        </div>
        {data.poster.url && (
          <figure className="mx-auto w-[min(100%,340px)]">
            <a
              href={posterLink ?? undefined}
              target="_blank"
              rel="noopener noreferrer"
              className="poster-tilt block border-2 bg-cream p-2.5"
              style={{ borderColor: "var(--on-deep)", boxShadow: `10px 10px 0 ${theme.accents[2] ?? theme.accents[0]}` }}
              aria-label={posterLink ? `${data.title} 포스터 크게 보기, 새 창` : undefined}
            >
              <img
                src={data.poster.url}
                width={data.poster.width || undefined}
                height={data.poster.height || undefined}
                alt={data.poster.alt || `${data.title} 포스터`}
              />
            </a>
            {posterLink && <figcaption className="mt-6 text-center text-sm opacity-75">포스터를 누르면 크게 볼 수 있습니다</figcaption>}
          </figure>
        )}
      </div>
    </section>
  )
}

function ApplySection({ edition }: { edition: Edition }) {
  const { apply } = edition.data
  const status = editionStatus(edition)
  const participantUrl = safeHref(apply.participantUrl)
  const observerUrl = safeHref(apply.observerUrl)
  if (status === "ended" || (!participantUrl && !observerUrl)) return null
  const open = status === "recruiting"
  return (
    <section id="apply" aria-labelledby="apply-title" className="border-b-2 border-ink bg-paper py-20 md:py-24">
      <div className="site-container">
        <SectionTitle eyebrow="Apply" title={open ? "함께하는 방법" : "신청이 마감되었습니다"} id="apply-title" />
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {[
            { url: participantUrl, title: "내 실패담을 들려주고 싶다면", label: "참가 신청하기", tone: "btn-coral" },
            { url: observerUrl, title: "듣고, 응원하고 싶다면", label: "참관 신청하기", tone: "btn-ink" },
          ]
            .filter((c) => c.url)
            .map((card) => (
              <div key={card.label} className="reveal flex flex-col gap-6 border-2 border-ink bg-cream p-7">
                <h3 className="text-2xl font-extrabold tracking-[-0.03em]">{card.title}</h3>
                {open ? (
                  <a href={card.url ?? undefined} target="_blank" rel="noopener noreferrer" className={`btn ${card.tone} self-start`}>
                    {card.label} <ArrowUpRight />
                  </a>
                ) : (
                  <span className="btn self-start bg-line text-ink-soft">접수 마감</span>
                )}
              </div>
            ))}
        </div>
        {apply.note && <p className="mt-6 max-w-[80ch] text-sm text-ink-soft">{apply.note}</p>}
      </div>
    </section>
  )
}

function IntroSection({ edition }: { edition: Edition }) {
  const { intro } = edition.data
  if (intro.cards.length === 0) return null
  return (
    <section aria-labelledby="intro-title" className="border-b-2 border-ink bg-paper py-20 md:py-24">
      <div className="site-container">
        <SectionTitle eyebrow="About" title={intro.title || "대회 소개"} id="intro-title" />
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {intro.cards.map((card, i) => {
            const key = card.tone === "key"
            return (
              <article
                key={i}
                className="reveal border-2 border-ink p-7 md:p-9"
                style={key ? { background: "var(--key)", color: "var(--on-key)" } : { background: "var(--cream)" }}
              >
                <h3 className="text-2xl font-extrabold tracking-[-0.03em]">{card.title}</h3>
                {card.lead && <p className="mt-5 text-xl leading-snug font-bold">{card.lead}</p>}
                <div className="mt-5 space-y-4 leading-[1.85] opacity-85">
                  <Paragraphs text={card.body} />
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function TimelineSection({ edition }: { edition: Edition }) {
  const { timeline } = edition.data
  if (timeline.length === 0) return null
  const cols = timeline.length >= 4 ? "md:grid-cols-4" : timeline.length === 3 ? "md:grid-cols-3" : "md:grid-cols-2"
  return (
    <section aria-labelledby="timeline-title" className="border-b-2 border-ink bg-cream py-20 md:py-24">
      <div className="site-container">
        <SectionTitle eyebrow="Timeline" title="대회 일정" id="timeline-title" />
        <ol className={`mt-12 grid border-t-2 border-ink ${cols}`}>
          {timeline.map((step, i) => (
            <li
              key={i}
              className="reveal relative border-b border-ink/25 py-8 md:border-b-0 md:pr-8 md:[&:not(:first-child)]:border-l md:[&:not(:first-child)]:border-ink md:[&:not(:first-child)]:pl-8"
            >
              <span className="font-display text-sm font-bold text-coral-deep">STEP {pad2(i + 1)}</span>
              <p className="mt-3 font-display text-lg font-bold tracking-[-0.01em]">{step.date}</p>
              <h3 className="mt-2 text-2xl font-extrabold tracking-[-0.03em]">{step.title}</h3>
              {step.body && <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{step.body}</p>}
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

function RulesSection({ edition }: { edition: Edition }) {
  const { rules, awards } = edition.data
  if (rules.length === 0 && awards.length === 0) return null
  return (
    <section aria-labelledby="rules-title" className="border-b-2 border-ink bg-paper py-20 md:py-24">
      <div className="site-container grid gap-12 lg:grid-cols-[1.3fr_1fr]">
        {rules.length > 0 && (
          <div>
            <SectionTitle eyebrow="Rules" title="참가 방식" id="rules-title" />
            <dl className="mt-10 border-t-2 border-ink">
              {rules.map((rule, i) => (
                <div key={i} className="reveal grid gap-2 border-b border-line py-5 sm:grid-cols-[8rem_1fr] sm:gap-6">
                  <dt className="font-extrabold">{rule.title}</dt>
                  <dd className="leading-relaxed text-ink-soft">{rule.body}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}
        {awards.length > 0 && (
          <div>
            <SectionTitle eyebrow="Awards" title="시상" id="awards-title" />
            <div className="mt-10 space-y-4">
              {awards.map((award, i) => {
                const bg = normalizeHex(award.color, "#fcedce")
                return (
                  <div key={i} className="reveal border-2 border-ink p-6" style={{ background: bg, color: contrastOn(bg) }}>
                    {award.label && <p className="text-sm font-semibold">{award.label}</p>}
                    <p className="mt-2 text-xl font-extrabold tracking-[-0.02em]">{award.title}</p>
                    {award.body && <p className="mt-1 text-xl font-extrabold tracking-[-0.02em]">{award.body}</p>}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

function RecordsSection({ edition }: { edition: Edition }) {
  const { photos, press, features, stats } = edition.data
  if (photos.length + press.length + features.length + stats.length === 0) return null
  const [lead, ...restPhotos] = photos
  const dark = editionTheme(edition).onKey !== "#052031"
  return (
    <section
      aria-labelledby="scene-title"
      className={`starfield border-b-2 border-ink py-20 md:py-24 ${dark ? "on-dark" : ""}`}
      style={{ background: "var(--key)", color: "var(--on-key)" }}
    >
      <div className="site-container">
        <SectionTitle eyebrow="Records" title="그날의 기록" id="scene-title" onDark={dark} />
        {stats.length > 0 && (
          <dl className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4">
            {stats.map((s, i) => (
              <div key={i} className="reveal border-2 border-current p-5">
                <dt className="text-sm font-semibold opacity-75">{s.label}</dt>
                <dd className="mt-3 font-display text-5xl leading-none font-bold tracking-[-0.05em]">
                  {s.value}
                  {s.unit && <span className="ml-1 font-sans text-xl font-extrabold">{s.unit}</span>}
                </dd>
                {s.note && <dd className="mt-2 text-xs opacity-70">{s.note}</dd>}
              </div>
            ))}
          </dl>
        )}
        <div className="mt-12 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          {lead && (
            <figure className="reveal border-2 border-ink bg-cream text-ink">
              <img src={lead.url} alt={lead.alt} loading="lazy" className="w-full" />
              {lead.caption && <figcaption className="border-t-2 border-ink px-5 py-4 text-[15px] font-semibold">{lead.caption}</figcaption>}
            </figure>
          )}
          <div className="grid content-start gap-6">
            {press.map((item, i) => (
              <article key={i} className="reveal border-2 border-current p-6">
                <p className="eyebrow opacity-60">
                  Press · {item.outlet}
                  {item.date && ` · ${item.date}`}
                </p>
                <h3 className="mt-3 text-2xl font-extrabold tracking-[-0.03em]">{item.title}</h3>
                {item.summary && <p className="mt-2 leading-relaxed opacity-75">{item.summary}</p>}
                <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
                  {safeHref(item.url) && (
                    <a href={safeHref(item.url)!} {...external(item.url)} className="text-link">
                      기사 읽기 <ArrowUpRight className="size-5" />
                    </a>
                  )}
                  {safeHref(item.secondaryUrl) && (
                    <a href={safeHref(item.secondaryUrl)!} {...external(item.secondaryUrl)} className="text-sm underline underline-offset-4 opacity-75">
                      다른 게재본
                    </a>
                  )}
                </div>
              </article>
            ))}
            {features.map((f, i) => (
              <article key={i} className="reveal grid grid-cols-[auto_1fr] items-center gap-5 border-2 border-ink bg-cream p-6 text-ink">
                {f.imageUrl && <img src={f.imageUrl} alt="" loading="lazy" className="w-20 border border-ink" />}
                <div className={f.imageUrl ? "" : "col-span-2"}>
                  {f.kicker && <p className="eyebrow text-coral-deep">{f.kicker}</p>}
                  <h3 className="mt-1 text-xl font-extrabold tracking-[-0.02em]">{f.title}</h3>
                  {f.body && <p className="mt-1 text-[15px] leading-relaxed text-ink-soft">{f.body}</p>}
                  {safeHref(f.linkUrl) && (
                    <a href={safeHref(f.linkUrl)!} {...external(f.linkUrl)} className="text-link mt-2 text-[15px]">
                      {f.linkLabel || "자세히 보기"} <ArrowUpRight className="size-5" />
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
        {restPhotos.length > 0 && (
          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3">
            {restPhotos.map((p, i) => (
              <figure key={i} className="reveal border-2 border-ink bg-cream text-ink">
                <img src={p.url} alt={p.alt} loading="lazy" className="aspect-[4/3] w-full object-cover" />
                {p.caption && <figcaption className="px-3 py-2 text-[13px] font-semibold">{p.caption}</figcaption>}
              </figure>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function VideoSection({ edition }: { edition: Edition }) {
  const { video } = edition.data
  const src = video.url ? videoEmbedUrl(video.url) : null
  if (!src) return null
  return (
    <section aria-labelledby="video-title" className="border-b-2 border-ink bg-paper py-20 md:py-24">
      <div className={`site-container grid items-center gap-12 ${video.portrait ? "md:grid-cols-[1fr_330px]" : ""}`}>
        <div>
          <SectionTitle eyebrow="Video" title={video.title || "대회 영상"} id="video-title" />
          {video.body && <p className="mt-6 max-w-[40ch] text-lg leading-relaxed text-ink-soft">{video.body}</p>}
        </div>
        <div
          className={`reveal mx-auto w-full border-2 border-ink bg-ink p-2 ${video.portrait ? "max-w-[330px]" : "max-w-4xl"}`}
          style={{ boxShadow: "8px 8px 0 var(--key)" }}
        >
          <div className={`relative ${video.portrait ? "aspect-[9/16]" : "aspect-video"}`}>
            <iframe
              src={src}
              title={video.title || `${edition.data.title} 영상`}
              allow="autoplay; fullscreen; picture-in-picture"
              loading="lazy"
              className="absolute inset-0 size-full"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

const SM_COLS = ["", "sm:grid-cols-1", "sm:grid-cols-2", "sm:grid-cols-3", "sm:grid-cols-4"]

async function OrganizersSection({ edition }: { edition: Edition }) {
  const partners = (await getPartners()).filter((p) => p.logoUrl && p.editions.includes(edition.number))
  if (partners.length === 0) return null
  // 칸 수가 줄에 딱 맞지 않으면 빈 칸이 테두리색으로 칠해지므로, 열 수를 로고 수에 맞추고 남는 칸은 채운다
  const n = partners.length
  const cols = Math.min(n, 4)
  const fillWide = (cols - (n % cols)) % cols
  const fillNarrow = n > 1 ? n % 2 : 0
  return (
    <section aria-labelledby="org-title" className="border-b-2 border-ink bg-cream py-16">
      <div className="site-container">
        <h2 id="org-title" className="text-xl font-extrabold tracking-[-0.02em]">
          {edition.data.organizersTitle || "함께한 기관"}
        </h2>
        <ul className={`mt-8 grid gap-[2px] border-2 border-ink bg-ink ${n > 1 ? "grid-cols-2" : "grid-cols-1"} ${SM_COLS[cols]}`}>
          {partners.map((p) => (
            <li key={p.id} className="flex h-24 items-center justify-center bg-paper px-5 sm:h-28 sm:px-6">
              <img
                src={p.logoUrl}
                alt={p.name}
                loading="lazy"
                className={`max-h-12 max-w-[140px] object-contain ${p.temporary ? "brightness-0" : ""}`}
              />
            </li>
          ))}
          {Array.from({ length: Math.max(fillWide, fillNarrow) }, (_, i) => (
            <li
              key={`fill-${i}`}
              aria-hidden="true"
              className={`bg-paper ${i < fillNarrow ? "" : "hidden"} ${i < fillWide ? "sm:block" : "sm:hidden"}`}
            />
          ))}
        </ul>
      </div>
    </section>
  )
}

async function EditionFaqSection({ edition }: { edition: Edition }) {
  const faqs = (await getFaqs()).filter((f) => f.editionNumber === edition.number)
  if (faqs.length === 0) return null
  return (
    <section aria-labelledby="faq-title" id="faq" className="border-b-2 border-ink bg-paper py-20 md:py-24">
      <div className="site-container grid gap-10 md:grid-cols-[0.8fr_1.2fr]">
        <SectionTitle eyebrow="FAQ" title="궁금한 점이 있나요?" id="faq-title" />
        <div className="border-t-2 border-ink">
          {faqs.map((faq) => (
            <details key={faq.id} className="group border-b border-line">
              <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 py-5 text-lg font-bold [&::-webkit-details-marker]:hidden">
                {faq.question}
                <span aria-hidden="true" className="font-display text-2xl leading-none transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="pr-10 pb-6 leading-[1.85] whitespace-pre-line text-ink-soft">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

function EditionNav({ edition, editions }: { edition: Edition; editions: Edition[] }) {
  const prev = editions.find((e) => e.number === edition.number - 1)
  const next = editions.find((e) => e.number === edition.number + 1)
  // 이전 회차는 왼쪽, 다음 회차는 오른쪽. 하나뿐이면 전체 폭을 쓴다
  const items = [
    prev && { label: `Previous · No.${pad2(prev.number)} · ${prev.year}`, edition: prev, dir: "prev" as const },
    next && { label: `Next · No.${pad2(next.number)} · ${next.year}`, edition: next, dir: "next" as const },
  ].filter(Boolean) as { label: string; edition: Edition; dir: "prev" | "next" }[]
  if (items.length === 0) return null
  return (
    <nav aria-label="다른 회차" className={`grid ${items.length > 1 ? "md:grid-cols-2" : ""}`}>
      {items.map(({ label, edition: target, dir }) => {
        const bg = normalizeHex(target.keyColor)
        return (
          <Link
            key={target.id}
            href={editionHref(target)}
            className="group block border-b-2 border-ink transition-[filter] hover:brightness-110 md:[&:not(:first-child)]:border-l-2"
            style={{ background: bg, color: contrastOn(bg) } as React.CSSProperties}
          >
            <div
              className={`flex items-center gap-6 py-12 md:py-16 ${items.length === 1 ? "site-container" : "px-5 md:px-10"} ${
                dir === "prev" ? "flex-row-reverse justify-end" : "justify-between"
              }`}
            >
              <div>
                <p className="eyebrow">{label}</p>
                <p className="mt-3 text-[clamp(1.75rem,4vw,3.25rem)] leading-tight font-black tracking-[-0.05em]">
                  {target.data.title}
                </p>
              </div>
              <ArrowRight
                className={`size-12 shrink-0 transition-transform ${
                  dir === "prev" ? "rotate-180 group-hover:-translate-x-2" : "group-hover:translate-x-2"
                }`}
              />
            </div>
          </Link>
        )
      })}
    </nav>
  )
}

export default async function EditionPage({ params }: { params: Promise<{ edition: string }> }) {
  const slug = (await params).edition
  const [edition, editions] = await Promise.all([getEdition(slug), getEditions()])
  if (!edition || edition.pageMode !== "cms") notFound()

  return (
    <>
      <SiteHeader />
      <main style={themeVars(editionTheme(edition)) as React.CSSProperties}>
        <Hero edition={edition} />
        <ApplySection edition={edition} />
        <IntroSection edition={edition} />
        <TimelineSection edition={edition} />
        <RulesSection edition={edition} />
        <RecordsSection edition={edition} />
        <VideoSection edition={edition} />
        <OrganizersSection edition={edition} />
        <EditionFaqSection edition={edition} />
        <EditionNav edition={edition} editions={editions} />
      </main>
      <SiteFooter />
    </>
  )
}
