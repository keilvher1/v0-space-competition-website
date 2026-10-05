// CMS 초기 콘텐츠. DB 테이블이 비어 있으면 이 값으로 채우고,
// DB에 연결할 수 없을 때(로컬 빌드 등)도 이 값으로 화면을 그린다.
import type { Edition, EditionData, Faq, Partner, SiteSettings } from "./types"

export const DEFAULT_SETTINGS: SiteSettings = {
  seo: {
    title: "우주최고실패대회 — 실패해도 괜찮아",
    description:
      "실패를 숨기지 않고 함께 듣고 응원하는 무대, 우주최고실패대회. 제2회 대회 안내와 역대 대회 기록을 한곳에서 확인하세요.",
    ogImage: "/og.jpg",
  },
  intro: { enabled: true, tagline: "실패해도 괜찮아" },
  hero: {
    eyebrow: "Universe's Best Failure Contest",
    subEyebrow: "Since 2025 · Pohang",
    titleLines: ["우주최고", "실패대회"],
    highlight: "실패",
    body: "실패해도 괜찮아.\n숨기지 않고 꺼내 놓은 실패를\n함께 듣고 응원하는 무대입니다.",
    secondaryLabel: "역대 대회",
  },
  slogans: ["실패해도 괜찮아", "우주에서 제일 멋지게 실패해보자", "실패, 결과가 아닌 질문으로", "FAIL IS OK"],
  about: {
    title: "실패는 개인의 몫처럼 보이지만, 사실은 사회가 함께 책임져야 할 감정입니다.",
    highlight: "사회가 함께",
    paragraphs: [
      "우주최고실패대회는 실패를 극복하고 결국 희망과 웃음으로 마무리하는 자리가 아닙니다. 포항 지역 최초의 실패 독려 프로젝트로서, 실패를 개인의 낙인으로 치부하지 않고 사회가 함께 격려하고 축하하는 축제의 장을 만듭니다.",
      "실패를 공유할 언어와 공간이 있을 때, 실패는 실패 이후로 나아갈 수 있습니다. 성공담으로 포장하지 않은 실패 그 자체를 있는 그대로 회고하고, 그 이야기를 함께 듣고 응원합니다.",
    ],
    principles: [
      {
        title: "진솔하게 꺼내기",
        body: "극복하지 못한 실패도 괜찮습니다. 결과보다 그 안의 경험과 과정을 있는 그대로 이야기합니다.",
      },
      {
        title: "함께 듣고 응원하기",
        body: "실패를 조롱하거나 단정하지 않습니다. 무대 위의 이야기에 귀 기울이고 박수를 보냅니다.",
      },
      {
        title: "기록으로 이어가기",
        body: "한 번의 행사로 끝내지 않고, 책과 아카이브로 다시 읽고 나눌 수 있게 이야기를 남깁니다.",
      },
    ],
  },
  archive: {
    title: "역대 대회",
    description: "해마다 다른 실패, 하나의 질문. 지난 대회의 기록을 회차별로 보존합니다.",
  },
  records: {
    title: "실패가 남긴 기록",
    description: "첫 대회의 이야기는 책과 기사로, 그리고 다음 대회로 이어지고 있습니다.",
    note: "제1회 신청자·본선 인원은 2025년 국민일보 보도 기준입니다.",
    tiles: [
      {
        kind: "photo",
        size: "2x2",
        color: "",
        kicker: "",
        title: "2025.11.08 · 제1회 현장",
        value: "",
        unit: "",
        body: "환동해지역혁신원 파랑뜰 2층 드림홀",
        imageUrl: "/images/2025/first-event-group.webp",
        linkUrl: "",
        linkLabel: "",
      },
      {
        kind: "stat",
        size: "1x1",
        color: "#3b2a63",
        kicker: "",
        title: "제1회 신청자",
        value: "71",
        unit: "명",
        body: "",
        imageUrl: "",
        linkUrl: "",
        linkLabel: "",
      },
      {
        kind: "stat",
        size: "1x1",
        color: "#e65840",
        kicker: "",
        title: "제1회 본선 진출",
        value: "10",
        unit: "명",
        body: "",
        imageUrl: "",
        linkUrl: "",
        linkLabel: "",
      },
      {
        kind: "feature",
        size: "2x1",
        color: "#fcedce",
        kicker: "Book",
        title: "『우주실패실록』",
        value: "",
        unit: "",
        body: "첫 대회의 과정을 담은 책입니다. 한국교육신문은 2026년 3월 이 책의 출간 소식을 전했습니다.",
        imageUrl: "/images/book/book-cover.webp",
        linkUrl: "https://www.hangyo.com/news/article.html?no=106959",
        linkLabel: "출간 기사 읽기",
      },
      {
        kind: "quote",
        size: "3x1",
        color: "#052031",
        kicker: "Press · 국민일보 · 2025.11.13",
        title: "실패도 응원받는 사회를 향해.",
        value: "",
        unit: "",
        body: "포항에서 열린 첫 대회. 참가자들이 경험을 나누고 서로의 이야기에 공감한 현장을 전했습니다.",
        imageUrl: "",
        linkUrl: "https://www.kmib.co.kr/article/view.asp?arcid=0028970435",
        linkLabel: "기사 읽기",
      },
      {
        kind: "stat",
        size: "1x1",
        color: "#2bb6e3",
        kicker: "",
        title: "제2회 모집",
        value: "100",
        unit: "명",
        body: "선착순 · 공식 공고 기준",
        imageUrl: "",
        linkUrl: "",
        linkLabel: "",
      },
    ],
  },
  partners: {
    title: "함께한 기관·기업",
    description: "제1회와 제2회를 함께 만든 곳들입니다.",
    note: "하우스더웨더·마이스모어 로고는 제2회 포스터에서 추출한 임시 로고입니다.",
  },
  pages: {
    faq: {
      eyebrow: "FAQ",
      title: "자주 묻는 질문",
      description: "대회 참가와 참관에 대해 자주 묻는 질문을 모았습니다.",
    },
    announcements: {
      eyebrow: "News",
      title: "공지사항",
      description: "대회 관련 최신 소식을 확인하세요.",
    },
  },
  contact: { label: "행사 문의", email: "jyjpeter79@gmail.com" },
  host: "한동대학교 심규진 교수",
  copyright: "© 2025–2026 우주최고실패대회",
}

