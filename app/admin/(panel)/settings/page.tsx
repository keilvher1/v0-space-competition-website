import { SchemaForm } from "@/components/admin/schema-form"
import { SETTINGS_FIELDS } from "@/components/admin/fields"
import { PageHeader } from "@/components/admin/ui"
import { admin } from "@/lib/cms/queries"
import { saveSettings } from "../../actions"

export const metadata = { title: "사이트 설정" }

export default async function SettingsPage() {
  const settings = await admin.settings()
  return (
    <>
      <PageHeader title="사이트 설정" description="메인 페이지 문구와 공통 정보를 편집합니다. 섹션을 눌러 펼치세요." />
      <SchemaForm fields={SETTINGS_FIELDS} initial={settings as unknown as Record<string, unknown>} action={saveSettings} />
    </>
  )
}
