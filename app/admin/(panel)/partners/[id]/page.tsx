import { notFound } from "next/navigation"
import { DeleteButton } from "@/components/admin/delete-button"
import { partnerFields } from "@/components/admin/fields"
import { SchemaForm } from "@/components/admin/schema-form"
import { PageHeader } from "@/components/admin/ui"
import { admin } from "@/lib/cms/queries"
import { deletePartner, savePartner } from "../../../actions"

export const metadata = { title: "기관 편집" }

export default async function PartnerEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const isNew = id === "new"
  const [item, editions] = await Promise.all([isNew ? null : admin.partner(id), admin.editions()])
  if (!isNew && !item) notFound()

  const options = editions.map((e) => ({ value: String(e.number), label: `제${e.number}회 (${e.year})` }))
  const initial = item
    ? { name: item.name, logoUrl: item.logoUrl, linkUrl: item.linkUrl, editions: item.editions, temporary: item.temporary, sort: item.sort, published: item.published }
    : { name: "", logoUrl: "", linkUrl: "", editions: editions[0] ? [editions[0].number] : [], temporary: false, sort: 0, published: true }

  return (
    <>
      <PageHeader title={isNew ? "새 기관" : item!.name} back={{ href: "/admin/partners", label: "기관 목록" }} />
      <SchemaForm
        fields={partnerFields(options)}
        initial={initial}
        action={savePartner.bind(null, isNew ? null : id)}
        redirectBase={isNew ? "/admin/partners" : undefined}
      />
      {!isNew && (
        <div className="mt-2 mb-24 border-t border-line pt-6">
          <DeleteButton action={deletePartner.bind(null, id)} redirectTo="/admin/partners" label="이 기관 삭제" />
        </div>
      )}
    </>
  )
}
