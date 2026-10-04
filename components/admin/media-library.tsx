"use client"

import { useRef, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { deleteMedia } from "@/app/admin/actions"
import type { MediaItem } from "@/lib/cms/types"
import { uploadImage } from "./upload"

function size(bytes: number) {
  return bytes > 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)}MB` : `${Math.max(1, Math.round(bytes / 1024))}KB`
}

export function MediaLibrary({ items, uploadReady }: { items: MediaItem[]; uploadReady: boolean }) {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const [progress, setProgress] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState<string | null>(null)
  const [confirming, setConfirming] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  const remove = (id: string) =>
    startTransition(async () => {
      setError(null)
      const result = await deleteMedia(id)
      if (!result.ok) setError(result.error)
      setConfirming(null)
      router.refresh()
    })

  const onFiles = async (files: FileList | null) => {
    if (!files?.length) return
    setError(null)
    const list = [...files]
    for (const [i, file] of list.entries()) {
      setProgress(`${i + 1}/${list.length} 올리는 중…`)
      try {
        await uploadImage(file)
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

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-center gap-3 rounded-lg border-2 border-dashed border-line bg-white p-5">
        <button
          type="button"
          disabled={!uploadReady || Boolean(progress)}
          onClick={() => fileRef.current?.click()}
          className="btn btn-coral min-h-11 px-4 py-2 text-[15px] disabled:opacity-50"
        >
          {progress ?? "이미지 올리기"}
        </button>
        <p className="text-sm text-ink-soft">
          {uploadReady ? "여러 장을 한 번에 고를 수 있습니다. 큰 사진은 긴 변 2560px로 자동으로 줄여서 올립니다. (GIF·SVG는 4MB 이하)" : "이미지 저장소(Vercel Blob)가 연결되지 않았습니다."}
        </p>
        <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => onFiles(e.target.files)} />
        {error && <p className="w-full text-sm font-semibold text-red-700">{error}</p>}
      </div>

      {items.length === 0 ? (
        <p className="py-10 text-center text-sm text-ink-soft">아직 올린 이미지가 없습니다.</p>
      ) : (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((m) => (
            <li key={m.id} className="overflow-hidden rounded-lg border border-line bg-white">
              <div className="grid aspect-square place-items-center bg-[repeating-conic-gradient(#f3ead6_0_25%,#fff_0_50%)] bg-[length:16px_16px] p-2">
                <img src={m.url} alt={m.alt} loading="lazy" className="max-h-full max-w-full object-contain" />
              </div>
              <div className="grid gap-2 p-2.5">
                <p className="truncate text-xs text-ink-soft" title={m.pathname}>
                  {m.pathname.split("/").pop()} · {size(m.size)}
                </p>
                {confirming === m.id ? (
                  // 사이트에서 쓰는 이미지를 실수로 지우지 않도록 한 번 더 확인한다
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
          ))}
        </ul>
      )}
    </div>
  )
}
