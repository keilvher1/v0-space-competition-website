// 관리자 화면별 필드 정의
import type { FieldDef, Option } from "./form-types"

const COLOR_HELP = "#으로 시작하는 6자리 색상값"

export const SETTINGS_FIELDS: FieldDef[] = [
  {
    kind: "group",
    label: "메인 히어로",
    name: "hero",
    open: true,
    help: "메인 페이지 첫 화면",
    fields: [
      { kind: "text", name: "eyebrow", label: "머리말 (영문)" },
      { kind: "text", name: "subEyebrow", label: "모바일 보조 머리말" },
      { kind: "strings", name: "titleLines", label: "큰 제목", help: "한 칸이 한 줄입니다.", addLabel: "줄 추가" },
      { kind: "text", name: "highlight", label: "강조 글자", help: "제목 안에서 코랄 그림자를 넣을 글자 (예: 실패)" },
      { kind: "textarea", name: "body", label: "소개 문구", rows: 3, help: "줄바꿈이 그대로 보입니다." },
      { kind: "text", name: "secondaryLabel", label: "두 번째 버튼 문구" },
    ],
  },
  {
    kind: "group",
    label: "인트로(로딩) 애니메이션",
    name: "intro",
    help: "사이트에 처음 들어올 때 한 번 나오는 화면",
    fields: [
      { kind: "switch", name: "enabled", label: "첫 방문 인트로 보이기" },
      { kind: "text", name: "tagline", label: "인트로 문구" },
    ],
  },
  {
    kind: "group",
    label: "슬로건 띠",
    help: "히어로 아래 흐르는 코랄 띠",
    fields: [{ kind: "strings", name: "slogans", label: "슬로건", addLabel: "슬로건 추가" }],
  },
  {
    kind: "group",
    label: "소개 섹션",
    name: "about",
    fields: [
      { kind: "textarea", name: "title", label: "큰 문장", rows: 2 },
      { kind: "text", name: "highlight", label: "강조 부분", help: "큰 문장 안에서 코랄 배경을 칠할 부분" },
      { kind: "strings", name: "paragraphs", label: "본문 문단", multiline: true, addLabel: "문단 추가" },
      {
        kind: "list",
        name: "principles",
        label: "원칙 (3개 권장)",
        itemLabel: "원칙",
        summaryField: "title",
        fields: [
          { kind: "text", name: "title", label: "제목" },
          { kind: "textarea", name: "body", label: "설명", rows: 2 },
        ],
      },
    ],
  },
  {
    kind: "group",
    label: "역대 대회 섹션",
    name: "archive",
    fields: [
      { kind: "text", name: "title", label: "제목" },
      { kind: "textarea", name: "description", label: "설명", rows: 2 },
    ],
  },
  {
    kind: "group",
    label: "기록 섹션 (타일)",
    name: "records",
    help: "사진·숫자·책·기사 타일을 자유롭게 구성합니다.",
    fields: [
      { kind: "text", name: "title", label: "제목" },
      { kind: "textarea", name: "description", label: "설명", rows: 2 },
      { kind: "text", name: "note", label: "아래 작은 주석" },
      {
        kind: "list",
        name: "tiles",
        label: "타일",
        itemLabel: "타일",
        summaryField: "title",
        fields: [
          {
            kind: "select",
            name: "kind",
            label: "종류",
            options: [
              { value: "stat", label: "숫자" },
              { value: "photo", label: "사진" },
              { value: "feature", label: "이미지+글 (책 등)" },
              { value: "quote", label: "큰 글 (기사 등)" },
            ],
          },
          {
            kind: "select",
            name: "size",
            label: "크기 (데스크톱 기준 칸 수)",
            options: [
              { value: "1x1", label: "1칸" },
              { value: "2x1", label: "가로 2칸" },
              { value: "3x1", label: "가로 3칸" },
              { value: "2x2", label: "2×2 큰 칸" },
            ],
          },
          { kind: "color", name: "color", label: "배경색", help: `${COLOR_HELP}. 글자색은 자동으로 맞춥니다.` },
          { kind: "text", name: "kicker", label: "작은 머리말" },
          { kind: "text", name: "title", label: "제목" },
          { kind: "text", name: "value", label: "숫자 (숫자 타일)" },
          { kind: "text", name: "unit", label: "단위 (예: 명)" },
          { kind: "textarea", name: "body", label: "설명", rows: 2 },
          { kind: "image", name: "imageUrl", label: "이미지" },
          { kind: "text", name: "linkUrl", label: "링크 주소" },
          { kind: "text", name: "linkLabel", label: "링크 문구" },
        ],
      },
    ],
  },
  {
    kind: "group",
    label: "함께한 기관 섹션",
    name: "partners",
    fields: [
      { kind: "text", name: "title", label: "제목" },
      { kind: "text", name: "description", label: "설명" },
      { kind: "text", name: "note", label: "주석" },
    ],
  },
  {
    kind: "group",
    label: "하위 페이지 히어로",
    name: "pages",
    fields: [
      {
        kind: "group",
        label: "FAQ 페이지",
        name: "faq",
        fields: [
          { kind: "text", name: "eyebrow", label: "머리말" },
          { kind: "text", name: "title", label: "제목" },
          { kind: "textarea", name: "description", label: "설명", rows: 2 },
        ],
      },
      {
        kind: "group",
        label: "공지사항 페이지",
        name: "announcements",
        fields: [
          { kind: "text", name: "eyebrow", label: "머리말" },
          { kind: "text", name: "title", label: "제목" },
          { kind: "textarea", name: "description", label: "설명", rows: 2 },
        ],
      },
    ],
  },
  {
    kind: "group",
    label: "문의·푸터",
    fields: [
      {
        kind: "group",
        label: "문의",
        name: "contact",
        open: true,
        fields: [
          { kind: "text", name: "label", label: "문의 제목" },
          { kind: "email", name: "email", label: "문의 이메일" },
        ],
      },
      { kind: "text", name: "host", label: "주최" },
      { kind: "text", name: "copyright", label: "저작권 문구" },
    ],
  },
  {
    kind: "group",
    label: "검색·공유 (SEO)",
    name: "seo",
    fields: [
      { kind: "text", name: "title", label: "사이트 제목" },
      { kind: "textarea", name: "description", label: "사이트 설명", rows: 3 },
      { kind: "image", name: "ogImage", label: "공유 이미지 (1200×630 권장)" },
    ],
  },
]

