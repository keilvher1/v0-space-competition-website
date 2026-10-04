# 우주최고실패대회 웹사이트

[www.woojufail.org](https://www.woojufail.org) — 회차별 대회 아카이브와 현재 회차 안내. Next.js(App Router) · Vercel · Neon Postgres.

## 구조

| 경로 | 내용 |
| --- | --- |
| `app/(site)` | 공개 페이지: `/` 메인, `/[주소]` 회차 페이지(CMS), `/faq`, `/announcements` |
| `public/2026` | 제2회 사이트. 전달받은 정적 사이트를 그대로 `/2026`에서 서비스 |
| `app/admin`, `components/admin` | 관리자(CMS) |
| `app/api/admin/upload` | 관리자 이미지 업로드(Vercel Blob) |
| `lib/cms` | 콘텐츠 타입·기본값·조회·키컬러 계산 |
| `lib/db` | Postgres 연결, `cms_` 테이블 자동 생성·기본값 입력 |
| `lib/auth` | 관리자 비밀번호·세션 |

## 콘텐츠 관리 (`/admin`)

- **사이트 설정**: 메인 히어로, 슬로건 띠, 소개, 기록 타일, 첫 방문 인트로, 문의처, 검색·공유 정보
- **회차**: 키컬러, 히어로, 일정, 포스터, 신청 링크, 소개·일정·규칙·시상·기록·영상. 키컬러를 바꾸면 회차 페이지와 메인의 현재 회차 섹션 색이 함께 바뀐다. 별도로 만든 사이트가 있으면 '별도 페이지로 연결'을 고른다(예: `/2026`).
- **공지사항, FAQ, 함께한 기관, 이미지, 관리자 계정**

저장하면 공개 페이지에 바로 반영된다.

## 환경변수

| 이름 | 용도 |
| --- | --- |
| `DATABASE_URL` | Neon Postgres(Vercel 연동). `cms_` 테이블은 첫 요청 때 자동으로 만들고 현재 사이트 내용으로 채운다. 없거나 연결이 안 되면 기본 내용으로 표시한다. |
| `BLOB_READ_WRITE_TOKEN` 또는 `BLOB_STORE_ID` | Vercel Blob 저장소를 프로젝트에 연결하면 자동으로 생긴다. 없으면 이미지 업로드 대신 주소를 직접 입력한다. |
| `ADMIN_SETUP_TOKEN` | 비상용(16자 이상). 설정하면 어느 환경에서든 `/admin/setup`에서 이 토큰으로 관리자를 만들거나 비밀번호를 다시 정할 수 있다. 쓰고 나면 지운다. |

## 첫 관리자

관리자가 한 명도 없을 때, 운영이 아닌 배포(Vercel 로그인으로 보호되는 프리뷰 주소)나 로컬에서 `/admin/setup`으로 만든다. 프리뷰와 운영은 같은 DB를 쓰므로 그 계정으로 운영 사이트에도 로그인된다. 이후 관리자는 [관리자 계정] 메뉴에서 추가한다.

## 로컬 개발

```bash
pnpm install
DATABASE_URL="postgresql://…" pnpm dev   # DATABASE_URL이 없으면 공개 페이지만 기본 내용으로 뜬다
```
