"use client"

import { useEffect, useRef, useState } from "react"

/**
 * 영상은 누를 때 불러온다. 플레이어(외부 플레이어는 수백 KB 스크립트)가 스크롤 도중에 로드되며
 * 모바일 스크롤을 버벅이게 했다. 누르기 전에는 미리보기와 재생 버튼만 보여준다.
 * - kind="embed": Vimeo·YouTube iframe
 * - kind="file": 직접 올린 동영상(브라우저 기본 플레이어)
 */
export function VideoEmbed({
  src,
  title,
  thumbnail,
  kind = "embed",
}: {
  src: string
  title: string
  thumbnail: string | null
  kind?: "embed" | "file"
}) {
  const [playing, setPlaying] = useState(false)
  const player = useRef<HTMLIFrameElement & HTMLVideoElement>(null)

  useEffect(() => {
    if (playing) player.current?.focus()
  }, [playing])

  const start = () => {
    setPlaying(true)
    window.dispatchEvent(new CustomEvent("wf:track", { detail: { name: "video", label: title } }))
  }

  if (playing && kind === "file") {
    return <video ref={player} src={src} title={title} controls autoPlay playsInline className="absolute inset-0 size-full bg-ink object-contain" />
  }
  if (playing) {
    const url = new URL(src)
    url.searchParams.set("autoplay", "1")
    return (
      <iframe
        ref={player}
        src={url.toString()}
        title={title}
        allow="autoplay; fullscreen; picture-in-picture"
        className="absolute inset-0 size-full"
      />
    )
  }

  return (
    <button
      type="button"
      onClick={start}
      aria-label={`영상 재생: ${title}`}
      className="group absolute inset-0 grid size-full place-items-center overflow-hidden bg-ink text-cream"
    >
      {thumbnail ? (
        <img src={thumbnail} alt="" loading="lazy" decoding="async" className="absolute inset-0 size-full object-cover opacity-80" />
      ) : (
        kind === "file" && (
          // 미리보기 이미지가 없으면 동영상의 첫 장면을 보여준다(앞부분 정보만 받는다)
          <video src={`${src}#t=0.1`} preload="metadata" muted playsInline tabIndex={-1} className="absolute inset-0 size-full object-cover opacity-80" />
        )
      )}
      <span className="relative grid justify-items-center gap-3">
        <span className="grid size-20 place-items-center rounded-full border-2 border-ink bg-coral text-ink shadow-[4px_4px_0_var(--ink)] transition-transform duration-200 group-hover:scale-105">
          <svg viewBox="0 0 24 24" aria-hidden="true" className="ml-1 size-9" fill="currentColor">
            <path d="M7 4.5v15l12.5-7.5z" />
          </svg>
        </span>
        <span className="rounded-full bg-ink/80 px-3 py-1 text-sm font-bold">눌러서 재생</span>
      </span>
    </button>
  )
}
