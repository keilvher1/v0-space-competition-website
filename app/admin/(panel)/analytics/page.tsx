import Link from "next/link"
import { BarList, DailyChart } from "@/components/admin/analytics-chart"
import { Card, PageHeader } from "@/components/admin/ui"
import { RANGES, getAnalytics, type Range } from "@/lib/cms/analytics"
import { admin } from "@/lib/cms/queries"

export const metadata = { title: "방문 통계" }

const n = (v: number) => v.toLocaleString("ko-KR")
const avg = (v: number) => (v < 10 ? v.toFixed(1) : n(Math.round(v)))

const SOURCES: [RegExp, string][] = [
  [/(^|\.)google\./, "Google 검색"],
  [/search\.naver\.com|(^|\.)naver\.com$/, "네이버"],
  [/(^|\.)daum\.net$/, "다음"],
  [/instagram\.com$/, "인스타그램"],
  [/facebook\.com$/, "페이스북"],
  [/kakao/, "카카오"],
  [/youtube\.com$|youtu\.be$/, "유튜브"],
  [/band\.us$/, "밴드"],
  [/^t\.co$|(^|\.)x\.com$|twitter\.com$/, "X(트위터)"],
  [/threads\.net$/, "스레드"],
  [/bing\.com$/, "Bing 검색"],
]

function sourceLabel(source: string) {
  if (!source) return "직접 방문·알 수 없음"
  if (source.startsWith("utm:")) return `${source.slice(4)} (캠페인 링크)`
  return SOURCES.find(([re]) => re.test(source))?.[1] ?? source
}

const DEVICE: Record<string, string> = { mobile: "휴대폰", tablet: "태블릿", desktop: "컴퓨터" }
const regions = new Intl.DisplayNames(["ko"], { type: "region" })
function countryLabel(code: string) {
  if (!code) return "알 수 없음"
  try {
    return regions.of(code) ?? code
  } catch {
    return code
  }
}

function eventLabel(name: string, label: string) {
  if (name === "apply") return label === "participant" ? "참가 신청 버튼" : label === "observer" ? "참관 신청 버튼" : "신청 링크"
  if (name === "video") return `영상 재생${label ? ` · ${label}` : ""}`
  return `외부 링크 · ${label}`
}

