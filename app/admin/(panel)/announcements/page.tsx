import { Badge, Card, EmptyState, PageHeader, Row } from "@/components/admin/ui"
import { admin } from "@/lib/cms/queries"
import { formatDate } from "@/lib/utils"

export const metadata = { title: "공지사항" }

export default async function AnnouncementsAdminPage() {
  const items = await admin.announcements()
  return (
    <>
      <PageHeader
        title="공지사항"
        description="공개된 공지가 하나라도 있으면 사이트 메뉴에 [공지사항]이 나타납니다."
        action={{ href: "/admin/announcements/new", label: "+ 새 공지" }}
      />
      <Card>
        {items.length === 0 ? (
          <EmptyState>아직 공지가 없습니다.</EmptyState>
        ) : (
          <ul className="divide-y divide-line">
            {items.map((a) => (
              <Row
                key={a.id}
                href={`/admin/announcements/${a.id}`}
                title={a.title}
                meta={formatDate(a.publishedAt ?? a.createdAt)}
                badges={
                  <>
                    {a.featured && <Badge tone="warn">중요</Badge>}
                    <Badge tone={a.published ? "on" : "off"}>{a.published ? "공개" : "비공개"}</Badge>
                  </>
                }
              />
            ))}
          </ul>
        )}
      </Card>
    </>
  )
}
