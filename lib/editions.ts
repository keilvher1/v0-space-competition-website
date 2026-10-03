// 회차별 대회 정보. 새 회차는 배열 맨 앞에 추가한다(최신순).
// 제2회 내용은 public/2026 핸드오프(event-config.js)와 같은 값을 쓴다.

export type EditionStatus = "recruiting" | "closed" | "ended"

export interface Edition {
  number: number
  year: number
  href: string
  title: string
  tagline: string
  /** 행사 시작·종료, 신청 마감 (ISO 8601, KST) */
  startsAt: string
  endsAt: string
  deadline: string
  dateLabel: string
  venue: string
  poster: { src: string; width: number; height: number; alt: string }
  /** 아카이브 목록에서 쓰는 회차별 캠페인 색 */
  theme: { bg: string; fg: string }
}

export const EDITIONS: Edition[] = [
  {
    number: 2,
    year: 2026,
    href: "/2026",
    title: "제2회 우주최고실패대회",
    tagline: "실패해도 괜찮아, 우주에서 제일 멋지게 실패해보자!",
    startsAt: "2026-11-11T19:00:00+09:00",
    endsAt: "2026-11-11T20:30:00+09:00",
    deadline: "2026-10-31T23:59:00+09:00",
    dateLabel: "2026.11.11 (수) 19:00–20:30",
    venue: "러블랑 B1",
    poster: {
      src: "/images/2026/poster-preview.webp",
      width: 778,
      height: 1100,
      alt: "제2회 우주최고실패대회 공식 포스터",
    },
    theme: { bg: "#2bb6e3", fg: "#052031" },
  },
  {
    number: 1,
    year: 2025,
    href: "/2025",
    title: "제1회 우주최고실패대회",
    tagline: "실패, 결과가 아닌 질문으로 바꾸다",
    startsAt: "2025-11-08T13:00:00+09:00",
    endsAt: "2025-11-08T17:00:00+09:00",
    deadline: "2025-10-27T23:59:00+09:00",
    dateLabel: "2025.11.08 (토) 13:00–17:00",
    venue: "환동해지역혁신원 파랑뜰 2층 드림홀",
    poster: {
      src: "/images/2025/first-event-poster.webp",
      width: 740,
      height: 1046,
      alt: "제1회 우주최고실패대회 포스터",
    },
    theme: { bg: "#3b2a63", fg: "#fcedce" },
  },
]

export const CURRENT_EDITION = EDITIONS[0]

export function editionStatus(edition: Edition, now = Date.now()): EditionStatus {
  if (now < Date.parse(edition.deadline)) return "recruiting"
  if (now < Date.parse(edition.endsAt)) return "closed"
  return "ended"
}

export const STATUS_LABEL: Record<EditionStatus, string> = {
  recruiting: "신청 접수 중",
  closed: "신청 마감 · 대회 예정",
  ended: "종료",
}

/** 마감까지 남은 날짜(KST 자정 기준). 마감 당일은 0. */
export function daysUntil(iso: string, now = Date.now()): number {
  const day = 24 * 60 * 60 * 1000
  const kst = 9 * 60 * 60 * 1000
  const target = Math.floor((Date.parse(iso) + kst) / day)
  const today = Math.floor((now + kst) / day)
  return target - today
}

export function dDayLabel(iso: string, now = Date.now()): string {
  const days = daysUntil(iso, now)
  return days === 0 ? "D-DAY" : `D-${days}`
}
