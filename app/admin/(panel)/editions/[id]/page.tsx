import { notFound } from "next/navigation"
import { DeleteButton } from "@/components/admin/delete-button"
import { EDITION_FIELDS } from "@/components/admin/fields"
import { SchemaForm } from "@/components/admin/schema-form"
import { PageHeader } from "@/components/admin/ui"
import { emptyEditionData } from "@/lib/cms/defaults"
import { editionHref } from "@/lib/cms/links"
import { admin } from "@/lib/cms/queries"
import { SiteLink } from "@/components/admin/ui"
import { deleteEdition, saveEdition } from "../../../actions"

export const metadata = { title: "회차 편집" }

export default async function EditionEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const isNew = id === "new"
  const edition = isNew ? null : await admin.edition(id)
  if (!isNew && !edition) notFound()

  const next = isNew ? Math.max(0, ...(await admin.editions()).map((e) => e.number)) + 1 : 0
  const year = new Date().getFullYear()
  const initial = edition
    ? {
        number: edition.number,
        year: edition.year,
        slug: edition.slug,
        published: edition.published,
        pageMode: edition.pageMode,
        externalUrl: edition.externalUrl,
        keyColor: edition.keyColor,
        data: edition.data,
      }
    : {
        number: next,
        year,
        slug: String(year),
        published: false,
        pageMode: "cms",
        externalUrl: "",
        keyColor: "#2bb6e3",
        data: { ...emptyEditionData(), title: `제${next}회 우주최고실패대회`, accentColors: ["#fcedce", "#e65840"] },
      }

  return (
    <>
      <PageHeader
        title={isNew ? "새 회차" : edition!.data.title || `제${edition!.number}회`}
        description={
          isNew
            ? "처음에는 비공개로 만들어집니다. 내용을 채운 뒤 [사이트에 공개]를 켜세요."
            : <SiteLink href={editionHref(edition!)} published={edition!.published} />
        }
        back={{ href: "/admin/editions", label: "회차 목록" }}
      />
      <SchemaForm
        fields={EDITION_FIELDS}
        initial={initial as unknown as Record<string, unknown>}
        action={saveEdition.bind(null, isNew ? null : id)}
        redirectBase={isNew ? "/admin/editions" : undefined}
      />
      {!isNew && (
        <div className="mt-2 mb-24 border-t border-line pt-6">
          <DeleteButton action={deleteEdition.bind(null, id)} redirectTo="/admin/editions" label="이 회차 삭제" />
        </div>
      )}
    </>
  )
}
