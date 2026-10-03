import { Badge, Card, EmptyState, PageHeader, Row } from "@/components/admin/ui"
import { admin } from "@/lib/cms/queries"
import { STATUS_LABEL, editionStatus } from "@/lib/cms/utils"

export const metadata = { title: "회차" }

export default async function EditionsPage() {
  const editions = await admin.editions()
  return (
    <>
      <PageHeader
        title="회차"
        description="새 회차를 추가하면 메인의 역대 대회 목록과 회차 페이지(/연도)가 자동으로 만들어집니다."
        action={{ href: "/admin/editions/new", label: "+ 새 회차" }}
      />
      <Card>
        {editions.length === 0 ? (
          <EmptyState>아직 회차가 없습니다.</EmptyState>
        ) : (
          <ul className="divide-y divide-line">
            {editions.map((e) => (
              <Row
                key={e.id}
                href={`/admin/editions/${e.id}`}
                leading={<span className="size-9 shrink-0 rounded-full border-2 border-ink" style={{ background: e.keyColor }} aria-hidden="true" />}
                title={e.data.title || `제${e.number}회`}
                meta={`${e.year} · ${e.pageMode === "external" ? `별도 페이지 ${e.externalUrl}` : `/${e.slug}`}`}
                badges={
                  <>
                    <Badge tone={e.published ? "on" : "off"}>{e.published ? "공개" : "비공개"}</Badge>
                    <Badge>{STATUS_LABEL[editionStatus(e)]}</Badge>
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
