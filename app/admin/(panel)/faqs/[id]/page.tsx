import { notFound } from "next/navigation"
import { DeleteButton } from "@/components/admin/delete-button"
import { faqFields } from "@/components/admin/fields"
import { SchemaForm } from "@/components/admin/schema-form"
import { PageHeader } from "@/components/admin/ui"
import { admin } from "@/lib/cms/queries"
import { deleteFaq, saveFaq } from "../../../actions"

export const metadata = { title: "FAQ 편집" }

export default async function FaqEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const isNew = id === "new"
  const [item, editions] = await Promise.all([isNew ? null : admin.faq(id), admin.editions()])
  if (!isNew && !item) notFound()

  const options = editions.map((e) => ({ value: String(e.number), label: e.data.title || `제${e.number}회` }))
  const initial = item
    ? { question: item.question, answer: item.answer, editionNumber: String(item.editionNumber ?? 0), sort: item.sort, published: item.published }
    : { question: "", answer: "", editionNumber: String(editions[0]?.number ?? 0), sort: 0, published: true }

  return (
    <>
      <PageHeader title={isNew ? "새 FAQ" : "FAQ 편집"} back={{ href: "/admin/faqs", label: "FAQ 목록" }} />
      <SchemaForm
        fields={faqFields(options)}
        initial={initial}
        action={saveFaq.bind(null, isNew ? null : id)}
        redirectBase={isNew ? "/admin/faqs" : undefined}
      />
      {!isNew && (
        <div className="mt-2 mb-24 border-t border-line pt-6">
          <DeleteButton action={deleteFaq.bind(null, id)} redirectTo="/admin/faqs" label="이 FAQ 삭제" />
        </div>
      )}
    </>
  )
}
