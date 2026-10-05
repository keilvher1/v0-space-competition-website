import { createHash, randomBytes } from "node:crypto"
import { geolocation, ipAddress } from "@vercel/functions"
import { query } from "@/lib/db"

// 방문 통계 수집(공개 페이지의 Tracker와 /2026/track.js가 보낸다).
// 쿠키를 쓰지 않고 IP도 저장하지 않는다. 방문자 구분 값은 '날마다 바뀌는 비밀 값 + IP + 브라우저'의 해시라
// 하루가 지나면 같은 사람인지 알 수 없다.

const BOT = /bot|crawl|spider|slurp|headless|lighthouse|pingdom|facebookexternalhit|embedly|whatsapp|kakaotalk-scrap|daumoa|yeti|ahrefs|semrush|python|curl|wget|httpclient|axios|node-fetch|go-http|preview/i
const NAMES = new Set(["apply", "outbound", "video"])
const ok = () => new Response(null, { status: 204 })

let saltPromise: Promise<string> | undefined
function salt() {
  saltPromise ??= (async () => {
    await query(`insert into cms_settings (key, value) values ('analytics_salt', $1) on conflict (key) do nothing`, [
      JSON.stringify(randomBytes(32).toString("hex")),
    ])
    const rows = await query<{ value: string }>(`select value from cms_settings where key = 'analytics_salt'`)
    return String(rows[0].value)
  })().catch((error) => {
    saltPromise = undefined
    throw error
  })
  return saltPromise
}

const clip = (v: unknown, max: number) => (typeof v === "string" ? v.slice(0, max) : "")

function device(ua: string) {
  if (/ipad|tablet|(android(?!.*mobile))/i.test(ua)) return "tablet"
  if (/mobi|iphone|ipod|android/i.test(ua)) return "mobile"
  return "desktop"
}

function referrerHost(ref: string, host: string) {
  try {
    const h = new URL(ref).hostname.replace(/^www\./, "")
    return h === host.replace(/^www\./, "") ? "" : h
  } catch {
    return ""
  }
}

export async function POST(request: Request) {
  // 프리뷰·로컬에서는 기록하지 않는다(운영 통계를 깨끗하게). 로컬 시험은 ANALYTICS_DEV=1
  if (process.env.VERCEL_ENV !== "production" && process.env.ANALYTICS_DEV !== "1") return ok()

  const ua = request.headers.get("user-agent") ?? ""
  if (!ua || BOT.test(ua)) return ok()
  if (/(?:^|;\s*)wf_admin=/.test(request.headers.get("cookie") ?? "")) return ok() // 관리자 본인의 방문은 세지 않는다

  const host = request.headers.get("host") ?? ""
  const origin = request.headers.get("origin")
  if (origin) {
    try {
      if (new URL(origin).host !== host) return new Response(null, { status: 403 })
    } catch {
      return new Response(null, { status: 403 })
    }
  }

  const text = await request.text().catch(() => "")
  if (!text || text.length > 2000) return ok()
  let data: Record<string, unknown>
  try {
    data = JSON.parse(text)
  } catch {
    return ok()
  }

  const kind = data.kind === "event" ? "event" : data.kind === "view" ? "view" : null
  const path = clip(data.path, 200)
  if (!kind || !path.startsWith("/")) return ok()
  // 페이지뷰 중 사이트에 처음 들어온 순간은 name='entry'로 남겨 유입 경로 통계에 쓴다
  const name = kind === "event" ? clip(data.name, 40) : data.entry === true ? "entry" : ""
  if (kind === "event" && !NAMES.has(name)) return ok()

  const day = new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10) // 한국 날짜
  const ip = ipAddress(request) ?? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? ""
  const visitor = createHash("sha256").update(`${await salt()}:${day}:${ip}:${ua}`).digest("hex").slice(0, 16)
  const source = clip(data.src, 60).toLowerCase()

  await query(
    `insert into cms_hits (kind, name, label, path, referrer, visitor, device, country)
     values ($1, $2, $3, $4, $5, $6, $7, $8)`,
    [
      kind,
      name,
      clip(data.label, 80),
      path,
      name === "entry" ? (source ? `utm:${source}` : referrerHost(clip(data.ref, 300), host)) : "",
      visitor,
      device(ua),
      geolocation(request).country ?? "",
    ],
  )
  return ok()
}
