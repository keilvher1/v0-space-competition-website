import { requireAdmin } from "@/lib/auth/session"
import { query } from "@/lib/db"

// 관리자 '방문 통계'용 집계. 날짜는 한국 시간(UTC+9, 서머타임 없음) 기준이다.
// 방문자 = 날짜별 고유 방문자 수의 합(방문자 값이 날마다 바뀌므로 기간 전체의 중복 제거는 하지 않는다).

export const RANGES = [7, 30, 90] as const
export type Range = (typeof RANGES)[number]

// DB 세션 시간대와 상관없이 계산되도록 UTC 벽시계로 바꾼 뒤 9시간을 더한다
const DAY_KST = "to_char((ts at time zone 'UTC') + interval '9 hours', 'YYYY-MM-DD')"
const VISIT = `visitor || ${DAY_KST}`

type Row = Record<string, unknown>
const num = (v: unknown) => Number(v ?? 0)

/** 기간 시작: n일 전 한국 자정(오늘 포함 n일) */
function since(days: number) {
  return `((date_trunc('day', (now() at time zone 'UTC') + interval '9 hours') - interval '${days - 1} days' - interval '9 hours') at time zone 'UTC')`
}

export interface AnalyticsReport {
  days: Range
  totals: { visitors: number; views: number; applies: number; videoPlays: number }
  today: { visitors: number; views: number }
  daily: { date: string; visitors: number; views: number }[]
  pages: { path: string; views: number; visitors: number }[]
  referrers: { source: string; visits: number }[]
  devices: { device: string; visitors: number }[]
  countries: { country: string; visitors: number }[]
  events: { name: string; label: string; count: number }[]
  firstHit: string | null
}

export async function getAnalytics(days: Range): Promise<AnalyticsReport> {
  await requireAdmin()
  const from = since(days)
  const [totals, today, daily, pages, referrers, devices, countries, events, first] = await Promise.all([
    query(
      `select count(*) filter (where kind = 'view') as views,
              count(distinct ${VISIT}) filter (where kind = 'view') as visitors,
              count(*) filter (where kind = 'event' and name = 'apply') as applies,
              count(*) filter (where kind = 'event' and name = 'video') as video_plays
       from cms_hits where ts >= ${from}`,
    ),
    query(
      `select count(*) filter (where kind = 'view') as views, count(distinct visitor) filter (where kind = 'view') as visitors
       from cms_hits where ts >= ${since(1)}`,
    ),
    query(
      `select ${DAY_KST} as date, count(*) as views, count(distinct visitor) as visitors
       from cms_hits where kind = 'view' and ts >= ${from} group by 1 order by 1`,
    ),
    query(
      `select path, count(*) as views, count(distinct ${VISIT}) as visitors
       from cms_hits where kind = 'view' and ts >= ${from} group by path order by views desc limit 12`,
    ),
    query(
      `select referrer as source, count(*) as visits
       from cms_hits where kind = 'view' and name = 'entry' and ts >= ${from} group by referrer order by visits desc limit 12`,
    ),
    query(
      `select device, count(distinct ${VISIT}) as visitors
       from cms_hits where kind = 'view' and ts >= ${from} group by device order by visitors desc`,
    ),
    query(
      `select country, count(distinct ${VISIT}) as visitors
       from cms_hits where kind = 'view' and ts >= ${from} group by country order by visitors desc limit 8`,
    ),
    query(
      `select name, label, count(*) as count
       from cms_hits where kind = 'event' and ts >= ${from} group by name, label order by count desc limit 20`,
    ),
    query(`select min(ts) as first from cms_hits`),
  ])

  // 방문이 없던 날도 0으로 채운다
  const byDate = new Map((daily as Row[]).map((r) => [String(r.date), r]))
  const filled: AnalyticsReport["daily"] = []
  const todayKst = new Date(Date.now() + 9 * 60 * 60 * 1000)
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(todayKst.getTime() - i * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
    const r = byDate.get(d)
    filled.push({ date: d, visitors: num(r?.visitors), views: num(r?.views) })
  }

  const t = (totals as Row[])[0] ?? {}
  const td = (today as Row[])[0] ?? {}
  const firstTs = (first as Row[])[0]?.first
  return {
    days,
    totals: { visitors: num(t.visitors), views: num(t.views), applies: num(t.applies), videoPlays: num(t.video_plays) },
    today: { visitors: num(td.visitors), views: num(td.views) },
    daily: filled,
    pages: (pages as Row[]).map((r) => ({ path: String(r.path), views: num(r.views), visitors: num(r.visitors) })),
    referrers: (referrers as Row[]).map((r) => ({ source: String(r.source ?? ""), visits: num(r.visits) })),
    devices: (devices as Row[]).map((r) => ({ device: String(r.device ?? ""), visitors: num(r.visitors) })),
    countries: (countries as Row[]).map((r) => ({ country: String(r.country ?? ""), visitors: num(r.visitors) })),
    events: (events as Row[]).map((r) => ({ name: String(r.name), label: String(r.label ?? ""), count: num(r.count) })),
    firstHit: firstTs instanceof Date ? firstTs.toISOString() : firstTs ? String(firstTs) : null,
  }
}

/** 대시보드용 짧은 요약: 오늘·최근 7일 방문자 */
export async function getAnalyticsSummary() {
  await requireAdmin()
  const rows = await query(
    `select count(distinct visitor) filter (where ts >= ${since(1)}) as today,
            count(distinct ${VISIT}) as week
     from cms_hits where kind = 'view' and ts >= ${since(7)}`,
  )
  const r = (rows as Row[])[0] ?? {}
  return { today: num(r.today), week: num(r.week) }
}
