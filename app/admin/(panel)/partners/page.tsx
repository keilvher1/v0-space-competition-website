import { Badge, Card, EmptyState, PageHeader, Row } from "@/components/admin/ui"
import { admin } from "@/lib/cms/queries"

export const metadata = { title: "함께한 기관" }

export default async function PartnersAdminPage() {
  const partners = await admin.partners()
  return (
    <>
      <PageHeader
        title="함께한 기관"
        description="공개된 로고는 메인의 로고 띠에, 참여 회차를 고르면 그 회차 페이지에도 나옵니다."
        action={{ href: "/admin/partners/new", label: "+ 새 기관" }}
      />
      <Card>
        {partners.length === 0 ? (
          <EmptyState>아직 등록된 기관이 없습니다.</EmptyState>
        ) : (
          <ul className="divide-y divide-line">
            {partners.map((p) => (
              <Row
                key={p.id}
                href={`/admin/partners/${p.id}`}
                leading={
                  <span className="grid h-10 w-16 shrink-0 place-items-center rounded border border-line bg-paper p-1">
                    {p.logoUrl && <img src={p.logoUrl} alt="" className={`max-h-full max-w-full object-contain ${p.temporary ? "brightness-0" : ""}`} />}
                  </span>
                }
                title={p.name}
                meta={p.editions.length ? p.editions.map((n) => `제${n}회`).join(", ") : "회차 미지정"}
                badges={<Badge tone={p.published ? "on" : "off"}>{p.published ? "공개" : "비공개"}</Badge>}
              />
            ))}
          </ul>
        )}
      </Card>
    </>
  )
}
