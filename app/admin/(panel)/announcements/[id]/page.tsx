import { notFound } from "next/navigation"
import { DeleteButton } from "@/components/admin/delete-button"
import { ANNOUNCEMENT_FIELDS } from "@/components/admin/fields"
import { SchemaForm } from "@/components/admin/schema-form"
import { PageHeader, SiteLink } from "@/components/admin/ui"
import { admin } from "@/lib/cms/queries"
import { deleteAnnouncement, saveAnnouncement } from "../../../actions"

export const metadata = { title: "공지 편집" }

export default async function AnnouncementEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const isNew = id === "new"
  const item = isNew ? null : await admin.announcement(id)
  if (!isNew && !item) notFound()

  const initial = item
    ? { title: item.title, excerpt: item.excerpt, body: item.body, featured: item.featured, published: item.published, publishedAt: item.publishedAt ?? "" }
    : { title: "", excerpt: "", body: "", featured: false, published: false, publishedAt: "" }

  return (
    <>
      <PageHeader
        title={isNew ? "새 공지" : item!.title}
        description={isNew ? undefined : <SiteLink href={`/announcements/${item!.id}`} published={item!.published} />}
        back={{ href: "/admin/announcements", label: "공지 목록" }}
      />
      <SchemaForm
        fields={ANNOUNCEMENT_FIELDS}
        initial={initial}
        action={saveAnnouncement.bind(null, isNew ? null : id)}
        redirectBase={isNew ? "/admin/announcements" : undefined}
      />
      {!isNew && (
        <div className="mt-2 mb-24 border-t border-line pt-6">
          <DeleteButton action={deleteAnnouncement.bind(null, id)} redirectTo="/admin/announcements" label="이 공지 삭제" />
        </div>
      )}
    </>
  )
}
