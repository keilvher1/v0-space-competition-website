import Link from "next/link"
import { Badge, Card, PageHeader } from "@/components/admin/ui"
import { blobConfigured } from "@/lib/blob"
import { admin } from "@/lib/cms/queries"
import { STATUS_LABEL, editionStatus } from "@/lib/cms/utils"

export const metadata = { title: "대시보드" }

const LINKS = [
  { href: "/admin/settings", title: "사이트 설정", body: "메인 히어로·슬로건·소개·기록 타일·인트로·문의처" },
  { href: "/admin/editions", title: "회차", body: "회차별 키컬러·히어로·일정·규칙·시상·기록·영상" },
  { href: "/admin/announcements", title: "공지사항", body: "공지 작성·공개 (공개된 공지가 있으면 메뉴에 표시)" },
  { href: "/admin/faqs", title: "FAQ", body: "회차별 자주 묻는 질문" },
  { href: "/admin/partners", title: "함께한 기관", body: "로고와 참여 회차" },
  { href: "/admin/media", title: "이미지", body: "포스터·사진·로고 업로드" },
]

export default async function DashboardPage() {
  const [counts, editions] = await Promise.all([admin.counts(), admin.editions()])
  const current = editions.find((e) => e.published)
  const blobReady = blobConfigured()

  return (
    <>
      <PageHeader title="대시보드" description="저장하면 사이트에 바로 반영됩니다." />
      {!blobReady && (
        <Card className="mb-6 border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
          이미지 저장소(Vercel Blob)가 연결되지 않아 이미지 업로드를 쓸 수 없습니다. 이미지 주소를 직접 입력하는 것은 가능합니다.
        </Card>
      )}
      {current && (
        <Card className="mb-6 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold text-ink-soft">현재 회차</p>
              <p className="mt-1 text-xl font-extrabold">{current.data.title}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="size-5 rounded-full border border-ink" style={{ background: current.keyColor }} aria-hidden="true" />
              <Badge tone="on">{STATUS_LABEL[editionStatus(current)]}</Badge>
              <Link href={`/admin/editions/${current.id}`} className="text-sm font-bold underline underline-offset-4">
                편집
              </Link>
            </div>
          </div>
        </Card>
      )}
      <dl className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
        {[
          ["회차", counts.editions],
          ["공지", counts.announcements],
          ["FAQ", counts.faqs],
          ["기관", counts.partners],
          ["이미지", counts.media],
        ].map(([label, n]) => (
          <Card key={label} className="p-4">
            <dt className="text-xs font-bold text-ink-soft">{label}</dt>
            <dd className="mt-1 font-display text-3xl font-bold">{n ?? 0}</dd>
          </Card>
        ))}
      </dl>
      <div className="grid gap-3 sm:grid-cols-2">
        {LINKS.map((link) => (
          <Link key={link.href} href={link.href} className="block rounded-lg border border-line bg-white p-5 transition hover:border-ink">
            <p className="text-lg font-extrabold">{link.title} →</p>
            <p className="mt-1 text-sm text-ink-soft">{link.body}</p>
          </Link>
        ))}
      </div>
    </>
  )
}