export const EDITION_FIELDS: FieldDef[] = [
  {
    kind: "group",
    label: "기본 정보",
    open: true,
    fields: [
      { kind: "number", name: "number", label: "회차 번호", help: "예: 3 → 제3회" },
      { kind: "number", name: "year", label: "연도" },
      { kind: "text", name: "slug", label: "주소", help: "woojufail.org/주소 — 비우면 연도를 씁니다. 영문 소문자·숫자·하이픈" },
      { kind: "switch", name: "published", label: "사이트에 공개" },
      {
        kind: "select",
        name: "pageMode",
        label: "회차 페이지 방식",
        options: [
          { value: "cms", label: "이 CMS로 회차 페이지 만들기" },
          { value: "external", label: "별도 페이지로 연결 (예: /2026 전달받은 사이트)" },
        ],
      },
      { kind: "text", name: "externalUrl", label: "별도 페이지 주소", help: "'별도 페이지로 연결'일 때만 씁니다. 예: /2026" },
    ],
  },
  {
    kind: "group",
    label: "키컬러",
    help: "메인의 회차 섹션·아카이브, 회차 페이지 전체 색이 이 색으로 정해집니다.",
    fields: [
      { kind: "color", name: "keyColor", label: "키컬러", help: `${COLOR_HELP}. 글자색과 어두운 배경색은 자동으로 계산합니다.` },
      {
        kind: "group",
        label: "보조 색",
        name: "data",
        open: true,
        fields: [{ kind: "colors", name: "accentColors", label: "보조 색", help: "히어로 제목 단어를 이 순서대로 칠합니다." }],
      },
    ],
  },
  {
    kind: "group",
    label: "대회 내용",
    name: "data",
    fields: [
      { kind: "text", name: "title", label: "대회 이름", placeholder: "제3회 우주최고실패대회" },
      { kind: "text", name: "tagline", label: "한 줄 소개" },
      {
        kind: "select",
        name: "status",
        label: "진행 상태",
        options: [
          { value: "auto", label: "자동 (아래 날짜로 계산)" },
          { value: "recruiting", label: "신청 접수 중" },
          { value: "closed", label: "신청 마감 · 대회 예정" },
          { value: "ended", label: "종료" },
        ],
      },
      {
        kind: "group",
        label: "일정·장소",
        fields: [
          { kind: "datetime", name: "deadline", label: "신청 마감" },
          { kind: "datetime", name: "startsAt", label: "대회 시작" },
          { kind: "datetime", name: "endsAt", label: "대회 종료" },
          { kind: "text", name: "dateLabel", label: "날짜 표시 문구", placeholder: "2027.11.10 (수) 19:00–20:30" },
          { kind: "text", name: "venue", label: "장소" },
          { kind: "text", name: "venueDetail", label: "장소 상세 (주소 등)" },
        ],
      },
      {
        kind: "group",
        label: "히어로",
        name: "hero",
        fields: [
          { kind: "text", name: "eyebrow", label: "머리말", placeholder: "Archive · No.03 · 2027" },
          { kind: "text", name: "titleTop", label: "제목 윗줄", placeholder: "제3회" },
          { kind: "strings", name: "titleWords", label: "큰 제목 단어", help: "단어마다 보조 색이 순서대로 칠해집니다.", addLabel: "단어 추가" },
          { kind: "text", name: "subtitle", label: "부제" },
        ],
      },
      {
        kind: "group",
        label: "포스터",
        name: "poster",
        fields: [
          { kind: "image", name: "url", label: "포스터 이미지" },
          { kind: "text", name: "alt", label: "대체 텍스트", help: "화면 낭독기용 설명" },
          { kind: "text", name: "originalUrl", label: "원본 크게 보기 주소", help: "비우면 포스터 이미지를 엽니다." },
          { kind: "number", name: "width", label: "가로 픽셀" },
          { kind: "number", name: "height", label: "세로 픽셀" },
        ],
      },
      {
        kind: "list",
        name: "facts",
        label: "핵심 정보 (히어로 아래 4칸)",
        itemLabel: "정보",
        summaryField: "label",
        fields: [
          { kind: "text", name: "label", label: "항목" },
          { kind: "text", name: "value", label: "값" },
          { kind: "text", name: "sub", label: "보조 문구" },
        ],
      },
      {
        kind: "group",
        label: "신청 링크",
        name: "apply",
        help: "접수 중일 때 회차 페이지에 신청 버튼이 나옵니다.",
        fields: [
          { kind: "url", name: "participantUrl", label: "참가 신청 주소" },
          { kind: "url", name: "observerUrl", label: "참관 신청 주소" },
          { kind: "textarea", name: "note", label: "안내 문구", rows: 2 },
        ],
      },
      {
        kind: "group",
        label: "소개",
        name: "intro",
        fields: [
          { kind: "text", name: "title", label: "섹션 제목" },
          {
            kind: "list",
            name: "cards",
            label: "소개 카드",
            itemLabel: "카드",
            summaryField: "title",
            fields: [
              { kind: "text", name: "title", label: "제목" },
              { kind: "textarea", name: "lead", label: "강조 문장", rows: 2 },
              { kind: "textarea", name: "body", label: "본문", rows: 5, help: "빈 줄로 문단을 나눕니다." },
              {
                kind: "select",
                name: "tone",
                label: "배경",
                options: [
                  { value: "light", label: "밝은 배경" },
                  { value: "key", label: "키컬러 배경" },
                ],
              },
            ],
          },
        ],
      },
      {
        kind: "list",
        name: "timeline",
        label: "대회 일정",
        itemLabel: "일정",
        summaryField: "title",
        fields: [
          { kind: "text", name: "date", label: "날짜" },
          { kind: "text", name: "title", label: "제목" },
          { kind: "textarea", name: "body", label: "설명", rows: 2 },
        ],
      },
      {
        kind: "list",
        name: "rules",
        label: "참가 방식",
        itemLabel: "규칙",
        summaryField: "title",
        fields: [
          { kind: "text", name: "title", label: "항목" },
          { kind: "textarea", name: "body", label: "내용", rows: 2 },
        ],
      },
      {
        kind: "list",
        name: "awards",
        label: "시상",
        itemLabel: "시상",
        summaryField: "title",
        fields: [
          { kind: "text", name: "label", label: "대상" },
          { kind: "text", name: "title", label: "혜택" },
          { kind: "text", name: "body", label: "추가 혜택" },
          { kind: "color", name: "color", label: "카드 색" },
        ],
      },
      {
        kind: "list",
        name: "stats",
        label: "기록 숫자",
        itemLabel: "숫자",
        summaryField: "label",
        fields: [
          { kind: "text", name: "label", label: "항목" },
          { kind: "text", name: "value", label: "숫자" },
          { kind: "text", name: "unit", label: "단위" },
          { kind: "text", name: "note", label: "주석" },
        ],
      },
      {
        kind: "list",
        name: "photos",
        label: "현장 사진",
        itemLabel: "사진",
        summaryField: "caption",
        fields: [
          { kind: "image", name: "url", label: "사진" },
          { kind: "text", name: "alt", label: "대체 텍스트" },
          { kind: "text", name: "caption", label: "설명" },
        ],
      },
      {
        kind: "list",
        name: "press",
        label: "기사",
        itemLabel: "기사",
        summaryField: "title",
        fields: [
          { kind: "text", name: "outlet", label: "매체" },
          { kind: "text", name: "date", label: "날짜" },
          { kind: "text", name: "title", label: "제목" },
          { kind: "textarea", name: "summary", label: "요약", rows: 2 },
          { kind: "url", name: "url", label: "기사 주소" },
          { kind: "url", name: "secondaryUrl", label: "다른 게재본 주소" },
        ],
      },
      {
        kind: "list",
        name: "features",
        label: "이미지+글 카드 (책 등)",
        itemLabel: "카드",
        summaryField: "title",
        fields: [
          { kind: "text", name: "kicker", label: "머리말" },
          { kind: "text", name: "title", label: "제목" },
          { kind: "textarea", name: "body", label: "설명", rows: 2 },
          { kind: "image", name: "imageUrl", label: "이미지" },
          { kind: "text", name: "linkUrl", label: "링크 주소" },
          { kind: "text", name: "linkLabel", label: "링크 문구" },
        ],
      },
      {
        kind: "group",
        label: "영상",
        name: "video",
        fields: [
          { kind: "url", name: "url", label: "영상 주소", help: "Vimeo 또는 YouTube 주소" },
          { kind: "text", name: "title", label: "제목" },
          { kind: "textarea", name: "body", label: "설명", rows: 2 },
          { kind: "switch", name: "portrait", label: "세로 영상 (9:16)" },
        ],
      },
      { kind: "text", name: "organizersTitle", label: "기관 섹션 제목", help: "로고는 [함께한 기관] 메뉴에서 이 회차를 선택하면 나옵니다." },
    ],
  },
]

