import { put } from "@vercel/blob"
import { NextResponse } from "next/server"
import { getCurrentAdmin } from "@/lib/auth/session"
import { blobConfigured } from "@/lib/blob"
import { query } from "@/lib/db"

// 함수 요청 본문 한도(4.5MB) 안쪽. 큰 사진은 브라우저에서 줄여서 보낸다(components/admin/upload.ts).
const MAX_BYTES = 4 * 1024 * 1024
const TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif", "image/svg+xml"])

const fail = (error: string, status: number) => NextResponse.json({ error }, { status })

// 관리자 화면의 이미지 업로드: Vercel Blob에 올리고 이미지 라이브러리에 등록한다
export async function POST(request: Request) {
  if (!(await getCurrentAdmin())) return fail("로그인이 필요합니다.", 401)
  if (!blobConfigured()) return fail("이미지 저장소(Vercel Blob)가 아직 연결되지 않았습니다. 이미지 주소를 직접 입력해주세요.", 501)

  const form = await request.formData().catch(() => null)
  const file = form?.get("file")
  if (!(file instanceof File)) return fail("파일이 없습니다.", 400)
  if (!TYPES.has(file.type)) return fail("JPG·PNG·WebP·GIF·AVIF·SVG 이미지만 올릴 수 있습니다.", 415)
  if (file.size > MAX_BYTES) return fail("4MB 이하 이미지만 올릴 수 있습니다.", 413)

  const name = file.name.normalize("NFC").replace(/[^\w.\-가-힣]+/g, "-").slice(-80) || "image"
  try {
    const blob = await put(`cms/${name}`, file, { access: "public", addRandomSuffix: true, contentType: file.type })
    await query(
      `insert into cms_media (url, pathname, content_type, size) values ($1,$2,$3,$4) on conflict (url) do nothing`,
      [blob.url, blob.pathname, file.type, file.size],
    )
    return NextResponse.json({ url: blob.url })
  } catch (error) {
    return fail(error instanceof Error ? error.message : "업로드하지 못했습니다.", 500)
  }
}