export function emptyEditionData(): EditionData {
  return {
    title: "",
    tagline: "",
    status: "auto",
    startsAt: "",
    endsAt: "",
    deadline: "",
    dateLabel: "",
    venue: "",
    venueDetail: "",
    accentColors: [],
    hero: { eyebrow: "", titleTop: "", titleWords: [], subtitle: "" },
    poster: { url: "", alt: "", originalUrl: "", width: 0, height: 0 },
    facts: [],
    apply: { participantUrl: "", observerUrl: "", note: "" },
    intro: { title: "", cards: [] },
    timeline: [],
    rules: [],
    awards: [],
    stats: [],
    photos: [],
    press: [],
    features: [],
    video: { url: "", title: "", body: "", portrait: true, poster: "" },
    organizersTitle: "함께한 기관",
  }
}

const EDITION_2026: Edition = {
  id: "default-2026",
  number: 2,
  year: 2026,
  slug: "2026",
  published: true,
  pageMode: "external",
  externalUrl: "/2026",
  keyColor: "#2bb6e3",
  data: {
    ...emptyEditionData(),
    title: "제2회 우주최고실패대회",
    tagline: "실패해도 괜찮아, 우주에서 제일 멋지게 실패해보자!",
    startsAt: "2026-11-11T19:00:00+09:00",
    endsAt: "2026-11-11T20:30:00+09:00",
    deadline: "2026-10-31T23:59:00+09:00",
    dateLabel: "2026.11.11 (수) 19:00–20:30",
    venue: "러블랑 B1",
    accentColors: ["#fcedce", "#e65840"],
    poster: {
      url: "/images/2026/poster-preview.webp",
      alt: "제2회 우주최고실패대회 공식 포스터",
      originalUrl: "/2026/assets/poster/official-poster.jpg",
      width: 778,
      height: 1100,
    },
    facts: [
      { label: "일시", value: "11.11 (수) 19:00", sub: "19:00–20:30" },
      { label: "장소", value: "러블랑 B1", sub: "" },
      { label: "신청 마감", value: "10.31 (토) 23:59", sub: "" },
      { label: "모집", value: "선착순 100명", sub: "" },
    ],
    apply: {
      participantUrl: "https://forms.gle/8QCSaguvMiDcKNho7",
      observerUrl: "https://forms.gle/ddS3DjHMKJqyLGKX8",
      note: "",
    },
  },
}

