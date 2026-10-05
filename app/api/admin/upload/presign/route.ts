import { issueSignedToken } from "@vercel/blob"
import { handleUploadPresigned, type HandleUploadPresignedBody } from "@vercel/blob/client"
import { NextResponse } from "next/server"
import { getCurrentAdmin } from "@/lib/auth/session"
import { blobConfigured } from "@/lib/blob"
import { VIDEO_MAX_BYTES, VIDEO_TYPES } from "@/lib/cms/video"

// 동영상처럼 큰 파일은 함수(4.5MB 제한)를 거치지 않고 브라우저가 저장소로 바로 올린다.
// 여기서는 관리자 확인 뒤 그 파일 하나만 올릴 수 있는 짧은 서명만 발급한다.
const fail = (error: string, status: number) => NextResponse.json({ error }, { status })

export async function POST(request: Request) {
  if (!(await getCurrentAdmin())) return fail("로그인이 필요합니다.", 401)
  if (!blobConfigured()) return fail("이미지·동영상 저장소(Vercel Blob)가 아직 연결되지 않았습니다.", 501)

  const body = (await request.json().catch(() => null)) as HandleUploadPresignedBody | null
  if (!body) return fail("잘못된 요청입니다.", 400)
  try {
    const result = await handleUploadPresigned({
      body,
      request,
      getSignedToken: async (pathname, clientPayload) => {
        if (!/^cms\/[\w.\-가-힣]+$/.test(pathname)) throw new Error("파일 이름을 확인해주세요.")
        let meta: { contentType?: unknown; size?: unknown } = {}
        try {
          meta = JSON.parse(clientPayload ?? "{}")
        } catch {}
        const contentType = String(meta.contentType ?? "")
        if (!(VIDEO_TYPES as readonly string[]).includes(contentType)) throw new Error("MP4·WebM·MOV 동영상만 올릴 수 있습니다.")
        if (!(Number(meta.size) > 0 && Number(meta.size) <= VIDEO_MAX_BYTES)) throw new Error("500MB 이하 동영상만 올릴 수 있습니다.")
        const rules = { allowedContentTypes: [contentType], maximumSizeInBytes: VIDEO_MAX_BYTES }
        const token = await issueSignedToken({
          pathname,
          operations: ["put"],
          validUntil: Date.now() + 2 * 60 * 60 * 1000,
          ...rules,
        })
        return { token, urlOptions: { addRandomSuffix: true, ...rules } }
      },
    })
    return NextResponse.json(result)
  } catch (error) {
    return fail(error instanceof Error ? error.message.replace(/^Vercel Blob: /, "") : "업로드를 준비하지 못했습니다.", 400)
  }
}
