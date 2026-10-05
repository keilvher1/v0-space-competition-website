import { MediaLibrary } from "@/components/admin/media-library"
import { PageHeader } from "@/components/admin/ui"
import { blobConfigured } from "@/lib/blob"
import { admin } from "@/lib/cms/queries"

export const metadata = { title: "미디어" }

export default async function MediaPage() {
  const items = await admin.media()
  return (
    <>
      <PageHeader
        title="미디어"
        description="여기서 올린 이미지·동영상은 각 편집 화면의 [라이브러리에서 선택]으로 고를 수 있습니다. 사이트에서 쓰는 파일을 삭제하면 사이트에서도 보이지 않으니 주의하세요."
      />
      <MediaLibrary items={items} uploadReady={blobConfigured()} />
    </>
  )
}
