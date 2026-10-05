"use client"

import { useRef, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { deleteMedia } from "@/app/admin/actions"
import type { MediaItem } from "@/lib/cms/types"
import { uploadImage, uploadVideo } from "./upload"

function size(bytes: number) {
  return bytes > 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)}MB` : `${Math.max(1, Math.round(bytes / 1024))}KB`
}

type Filter = "all" | "image" | "video"
const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "전체" },
  { key: "image", label: "이미지" },
  { key: "video", label: "동영상" },
]

export function MediaLibrary({ items, uploadReady }: { items: MediaItem[]; uploadReady: boolean }) {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const [progress, setProgress] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState<string | null>(null)
  const [confirming, setConfirming] = useState<string | null>(null)
  const [filter, setFilter] = useState<Filter>("all")
  const [pending, startTransition] = useTransition()

  const shown = filter === "all" ? items : items.filter((m) => m.contentType.startsWith(`${filter}/`))

  const onFiles = async (files: FileList | null) => {
    if (!files?.length) return
    setError(null)
    const list = [...files]
    for (const [i, file] of list.entries()) {
      const prefix = list.length > 1 ? `${i + 1}/${list.length} ` : ""
      try {
        if (file.type.startsWith("video/") || /\.(mp4|m4v|mov|webm)$/i.test(file.name)) {
          setProgress(`${prefix}동영상 올리는 중 0%`)
          await uploadVideo(file, (p) => setProgress(`${prefix}동영상 올리는 중 ${p}%`))
        } else {
          setProgress(`${prefix}이미지 올리는 중…`)
          await uploadImage(file)
        }
      } catch (e) {
        setError(`${file.name}: ${e instanceof Error ? e.message : "업로드 실패"}`)
        break
      }
    }
    setProgress(null)
    if (fileRef.current) fileRef.current.value = ""
    router.refresh()
  }

  const copy = async (url: string) => {
    await navigator.clipboard.writeText(url)
    setCopied(url)
    window.setTimeout(() => setCopied(null), 1500)
  }

  const remove = (id: string) =>
    startTransition(async () => {
      setError(null)
      const result = await deleteMedia(id)
      if (!result.ok) setError(result.error)
      setConfirming(null)
      router.refresh()
    })

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-center gap-3 rounded-lg border-2 border-dashed border-line bg-white p-5">
        <button
          type="button"
          disabled={!uploadReady || Boolean(progress)}
          onClick={() => fileRef.current?.click()}
          className="btn btn-coral min-h-11 px-4 py-2 text-[15px] disabled:opacity-60"
        >
          {progress ?? "이미지·동영상 올리기"}
        </button>
        <p className="text-sm leading-relaxed text-ink-soft">
          {uploadReady
            ? "여러 개를 한 번에 고를 수 있습니다. 큰 사진은 긴 변 2560px로 자동으로 줄이고, 동영상은 500MB까지(MP4 권장) 올릴 수 있습니다."
            : "저장소(Vercel Blob)가 연결되지 않았습니다."}
        </p>
        <input
          ref={fileRef}
          type="file"
          accept="image/*,video/mp4,video/webm,video/quicktime"
          multiple
          className="hidden"
          onChange={(e) => onFiles(e.target.files)}
        />
        {error && <p className="w-full text-sm font-semibold text-red-700">{error}</p>}
      </div>

      <div className="flex gap-2" role="tablist" aria-label="종류">
        {FILTERS.map((f) => {
          const count = f.key === "all" ? items.length : items.filter((m) => m.contentType.startsWith(`${f.key}/`)).length
          return (
            <button
              key={f.key}
              type="button"
              role="tab"
              aria-selected={filter === f.key}
              onClick={() => setFilter(f.key)}
              className={`rounded-full border px-3.5 py-1.5 text-sm font-bold ${filter === f.key ? "border-ink bg-ink text-cream" : "border-line bg-white"}`}
            >
              {f.label} {count}
            </button>
          )
        })}
      </div>

      {shown.length === 0 ? (
        <p className="py-10 text-center text-sm text-ink-soft">아직 올린 파일이 없습니다.</p>
      ) : (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {shown.map((m) => {
            const video = m.contentType.startsWith("video/")
            return (
              <li key={m.id} className="overflow-hidden rounded-lg border border-line bg-white">
                <div className="relative grid aspect-square place-items-center bg-[repeating-conic-gradient(#f3ead6_0_25%,#fff_0_50%)] bg-[length:16px_16px] p-2">
                  {video ? (
                    <video src={`${m.url}#t=0.1`} preload="metadata" muted playsInline controls className="max-h-full max-w-full bg-ink" />
                  ) : (
                    <img src={m.url} alt={m.alt} loading="lazy" decoding="async" className="max-h-full max-w-full object-contain" />
                  )}
                  {video && <span className="absolute top-2 left-2 rounded bg-ink px-1.5 py-0.5 text-[11px] font-bold text-cream">동영상</span>}
                </div>
                <div className="grid gap-2 p-2.5">
                  <p className="truncate text-xs text-ink-soft" title={m.pathname}>
                    {m.pathname.split("/").pop()} · {size(m.size)}
                  </p>
                  {confirming === m.id ? (
                    // 사이트에서 쓰는 파일을 실수로 지우지 않도록 한 번 더 확인한다
                    <div className="flex gap-1.5">
                      <button
                        type="button"
                        disabled={pending}
                        onClick={() => remove(m.id)}
                        className="min-h-9 flex-1 rounded-md border border-red-700 bg-red-700 px-2 py-1.5 text-xs font-bold text-white disabled:opacity-60"
                      >
                        {pending ? "삭제 중…" : "정말 삭제"}
                      </button>
                      <button type="button" onClick={() => setConfirming(null)} className="min-h-9 rounded-md border border-line px-2 py-1.5 text-xs font-bold">
                        취소
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-1.5">
                      <button type="button" onClick={() => copy(m.url)} className="min-h-9 flex-1 rounded-md border border-line px-2 py-1.5 text-xs font-bold">
                        {copied === m.url ? "복사됨" : "주소 복사"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirming(m.id)}
                        className="min-h-9 rounded-md border border-red-300 px-2 py-1.5 text-xs font-bold text-red-700"
                      >
                        삭제
                      </button>
                    </div>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