const EDITION_2025: Edition = {
  id: "default-2025",
  number: 1,
  year: 2025,
  slug: "2025",
  published: true,
  pageMode: "cms",
  externalUrl: "",
  keyColor: "#3b2a63",
  data: {
    ...emptyEditionData(),
    title: "제1회 우주최고실패대회",
    tagline: "실패, 결과가 아닌 질문으로 바꾸다",
    status: "ended",
    startsAt: "2025-11-08T13:00:00+09:00",
    endsAt: "2025-11-08T17:00:00+09:00",
    deadline: "2025-10-27T23:59:00+09:00",
    dateLabel: "2025.11.08 (토) 13:00–17:00",
    venue: "환동해지역혁신원 파랑뜰 2층 드림홀",
    venueDetail: "경상북도 포항시 북구 장성로 109",
    accentColors: ["#9be3cf", "#ffd65a", "#ff8cc6", "#fcedce"],
    hero: {
      eyebrow: "Archive · No.01 · 2025",
      titleTop: "제1회",
      titleWords: ["우주", "최고", "실패", "대회"],
      subtitle: "실패, 결과가 아닌 질문으로 바꾸다",
    },
    poster: {
      url: "/images/2025/first-event-poster.webp",
      alt: "제1회 우주최고실패대회 포스터",
      originalUrl: "/images/poster.jpg",
      width: 740,
      height: 1046,
    },
    facts: [
      { label: "본선", value: "2025.11.08 (토)", sub: "13:00–17:00" },
      { label: "장소", value: "환동해지역혁신원", sub: "파랑뜰 2층 드림홀" },
      { label: "신청자", value: "71명", sub: "국민일보 보도 기준" },
      { label: "본선 진출", value: "10명", sub: "오프라인 PT 발표" },
    ],
    intro: {
      title: "실패, 결과가 아닌 질문으로",
      cards: [
        {
          title: "대회 소개",
          lead: "제1회 우주 최고 실패 대회는 “단순히 실패를 극복하고 결국 희망과 웃음으로 마무리하는 자리”가 아닙니다.",
          body: "포항 지역 최초의 실패 독려 프로젝트로서, 실패를 개인의 낙인으로 치부하지 않고 사회가 함께 격려하고 축하하는 축제의 장을 마련하고자 했습니다.\n\n참가자 모두가 자신이 극복하지 못한 실패를 진솔하게 나누는 것이 이 대회의 가장 중요한 목표였습니다.",
          tone: "light",
        },
        {
          title: "대회 철학과 목적",
          lead: "실패는 개인의 몫처럼 보이지만, 사실은 사회가 함께 책임져야 할 감정",
          body: "만약 실패를 공유할 수 있는 언어와 공간이 없다면 실패는 그저 실패로 끝날 수밖에 없습니다.\n\n하지만 실패를 나누고 교류하는 과정에서 실패를 조금씩 익숙하게 받아들이고, 이로써 실패는 실패 이후로 나아가게 됩니다.\n\n단순히 희망적이고 성공담으로 포장하지 않은 실패 그 자체를, 있는 그대로 회고하는 순간을 만들어 많은 분들의 이야기를 들려드리고자 했습니다.",
          tone: "key",
        },
      ],
    },
    timeline: [
      { date: "~ 2025.10.27 (월)", title: "참가 신청", body: "1분 분량의 영상 또는 서면으로 접수" },
      { date: "2025.11.04 (화)", title: "예선 합격자 발표", body: "본선 진출자 안내" },
      {
        date: "2025.11.08 (토) 13:00",
        title: "본선",
        body: "오프라인 PT · 환동해지역혁신원 파랑뜰 2층 드림홀 (경상북도 포항시 북구 장성로 109)",
      },
      { date: "2025.11.14 (금)", title: "최종 합격자 발표", body: "트랙별 수상자 발표" },
    ],
    rules: [
      {
        title: "참가 자격",
        body: "자신의 실패 경험을 공유하고자 하는 모든 연령층. 학생, 직장인, 주부 등 실패를 나누고 싶은 누구나.",
      },
      { title: "참가 제한", body: "1인당 1개 실패 경험만 참가할 수 있었습니다." },
      { title: "참가 비용", body: "무료" },
      {
        title: "참가 방식",
        body: "예선은 말하기·노래·춤 등 자유로운 표현을 담은 1분 분량의 영상 또는 서면, 본선은 오프라인 PT로 진행했습니다.",
      },
      { title: "지원 트랙", body: "청소년 트랙(만 18세까지)과 일반 트랙(만 19세부터)으로 나누어 진행했습니다." },
    ],
    awards: [
      { label: "참가자 전원", title: "「우주 최고 실패」 디지털 뱃지 수여", body: "", color: "#ffd65a" },
      {
        label: "트랙별 수상자 · 청소년·일반 트랙 각 최대 3명",
        title: "실패 도서 출간 저자 기회 제공",
        body: "트로피 수여",
        color: "#ff8cc6",
      },
    ],
    photos: [
      {
        url: "/images/2025/first-event-group.webp",
        alt: "제1회 우주최고실패대회 현장에서 참석자들이 행사 현수막과 함께 촬영한 단체 사진",
        caption: "함께 모여 남긴 한 장 · 2025.11.08 · 파랑뜰 2층 드림홀",
      },
    ],
    press: [
      {
        outlet: "국민일보",
        date: "2025.11.13",
        title: "실패도 응원받는 사회를 향해.",
        summary: "참가자들이 경험을 나누고 서로의 이야기에 공감한 현장을 전했습니다.",
        url: "https://www.kmib.co.kr/article/view.asp?arcid=0028970435",
        secondaryUrl: "https://v.daum.net/v/20251113172048160?f=p",
      },
    ],
    features: [
      {
        kicker: "Book",
        title: "『우주실패실록』",
        body: "제1회의 과정을 담은 책. 2026년 3월 출간 소식이 전해졌습니다.",
        imageUrl: "/images/book/book-cover.webp",
        linkUrl: "https://www.hangyo.com/news/article.html?no=106959",
        linkLabel: "출간 기사",
      },
    ],
    video: {
      url: "https://player.vimeo.com/video/1123631620",
      title: "대회 소개 영상",
      body: "제1회 모집 당시 공개한 영상입니다. 대회가 던지고 싶었던 질문을 70초에 담았습니다.",
      portrait: true,
      poster: "",
    },
    organizersTitle: "주최·주관",
  },
}

