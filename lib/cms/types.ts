// CMS 콘텐츠 타입. DB(cms_* 테이블)와 관리자 폼, 공개 페이지가 같은 모양을 쓴다.

export type EditionStatus = "recruiting" | "closed" | "ended"
export type StatusOverride = "auto" | EditionStatus

export interface Fact {
  label: string
  value: string
  sub: string
}

export interface TimelineItem {
  date: string
  title: string
  body: string
}

export interface RuleItem {
  title: string
  body: string
}

export interface AwardItem {
  label: string
  title: string
  body: string
  color: string
}

export interface StatItem {
  label: string
  value: string
  unit: string
  note: string
}

export interface PhotoItem {
  url: string
  alt: string
  caption: string
}

export interface PressItem {
  outlet: string
  date: string
  title: string
  summary: string
  url: string
  secondaryUrl: string
}

export interface FeatureItem {
  kicker: string
  title: string
  body: string
  imageUrl: string
  linkUrl: string
  linkLabel: string
}

export interface IntroCard {
  title: string
  lead: string
  body: string
  tone: "light" | "key"
}

export interface EditionData {
  title: string
  tagline: string
  status: StatusOverride
  /** ISO 8601 (KST, +09:00) */
  startsAt: string
  endsAt: string
  deadline: string
  dateLabel: string
  venue: string
  venueDetail: string
  /** 히어로 제목 단어 색 등 보조 색. 키컬러와 함께 회차 페이지에 쓴다 */
  accentColors: string[]
  hero: {
    eyebrow: string
    titleTop: string
    titleWords: string[]
    subtitle: string
  }
  poster: { url: string; alt: string; originalUrl: string; width: number; height: number }
  facts: Fact[]
  apply: { participantUrl: string; observerUrl: string; note: string }
  intro: { title: string; cards: IntroCard[] }
  timeline: TimelineItem[]
  rules: RuleItem[]
  awards: AwardItem[]
  stats: StatItem[]
  photos: PhotoItem[]
  press: PressItem[]
  features: FeatureItem[]
  /** url: Vimeo·YouTube 주소 또는 업로드한 동영상 파일 주소. poster: 업로드한 동영상의 미리보기 이미지(선택) */
  video: { url: string; title: string; body: string; portrait: boolean; poster: string }
  organizersTitle: string
}

export interface Edition {
  id: string
  number: number
  year: number
  slug: string
  published: boolean
  /** cms: 이 사이트에서 회차 페이지를 그린다. external: externalUrl(예: /2026 정적 사이트)로 보낸다 */
  pageMode: "cms" | "external"
  externalUrl: string
  keyColor: string
  data: EditionData
}

export interface HighlightTile {
  kind: "photo" | "stat" | "feature" | "quote"
  size: "1x1" | "2x1" | "3x1" | "2x2"
  color: string
  kicker: string
  title: string
  value: string
  unit: string
  body: string
  imageUrl: string
  linkUrl: string
  linkLabel: string
}

export interface PageHeroText {
  eyebrow: string
  title: string
  description: string
}

export interface SiteSettings {
  seo: { title: string; description: string; ogImage: string }
  intro: { enabled: boolean; tagline: string }
  hero: {
    eyebrow: string
    subEyebrow: string
    titleLines: string[]
    highlight: string
    body: string
    secondaryLabel: string
  }
  slogans: string[]
  about: {
    title: string
    highlight: string
    paragraphs: string[]
    principles: RuleItem[]
  }
  archive: { title: string; description: string }
  records: { title: string; description: string; note: string; tiles: HighlightTile[] }
  partners: { title: string; description: string; note: string }
  pages: { faq: PageHeroText; announcements: PageHeroText }
  contact: { label: string; email: string }
  host: string
  copyright: string
}

export interface Faq {
  id: string
  question: string
  answer: string
  editionNumber: number | null
  sort: number
  published: boolean
}

export interface Announcement {
  id: string
  title: string
  excerpt: string
  body: string
  featured: boolean
  published: boolean
  publishedAt: string | null
  createdAt: string
}

export interface Partner {
  id: string
  name: string
  logoUrl: string
  linkUrl: string
  /** 포스터에서 추출한 흰색 임시 로고처럼 검정으로 칠해야 보이는 경우 */
  temporary: boolean
  editions: number[]
  sort: number
  published: boolean
}

export interface MediaItem {
  id: string
  url: string
  pathname: string
  contentType: string
  size: number
  alt: string
  createdAt: string
}
