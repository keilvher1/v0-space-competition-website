// 일별 방문 그래프(SVG). 연한 막대는 페이지뷰, 진한 막대는 방문자.
export function DailyChart({ data, width = 720 }: { data: { date: string; visitors: number; views: number }[]; width?: number }) {
  const W = width
  const H = width < 500 ? 200 : 220
  const pad = { top: 12, right: 8, bottom: 28, left: 34 }
  const innerW = W - pad.left - pad.right
  const innerH = H - pad.top - pad.bottom
  const max = Math.max(4, ...data.map((d) => d.views))
  const step = Math.pow(10, Math.floor(Math.log10(max)))
  const top = Math.ceil(max / step) * step
  const slot = innerW / data.length
  const bar = Math.max(2, slot * 0.68)
  const y = (v: number) => pad.top + innerH - (v / top) * innerH
  // 날짜 글자가 겹치지 않게 폭에 맞춰 띄엄띄엄 쓴다
  const every = data.length <= 7 ? 1 : Math.ceil(data.length / Math.floor(innerW / 48))

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="일별 방문자와 페이지뷰 그래프">
      {[0, 0.5, 1].map((t) => (
        <g key={t}>
          <line x1={pad.left} x2={W - pad.right} y1={y(top * t)} y2={y(top * t)} stroke="#e5dcc6" strokeDasharray={t ? "3 4" : undefined} />
          <text x={pad.left - 6} y={y(top * t) + 4} textAnchor="end" fontSize="11" fill="#5d6b74">
            {Math.round(top * t)}
          </text>
        </g>
      ))}
      {data.map((d, i) => {
        const x = pad.left + i * slot + (slot - bar) / 2
        return (
          <g key={d.date}>
            <title>{`${d.date.slice(5).replace("-", ".")} · 방문자 ${d.visitors} · 페이지뷰 ${d.views}`}</title>
            <rect x={x} y={y(d.views)} width={bar} height={pad.top + innerH - y(d.views)} fill="#f3d6a6" />
            <rect x={x} y={y(d.visitors)} width={bar} height={pad.top + innerH - y(d.visitors)} fill="#e65840" />
            {(i % every === 0 || i === data.length - 1) && (
              <text x={x + bar / 2} y={H - 8} textAnchor="middle" fontSize="11" fill="#5d6b74">
                {d.date.slice(5).replace("-", ".")}
              </text>
            )}
          </g>
        )
      })}
    </svg>
  )
}

/** 비율 막대가 붙은 목록 */
export function BarList({ rows, empty }: { rows: { label: string; value: number; sub?: string }[]; empty: string }) {
  if (rows.length === 0) return <p className="px-4 py-8 text-center text-sm text-ink-soft">{empty}</p>
  const max = Math.max(...rows.map((r) => r.value), 1)
  return (
    <ul className="divide-y divide-line">
      {rows.map((r, i) => (
        <li key={`${r.label}-${i}`} className="relative px-4 py-3">
          <span aria-hidden="true" className="absolute inset-y-1 left-0 rounded-r bg-cream" style={{ width: `${(r.value / max) * 100}%` }} />
          <span className="relative flex items-center justify-between gap-3 text-sm">
            <span className="min-w-0 truncate font-semibold">
              {r.label}
              {r.sub && <span className="ml-2 font-normal text-ink-soft">{r.sub}</span>}
            </span>
            <span className="shrink-0 font-display font-bold tabular-nums">{r.value.toLocaleString("ko-KR")}</span>
          </span>
        </li>
      ))}
    </ul>
  )
}
