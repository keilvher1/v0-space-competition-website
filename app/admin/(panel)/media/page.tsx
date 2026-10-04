import { MediaLibrary } from "@/components/admin/media-library"
import { PageHeader } from "@/components/admin/ui"
import { blobConfigured } from "@/lib/blob"
import { admin } from "@/lib/cms/queries"

export const metadata = { title: "이미지" }

export default async function MediaPage() {
  const items = await admin.media()
  return (
    <>
      <PageHeader
        title="이미지"
        description="여기서 올린 이미지는 각 편집 화면의 [라이브러리에서 선택]으로 고를 수 있습니다. 사용 중인 이미지를 삭제하면 사이트에서도 보이지 않으니 주의하세요."
      />
      <MediaLibrary items={items} uploadReady={blobConfigured()} />
    </>
  )
}