export const ANNOUNCEMENT_FIELDS: FieldDef[] = [
  { kind: "text", name: "title", label: "제목", required: true },
  { kind: "text", name: "excerpt", label: "요약", help: "목록에 보이는 한 줄" },
  { kind: "textarea", name: "body", label: "본문", rows: 14, help: "빈 줄로 문단을 나눕니다. 주소(https://…)는 자동으로 링크가 됩니다." },
  { kind: "switch", name: "featured", label: "중요 공지 (맨 위에 고정)" },
  { kind: "switch", name: "published", label: "사이트에 공개", help: "공개된 공지가 하나라도 있으면 메뉴에 [공지사항]이 나타납니다." },
  { kind: "datetime", name: "publishedAt", label: "게시 날짜", help: "비우면 공개하는 시점으로 정해집니다." },
]

export function faqFields(editions: Option[]): FieldDef[] {
  return [
    { kind: "text", name: "question", label: "질문", required: true },
    { kind: "textarea", name: "answer", label: "답변", rows: 6 },
    { kind: "select", name: "editionNumber", label: "회차", options: [{ value: "0", label: "일반 (회차 무관)" }, ...editions] },
    { kind: "number", name: "sort", label: "정렬 순서", help: "작은 숫자가 위에 옵니다." },
    { kind: "switch", name: "published", label: "사이트에 공개" },
  ]
}

