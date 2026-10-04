"use client"

const MAX_BYTES = 4 * 1024 * 1024
const MAX_EDGE = 2560
const RESIZABLE = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"])

function rename(name: string, type: string) {
  const ext = type === "image/webp" ? "webp" : type === "image/png" ? "png" : "jpg"
  return `${name.replace(/\.[^.]+$/, "") || "image"}.${ext}`
}

/** 큰 사진은 긴 변 2560px로 줄인다. 사이트는 올린 이미지를 그대로 쓰므로 방문자 로딩 속도와 직결된다. */
async function shrink(file: File): Promise<File> {
  if (!RESIZABLE.has(file.type) || typeof createImageBitmap !== "function") return file
  let bitmap: ImageBitmap
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: "from-image" })
  } catch {
    return file
  }
  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height))
  if (scale === 1 && file.size <= 1.5 * 1024 * 1024) {
    bitmap.close()
    return file
  }
  const canvas = document.createElement("canvas")
  canvas.width = Math.round(bitmap.width * scale)
  canvas.height = Math.round(bitmap.height * scale)
  const ctx = canvas.getContext("2d")
  if (!ctx) {
    bitmap.close()
    return file
  }
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  bitmap.close()
  // 투명 배경이 있을 수 있는 PNG는 WebP로, 사진은 JPEG로 저장한다
  const type = file.type === "image/png" ? "image/webp" : "image/jpeg"
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, 0.86))
  if (!blob || blob.size >= file.size) return file
  return new File([blob], rename(file.name, blob.type), { type: blob.type })
}

/** 관리자 업로드 API로 이미지를 올리고 주소를 돌려준다(이미지 라이브러리에도 등록됨) */
export async function uploadImage(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) throw new Error("이미지 파일만 올릴 수 있습니다.")
  const prepared = await shrink(file)
  if (prepared.size > MAX_BYTES) {
    throw new Error("4MB 이하로 올려주세요. 큰 사진은 자동으로 줄이지만 GIF·SVG는 줄일 수 없습니다.")
  }
  const body = new FormData()
  body.append("file", prepared, prepared.name)
  const res = await fetch("/api/admin/upload", { method: "POST", body })
  const data = (await res.json().catch(() => ({}))) as { url?: string; error?: string }
  if (!res.ok || !data.url) throw new Error(data.error ?? "업로드하지 못했습니다.")
  return data.url
}