export default async function AnalyticsPage({ searchParams }: { searchParams: Promise<{ d?: string }> }) {
  const d = Number((await searchParams).d)
  const days: Range = (RANGES as readonly number[]).includes(d) ? (d as Range) : 30
  const [report, editions] = await Promise.all([getAnalytics(days), admin.editions()])

  const titles = new Map<string, string>([
    ["/", "메인"],
    ["/faq", "FAQ"],
    ["/announcements", "공지사항"],
  ])
  for (const e of editions) titles.set(e.pageMode === "external" && e.externalUrl ? e.externalUrl : `/${e.slug}`, e.data.title || `제${e.number}회`)
  const pageLabel = (path: string) => titles.get(path) ?? (path.startsWith("/announcements/") ? "공지 글" : path)

  const applies = report.events.filter((e) => e.name === "apply")
  const applyOf = (label: string) => applies.filter((e) => e.label === label).reduce((s, e) => s + e.count, 0)
  const deviceTotal = report.devices.reduce((s, r) => s + r.visitors, 0) || 1
  const empty = report.totals.views === 0

  return (
    <>
      <PageHeader
        title="방문 통계"
        description="사이트(제2회 페이지 포함) 방문과 신청 버튼 클릭을 집계합니다. 쿠키 없이 익명으로 세며, 검색 로봇·프리뷰·로그인한 관리자의 방문은 빼고 셉니다."
      />

      <nav aria-label="기간" className="mb-6 flex gap-2">
        {RANGES.map((r) => (
          <Link
            key={r}
            href={`/admin/analytics?d=${r}`}
            aria-current={r === days ? "page" : undefined}
            className={`rounded-full border px-4 py-2 text-sm font-bold ${r === days ? "border-ink bg-ink text-cream" : "border-line bg-white"}`}
          >
            최근 {r}일
          </Link>
        ))}
      </nav>

      <dl className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: "오늘 방문자", value: report.today.visitors, sub: `페이지뷰 ${n(report.today.views)}` },
          { label: `방문자 (${days}일)`, value: report.totals.visitors, sub: `하루 평균 ${avg(report.totals.visitors / days)}` },
          { label: `페이지뷰 (${days}일)`, value: report.totals.views, sub: report.totals.visitors ? `방문당 ${(report.totals.views / report.totals.visitors).toFixed(1)}쪽` : "" },
          { label: `신청 버튼 클릭 (${days}일)`, value: report.totals.applies, sub: `참가 ${n(applyOf("participant"))} · 참관 ${n(applyOf("observer"))}` },
        ].map((k) => (
          <Card key={k.label} className="p-4">
            <dt className="text-xs font-bold text-ink-soft">{k.label}</dt>
            <dd className="mt-1 font-display text-3xl font-bold tabular-nums">{n(k.value)}</dd>
            {k.sub && <dd className="mt-0.5 text-xs text-ink-soft">{k.sub}</dd>}
          </Card>
        ))}
      </dl>

      <Card className="mb-6 p-4 sm:p-5">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-extrabold">일별 방문</h2>
          <p className="flex items-center gap-3 text-xs text-ink-soft">
            <span className="inline-flex items-center gap-1.5">
              <span className="size-2.5 bg-coral" /> 방문자
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="size-2.5 bg-[#f3d6a6]" /> 페이지뷰
            </span>
          </p>
        </div>
        {empty ? (
          <p className="py-10 text-center text-sm text-ink-soft">아직 집계된 방문이 없습니다. 방문이 생기면 여기에 쌓입니다.</p>
        ) : (
          <>
            {/* 휴대폰에서는 좁은 그래프를 따로 그려 글자가 작아지지 않게 한다 */}
            <div className="md:hidden">
              <DailyChart data={report.daily} width={360} />
            </div>
            <div className="hidden md:block">
              <DailyChart data={report.daily} />
            </div>
          </>
        )}
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="border-b border-line px-4 py-3 font-extrabold">많이 본 페이지</h2>
          <BarList
            rows={report.pages.map((p) => ({ label: pageLabel(p.path), sub: p.path, value: p.views }))}
            empty="아직 기록이 없습니다."
          />
        </Card>
        <Card>
          <h2 className="border-b border-line px-4 py-3 font-extrabold">유입 경로</h2>
          <BarList rows={report.referrers.map((r) => ({ label: sourceLabel(r.source), value: r.visits }))} empty="아직 기록이 없습니다." />
        </Card>
        <Card>
          <h2 className="border-b border-line px-4 py-3 font-extrabold">클릭</h2>
          <BarList
            rows={report.events.map((e) => ({ label: eventLabel(e.name, e.label), value: e.count }))}
            empty="아직 신청 버튼·영상·외부 링크 클릭이 없습니다."
          />
        </Card>
        <div className="grid content-start gap-6">
          <Card>
            <h2 className="border-b border-line px-4 py-3 font-extrabold">기기</h2>
            <BarList
              rows={report.devices.map((r) => ({
                label: DEVICE[r.device] ?? r.device,
                sub: `${Math.round((r.visitors / deviceTotal) * 100)}%`,
                value: r.visitors,
              }))}
              empty="아직 기록이 없습니다."
            />
          </Card>
          <Card>
            <h2 className="border-b border-line px-4 py-3 font-extrabold">국가</h2>
            <BarList rows={report.countries.map((r) => ({ label: countryLabel(r.country), value: r.visitors }))} empty="아직 기록이 없습니다." />
          </Card>
        </div>
      </div>

      <p className="mt-6 text-xs leading-relaxed text-ink-soft">
        {report.firstHit
          ? `${new Date(report.firstHit).toLocaleDateString("ko-KR", { timeZone: "Asia/Seoul" })}부터 집계했습니다. `
          : ""}
        방문자는 날짜별 고유 방문자 수의 합입니다. 그 이전 기간과 더 자세한 분석은{" "}
        <a href="https://vercel.com/klvherks-projects/v0-space-competition-website/analytics" target="_blank" rel="noopener noreferrer" className="underline">
          Vercel Analytics
        </a>
        에서 볼 수 있습니다(메인 사이트만 집계).
      </p>
    </>
  )
}
