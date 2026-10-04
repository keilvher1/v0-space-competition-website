import { unstable_cache } from "next/cache"
import { requireAdmin } from "@/lib/auth/session"
import { hasDatabase, query } from "@/lib/db"
import { DEFAULT_EDITIONS, DEFAULT_FAQS, DEFAULT_PARTNERS, DEFAULT_SETTINGS } from "./defaults"
import type { Announcement, Edition, Faq, MediaItem, Partner, SiteSettings } from "./types"
import { normalizeEditionData, normalizeWith } from "./utils"

export const CMS_TAG = "cms"

// ── DB 행 → 타입 ────────────────────────────────────────

type Row = Record<string, unknown>
const iso = (v: unknown) => (v instanceof Date ? v.toISOString() : v ? String(v) : null)

export function toEdition(r: Row): Edition {
  return {
    id: String(r.id),
    number: Number(r.number),
    year: Number(r.year),
    slug: String(r.slug),
    published: Boolean(r.published),
    pageMode: r.page_mode === "external" ? "external" : "cms",
    externalUrl: String(r.external_url ?? ""),
    keyColor: String(r.key_color ?? "#2bb6e3"),
    data: normalizeEditionData(r.data),
  }
}

export function toFaq(r: Row): Faq {
  return {
    id: String(r.id),
    question: String(r.question),
    answer: String(r.answer),
    editionNumber: r.edition_number === null || r.edition_number === undefined ? null : Number(r.edition_number),
    sort: Number(r.sort ?? 0),
    published: Boolean(r.published),
  }
}

export function toAnnouncement(r: Row): Announcement {
  return {
    id: String(r.id),
    title: String(r.title),
    excerpt: String(r.excerpt ?? ""),
    body: String(r.body ?? ""),
    featured: Boolean(r.featured),
    published: Boolean(r.published),
    publishedAt: iso(r.published_at),
    createdAt: iso(r.created_at) ?? new Date(0).toISOString(),
  }
}

export function toPartner(r: Row): Partner {
  return {
    id: String(r.id),
    name: String(r.name),
    logoUrl: String(r.logo_url ?? ""),
    linkUrl: String(r.link_url ?? ""),
    temporary: Boolean(r.temporary),
    editions: Array.isArray(r.editions) ? (r.editions as unknown[]).map(Number) : [],
    sort: Number(r.sort ?? 0),
    published: Boolean(r.published),
  }
}

export function toMedia(r: Row): MediaItem {
  return {
    id: String(r.id),
    url: String(r.url),
    pathname: String(r.pathname),
    contentType: String(r.content_type ?? ""),
    size: Number(r.size ?? 0),
    alt: String(r.alt ?? ""),
    createdAt: iso(r.created_at) ?? new Date(0).toISOString(),
  }
}

// ── 공개 페이지용: 캐시 + DB 장애 시 기본값 ─────────────

/** DB 조회 결과만 캐시한다. 장애 때 쓴 기본값은 캐시하지 않으므로 DB가 돌아오면 바로 원래 내용이 나온다. */
function cmsQuery<T>(key: string, fallback: T, load: () => Promise<T>) {
  const cachedLoad = unstable_cache(load, ["cms", key], { tags: [CMS_TAG], revalidate: 300 })
  return async (): Promise<T> => {
    if (!hasDatabase()) return fallback
    try {
      return await cachedLoad()
    } catch (error) {
      console.error(`[cms] ${key} 조회 실패, 기본값을 씁니다`, error)
      return fallback
    }
  }
}

export const getSiteSettings = cmsQuery("settings", DEFAULT_SETTINGS, async () => {
  const rows = await query(`select value from cms_settings where key = 'site'`)
  return normalizeWith(DEFAULT_SETTINGS, rows[0]?.value)
})

export const getEditions = cmsQuery("editions", DEFAULT_EDITIONS, async () => {
  const rows = await query(`select * from cms_editions where published order by number desc`)
  return rows.map(toEdition)
})

