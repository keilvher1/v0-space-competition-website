"use client"

import { useRef, useState } from "react"
import { listMediaForPicker } from "@/app/admin/actions"
import type { MediaItem } from "@/lib/cms/types"
import { isDirectVideo } from "@/lib/cms/video"
import { uploadVideo } from "./upload"

const inputCls =
  "w-full rounded-md border border-input bg-white px-3 py-2.5 text-[15px] text-ink outline-none transition focus:border-ink focus:ring-2 focus:ring-coral/40"

/** 영상 칸: Vimeo·YouTube 주소를 넣거나, 동영상 파일을 올리거나, 라이브러리에서 고른다 */
export function VideoField({ id, value, onChange }: { id: string; value: string; onChange: (url: string) => void }) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [progress, setProgress] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [library, setLibrary] = useState<MediaItem[] | null>(null)
  const direct = isDirectVideo(value)

  const onFile = async (file: File | undefined) => {
    if (!file) return
    setError(null)
    setProgress(0)
    try {
      onChange(await uploadVideo(file, setProgress))
    } catch (e) {
      setError(e instanceof Error ? e.message : "업로드하지 못했습니다.")
    } finally {
      setProgress(null)
      if (fileRef.current) fileRef.current.value = ""
    }
  }

  const openLibrary = async () => {
    setError(null)
    try {
      setLibrary(await listMediaForPicker("video"))
    } catch (e) {
      setError(e instanceof Error ? e.message : "라이브러리를 불러오지 못했습니다.")
    }
  }

  return (
    <div className="grid gap-2">
      <input id={id} className={inputCls} value={value} placeholder="https://vimeo.com/… 또는 동영상 파일 올리기" onChange={(e) => onChange(e.target.value)} />
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={progress !== null}
          className="rounded-md border border-ink bg-ink px-3 py-1.5 text-xs font-bold text-cream disabled:opacity-70"
        >
          {progress !== null ? `올리는 중 ${progress}%` : "동영상 업로드"}
        </button>
        <button type="button" onClick={openLibrary} className="rounded-md border border-line bg-white px-3 py-1.5 text-xs font-bold">
          라이브러리에서 선택
        </button>
        {value && (
          <button type="button" onClick={() => onChange("")} className="rounded-md border border-red-300 px-3 py-1.5 text-xs font-bold text-red-700">
            비우기
          </button>
        )}
      </div>
      {progress !== null && (
        <div className="h-1.5 overflow-hidden rounded-full bg-line" aria-hidden="true">
          <div className="h-full bg-coral transition-[width]" style={{ width: `${progress}%` }} />
        </div>
      )}
      <p className="text-xs leading-relaxed text-ink-soft">
        Vimeo·YouTube 주소를 붙여 넣거나 동영상 파일(500MB 이하)을 올리세요. 휴대폰으로 찍은 영상은 MP4(H.264)가 가장 잘 재생됩니다.
      </p>
      <input ref={fileRef} type="file" accept="video/mp4,video/webm,video/quicktime" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
      {error && <p className="text-xs font-semibold text-red-700">{error}</p>}
      {direct && (
        <video src={value} controls preload="metadata" playsInline className="max-h-64 w-full max-w-sm rounded-md border border-line bg-ink" />
      )}
      {library && (
        <div className="rounded-lg border border-line bg-paper p-3">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-bold">동영상 라이브러리</p>
            <button type="button" onClick={() => setLibrary(null)} className="text-xs font-bold underline">
              닫기
            </button>
          </div>
          {library.length === 0 ? (
            <p className="text-xs text-ink-soft">아직 올린 동영상이 없습니다.</p>
          ) : (
            <div className="grid max-h-72 grid-cols-2 gap-2 overflow-y-auto sm:grid-cols-4">
              {library.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    onChange(m.url)
                    setLibrary(null)
                  }}
                  className="overflow-hidden rounded-md border border-line bg-ink text-left hover:border-coral"
                  title={m.pathname}
                >
                  <video src={`${m.url}#t=0.1`} preload="metadata" muted playsInline className="aspect-video w-full object-cover" />
                  <span className="block truncate bg-white px-2 py-1 text-[11px]">{m.pathname.split("/").pop()}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
