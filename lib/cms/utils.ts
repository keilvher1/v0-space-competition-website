import { emptyEditionData } from "./defaults"
import type { Edition, EditionData, EditionStatus } from "./types"

const DAY = 24 * 60 * 60 * 1000
const KST = 9 * 60 * 60 * 1000

export function editionStatus(edition: Edition, now = Date.now()): EditionStatus {
  const { status, deadline, endsAt } = edition.data
  if (status && status !== "auto") return status
  const close = Date.parse(deadline)
  const end = Date.parse(endsAt)
  if (Number.isFinite(close) && now < close) return "recruiting"
  if (Number.isFinite(end) && now < end) return "closed"
  return "ended"
}

export const STATUS_LABEL: Record<EditionStatus, string> = {
  recruiting: "신청 접수 중",
  closed: "신청 마감 · 대회 예정",
  ended: "종료",
}

/** 마감까지 남은 날짜(KST 자정 기준). 마감 당일은 0, 날짜가 없거나 잘못되면 null */
export function daysUntil(iso: string, now = Date.now()): number | null {
  const time = Date.parse(iso)
  if (!Number.isFinite(time)) return null
  return Math.floor((time + KST) / DAY) - Math.floor((now + KST) / DAY)
}

export function dDayLabel(iso: string, now = Date.now()): string | null {
  const days = daysUntil(iso, now)
  if (days === null) return null
  return days <= 0 ? "D-DAY" : `D-${days}`
}

/** 링크로 써도 안전한 주소만 통과시킨다: http(s) 주소나 사이트 안 경로(/…). javascript: 등은 null */
export function safeHref(value: string | null | undefined): string | null {
  const v = (value ?? "").trim()
  if (/^https?:\/\/\S+$/i.test(v)) return v
  if (/^\/(?![/\\])\S*$/.test(v)) return v
  return null
}

export const pad2 = (n: number) => String(n).padStart(2, "0")

// ── 키컬러 ───────────────────────────────────────────────

const HEX = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i

export function normalizeHex(value: string, fallback = "#2bb6e3"): string {
  const m = HEX.exec((value || "").trim())
  if (!m) return fallback
  const hex = m[1].length === 3 ? m[1].replace(/./g, (c) => c + c) : m[1]
  return `#${hex.toLowerCase()}`
}

function rgb(hex: string): [number, number, number] {
  const h = normalizeHex(hex).slice(1)
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)) as [number, number, number]
}

function luminance(hex: string): number {
  const [r, g, b] = rgb(hex).map((v) => {
    const c = v / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/** 검정 쪽으로 섞어 어둡게 (amount 0~1) */
export function shade(hex: string, amount: number): string {
  const [r, g, b] = rgb(hex).map((v) => Math.round(v * (1 - amount)))
  return `#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}`
}

const INK = "#052031"
const CREAM = "#fcedce"

/** 키컬러 위에 올릴 글자색: 명도 대비가 큰 쪽(잉크/크림) */
export function contrastOn(hex: string): string {
  const l = luminance(hex)
  const withInk = (l + 0.05) / (luminance(INK) + 0.05)
  const withCream = (luminance(CREAM) + 0.05) / (l + 0.05)
  return withInk >= withCream ? INK : CREAM
}

export interface EditionTheme {
  key: string
  keyDeep: string
  onKey: string
  onDeep: string
  accents: string[]
}

export function editionTheme(edition: Edition): EditionTheme {
  const key = normalizeHex(edition.keyColor)
  const onKey = contrastOn(key)
  // 키컬러가 어두우면 히어로는 더 어둡게, 밝으면 키컬러를 그대로 쓴다
  const keyDeep = onKey === CREAM ? shade(key, 0.4) : key
  const accents = (edition.data.accentColors || []).filter((c) => HEX.test(c)).map((c) => normalizeHex(c))
  return { key, keyDeep, onKey, onDeep: contrastOn(keyDeep), accents: accents.length ? accents : [contrastOn(keyDeep)] }
}

export function themeVars(theme: EditionTheme): Record<string, string> {
  return {
    "--key": theme.key,
    "--key-deep": theme.keyDeep,
    "--on-key": theme.onKey,
    "--on-deep": theme.onDeep,
    "--accent-1": theme.accents[0],
    "--accent-2": theme.accents[1] ?? theme.accents[0],
    "--accent-3": theme.accents[2] ?? theme.accents[0],
  }
}

// ── 한국 시간 입력 변환 ─────────────────────────────────

/** ISO → datetime-local 입력값(KST, "2026-11-11T19:00") */
export function toKstInput(iso: string): string {
  const t = Date.parse(iso)
  if (!Number.isFinite(t)) return ""
  return new Date(t + KST).toISOString().slice(0, 16)
}

/** datetime-local 입력값(KST) → ISO(+09:00) */
export function fromKstInput(value: string): string {
  if (!value) return ""
  return `${value.length === 16 ? `${value}:00` : value}+09:00`
}

// ── DB에서 읽은 JSON을 현재 모양으로 맞춘다 ─────────────

function mergeShape<T>(base: T, value: unknown): T {
  if (Array.isArray(base)) return (Array.isArray(value) ? value : base) as T
  if (base && typeof base === "object") {
    const src = value && typeof value === "object" ? (value as Record<string, unknown>) : {}
    const out: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(base as Record<string, unknown>)) out[k] = mergeShape(v, src[k])
    return out as T
  }
  if (value === undefined || value === null) return base
  return (typeof value === typeof base ? value : base) as T
}

export function normalizeEditionData(value: unknown): EditionData {
  return mergeShape(emptyEditionData(), value)
}

export function normalizeWith<T>(base: T, value: unknown): T {
  return mergeShape(base, value)
}