export const getFaqs = cmsQuery("faqs", DEFAULT_FAQS, async () => {
  const rows = await query(
    `select * from cms_faqs where published order by edition_number desc nulls last, sort asc, created_at asc`,
  )
  return rows.map(toFaq)
})

export const getPartners = cmsQuery("partners", DEFAULT_PARTNERS, async () => {
  const rows = await query(`select * from cms_partners where published order by sort asc, created_at asc`)
  return rows.map(toPartner)
})

export const getAnnouncements = cmsQuery<Announcement[]>("announcements", [], async () => {
  const rows = await query(
    `select * from cms_announcements where published
     order by featured desc, coalesce(published_at, created_at) desc`,
  )
  return rows.map(toAnnouncement)
})

export async function getEdition(slug: string) {
  return (await getEditions()).find((e) => e.slug === slug) ?? null
}

/** 메인과 헤더에서 쓰는 '현재 회차': 공개된 회차 중 가장 최근 회차 */
export async function getCurrentEdition() {
  return (await getEditions())[0] ?? DEFAULT_EDITIONS[0]
}

export async function getAnnouncement(id: string) {
  return (await getAnnouncements()).find((a) => a.id === id) ?? null
}

// ── 관리자 화면용: 캐시 없이 비공개 항목까지 ────────────

/**
 * 관리자 데이터는 읽을 때마다 로그인을 확인한다. 화면 전환(RSC) 요청에서는 (panel) 레이아웃의
 * 확인이 다시 실행되지 않을 수 있어서 레이아웃에만 의존하면 비공개 내용이 새어 나갈 수 있다.
 */
function guarded<T extends Record<string, (...args: never[]) => Promise<unknown>>>(queries: T): T {
  return Object.fromEntries(
    Object.entries(queries).map(([name, fn]) => [
      name,
      async (...args: unknown[]) => {
        await requireAdmin()
        return (fn as (...a: unknown[]) => Promise<unknown>)(...args)
      },
    ]),
  ) as unknown as T
}

export const admin = guarded({
  async settings() {
    const rows = await query(`select value from cms_settings where key = 'site'`)
    return normalizeWith(DEFAULT_SETTINGS, rows[0]?.value) as SiteSettings
  },
  async editions() {
    return (await query(`select * from cms_editions order by number desc`)).map(toEdition)
  },
  async edition(id: string) {
    const rows = await query(`select * from cms_editions where id = $1`, [id])
    return rows[0] ? toEdition(rows[0]) : null
  },
  async announcements() {
    return (await query(`select * from cms_announcements order by created_at desc`)).map(toAnnouncement)
  },
  async announcement(id: string) {
    const rows = await query(`select * from cms_announcements where id = $1`, [id])
    return rows[0] ? toAnnouncement(rows[0]) : null
  },
  async faqs() {
    return (
      await query(`select * from cms_faqs order by edition_number desc nulls last, sort asc, created_at asc`)
    ).map(toFaq)
  },
  async faq(id: string) {
    const rows = await query(`select * from cms_faqs where id = $1`, [id])
    return rows[0] ? toFaq(rows[0]) : null
  },
  async partners() {
    return (await query(`select * from cms_partners order by sort asc, created_at asc`)).map(toPartner)
  },
  async partner(id: string) {
    const rows = await query(`select * from cms_partners where id = $1`, [id])
    return rows[0] ? toPartner(rows[0]) : null
  },
  async media() {
    return (await query(`select * from cms_media order by created_at desc`)).map(toMedia)
  },
  async counts() {
    const rows = await query<{ t: string; n: string }>(
      `select 'editions' t, count(*) n from cms_editions union all
       select 'announcements', count(*) from cms_announcements union all
       select 'faqs', count(*) from cms_faqs union all
       select 'partners', count(*) from cms_partners union all
       select 'media', count(*) from cms_media`,
    )
    return Object.fromEntries(rows.map((r) => [r.t, Number(r.n)])) as Record<string, number>
  },
})