export function partnerFields(editions: Option[]): FieldDef[] {
  return [
    { kind: "text", name: "name", label: "이름", required: true },
    { kind: "image", name: "logoUrl", label: "로고", help: "배경이 투명한 PNG·SVG 권장" },
    { kind: "url", name: "linkUrl", label: "홈페이지 주소" },
    { kind: "checkboxes", name: "editions", label: "참여 회차", options: editions, numeric: true, help: "선택한 회차 페이지의 기관 섹션에 나옵니다." },
    { kind: "switch", name: "temporary", label: "흰색 로고 (검정으로 바꿔 표시)", help: "포스터에서 뽑은 흰 로고처럼 밝은 배경에서 안 보이는 경우" },
    { kind: "number", name: "sort", label: "정렬 순서" },
    { kind: "switch", name: "published", label: "사이트에 공개" },
  ]
}

export const ADMIN_CREATE_FIELDS: FieldDef[] = [
  { kind: "text", name: "name", label: "이름" },
  { kind: "email", name: "email", label: "이메일", required: true },
  { kind: "password", name: "password", label: "비밀번호", help: "10자 이상. 본인에게 따로 전달해주세요." },
]

export const PASSWORD_FIELDS: FieldDef[] = [
  { kind: "password", name: "current", label: "현재 비밀번호" },
  { kind: "password", name: "next", label: "새 비밀번호", help: "10자 이상" },
]