export const DEFAULT_EDITIONS: Edition[] = [EDITION_2026, EDITION_2025]

export const DEFAULT_FAQS: Faq[] = [
  {
    id: "default-faq-1",
    question: "참가와 참관은 어떻게 다른가요?",
    answer:
      "직접 실패담을 들려주실 분은 참가 신청, 다른 사람의 이야기를 듣고 응원하며 투표하실 분은 참관 신청을 선택해주세요. 두 신청서는 서로 다른 링크로 안내합니다.",
    editionNumber: 2,
    sort: 1,
    published: true,
  },
  {
    id: "default-faq-2",
    question: "신청 마감은 언제인가요?",
    answer:
      "2026년 10월 31일(토) 23:59까지입니다. 공식 공고에는 선착순 100명 모집으로 안내되어 있습니다. 참가·참관 정원 구분과 실제 접수 상태는 주최 측에 확인해주세요.",
    editionNumber: 2,
    sort: 2,
    published: true,
  },
  {
    id: "default-faq-3",
    question: "책은 어떻게 받을 수 있나요?",
    answer:
      "공식 포스터에는 참관 혜택으로 ‘우주실패실록(50명)’이 안내되어 있습니다. 배정 방식과 수령 조건은 주최 측 안내를 확인해주세요.",
    editionNumber: 2,
    sort: 3,
    published: true,
  },
  {
    id: "default-faq-4",
    question: "촬영·공개 범위는 어디서 확인하나요?",
    answer:
      "촬영 대상과 공개 채널·기간 등은 주최 측의 안내와 동의 절차를 기준으로 확인해주세요. 구체적인 사항은 아래 문의처로 문의할 수 있습니다.",
    editionNumber: 2,
    sort: 4,
    published: true,
  },
]

const partner = (
  sort: number,
  name: string,
  logoUrl: string,
  editions: number[],
  temporary = false,
): Partner => ({ id: `default-partner-${sort}`, name, logoUrl, linkUrl: "", temporary, editions, sort, published: true })

export const DEFAULT_PARTNERS: Partner[] = [
  partner(1, "교육부", "/images/partners/moe.png", [1]),
  partner(2, "포항시", "/images/partners/pohang.png", [1, 2]),
  partner(3, "한동대학교", "/images/partners/handong.png", [1, 2]),
  partner(4, "파랑뜰", "/images/partners/parangteul.png", [1]),
  partner(5, "실소", "/images/partners/silso.png", [2]),
  partner(6, "하우스더웨더", "/images/partners/house-weather.png", [2], true),
  partner(7, "마이스모어", "/images/partners/micemore.png", [2], true),
  partner(8, "데스커", "/images/partners/desker.png", [2]),
]
