"use client"

import { useRef, useState } from "react"
import { listMediaForPicker } from "@/app/admin/actions"
import type { MediaItem } from "@/lib/cms/types"
import { uploadImage } from "./upload"

const inputCls =
  "w-full rounded-md border border-input bg-white px-3 py-2.5 text-[15px] text-ink outline-none transition focus:border-ink focus:ring-2 focus:ring-coral/40"

export function ImageField({ id, value, onChange }: { id: string; value: string; onChange: (url: string) => void }) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [library, setLibrary] = useState<MediaItem[] | null>(null)

  const onFile = async (file: File | undefined) => {
    if (!file) return
    setBusy(true)
    setError(null)
    try {
      onChange(await uploadImage(file))
    } catch (e) {
      setError(e instanceof Error ? e.message : "업로드하지 못했습니다.")
    } finally {
      setBusy(false)
      if (fileRef.current) fileRef.current.value = ""
    }
  }

  const openLibrary = async () => {
    setError(null)
    try {
      setLibrary(await listMediaForPicker())
    } catch (e) {
      setError(e instanceof Error ? e.message : "라이브러리를 불러오지 못했습니다.")
    }
  }

  return (
    <div className="grid gap-2">
      <div className="flex items-start gap-3">
        <div className="grid size-20 shrink-0 place-items-center overflow-hidden rounded-md border border-line bg-[repeating-conic-gradient(#f3ead6_0_25%,#fff_0_50%)] bg-[length:16px_16px]">
          {value ? <img src={value} alt="" className="max-h-full max-w-full object-contain" /> : <span className="text-[11px] text-ink-soft">없음</span>}
        </div>
        <div className="grid min-w-0 flex-1 gap-2">
          <input id={id} className={inputCls} value={value} placeholder="https://… 또는 /images/…" onChange={(e) => onChange(e.target.value)} />
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={busy}
              className="rounded-md border border-ink bg-ink px-3 py-1.5 text-xs font-bold text-cream disabled:opacity-50"
            >
              {busy ? "업로드 중…" : "이미지 업로드"}
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
        </div>
      </div>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
      {error && <p className="text-xs font-semibold text-red-700">{error}</p>}
      {library && (
        <div className="rounded-lg border border-line bg-paper p-3">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-bold">이미지 라이브러리</p>
            <button type="button" onClick={() => setLibrary(null)} className="text-xs font-bold underline">
              닫기
            </button>
          </div>
          {library.length === 0 ? (
            <p className="text-xs text-ink-soft">아직 올린 이미지가 없습니다.</p>
          ) : (
            <div className="grid max-h-72 grid-cols-3 gap-2 overflow-y-auto sm:grid-cols-5">
              {library.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    onChange(m.url)
                    setLibrary(null)
                  }}
                  className="aspect-square overflow-hidden rounded-md border border-line bg-white hover:border-ink"
                  title={m.pathname}
                >
                  <img src={m.url} alt={m.alt} className="size-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
