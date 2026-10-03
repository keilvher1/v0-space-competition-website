import { DeleteButton } from "@/components/admin/delete-button"
import { ADMIN_CREATE_FIELDS, PASSWORD_FIELDS } from "@/components/admin/fields"
import { SchemaForm } from "@/components/admin/schema-form"
import { Badge, Card, PageHeader } from "@/components/admin/ui"
import { requireAdmin } from "@/lib/auth/session"
import { query } from "@/lib/db"
import { formatDate } from "@/lib/utils"
import { changePassword, createAdmin, deleteAdmin } from "../../actions"

export const metadata = { title: "관리자 계정" }

export default async function UsersPage() {
  const me = await requireAdmin()
  const admins = await query<{ id: string; email: string; name: string; last_login_at: Date | null }>(
    `select id, email, name, last_login_at from cms_admins order by created_at asc`,
  )

  return (
    <>
      <PageHeader title="관리자 계정" description="관리자는 모든 내용을 편집하고 다른 관리자를 추가·삭제할 수 있습니다." />
      <Card className="mb-8">
        <ul className="divide-y divide-line">
          {admins.map((a) => (
            <li key={a.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-4">
              <div className="min-w-0">
                <p className="truncate font-extrabold">
                  {a.name || a.email} {a.id === me.id && <Badge tone="on">나</Badge>}
                </p>
                <p className="truncate text-sm text-ink-soft">
                  {a.email} · 마지막 로그인 {a.last_login_at ? formatDate(a.last_login_at.toISOString()) : "없음"}
                </p>
              </div>
              {a.id !== me.id && <DeleteButton action={deleteAdmin.bind(null, a.id)} label="삭제" />}
            </li>
          ))}
        </ul>
      </Card>

      <h2 className="mb-3 text-xl font-extrabold">관리자 추가</h2>
      <div className="mb-10 [&_form]:pb-0 [&_form>div.fixed]:static [&_form>div.fixed]:border-0 [&_form>div.fixed]:bg-transparent [&_form>div.fixed]:p-0">
        <SchemaForm fields={ADMIN_CREATE_FIELDS} initial={{ name: "", email: "", password: "" }} action={createAdmin} submitLabel="관리자 추가" />
      </div>

      <h2 className="mb-3 text-xl font-extrabold">내 비밀번호 바꾸기</h2>
      <div className="[&_form]:pb-0 [&_form>div.fixed]:static [&_form>div.fixed]:border-0 [&_form>div.fixed]:bg-transparent [&_form>div.fixed]:p-0">
        <SchemaForm fields={PASSWORD_FIELDS} initial={{ current: "", next: "" }} action={changePassword} submitLabel="비밀번호 바꾸기" />
      </div>
    </>
  )
}
