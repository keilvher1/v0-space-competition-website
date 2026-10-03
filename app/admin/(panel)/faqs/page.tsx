import { Badge, Card, EmptyState, PageHeader, Row } from "@/components/admin/ui"
import { admin } from "@/lib/cms/queries"

export const metadata = { title: "FAQ" }

export default async function FaqsAdminPage() {
  const [faqs, editions] = await Promise.all([admin.faqs(), admin.editions()])
  const label = (n: number | null) => (n ? editions.find((e) => e.number === n)?.data.title ?? `제${n}회` : "일반")
  return (
    <>
      <PageHeader
        title="FAQ"
        description="회차를 지정하면 FAQ 페이지와 해당 회차 페이지에 함께 나옵니다."
        action={{ href: "/admin/faqs/new", label: "+ 새 FAQ" }}
      />
      <Card>
        {faqs.length === 0 ? (
          <EmptyState>아직 FAQ가 없습니다.</EmptyState>
        ) : (
          <ul className="divide-y divide-line">
            {faqs.map((f) => (
              <Row
                key={f.id}
                href={`/admin/faqs/${f.id}`}
                title={f.question}
                meta={`${label(f.editionNumber)} · 순서 ${f.sort}`}
                badges={<Badge tone={f.published ? "on" : "off"}>{f.published ? "공개" : "비공개"}</Badge>}
              />
            ))}
          </ul>
        )}
      </Card>
    </>
  )
}
