"use client"

import { useEffect, useState } from "react"

/** 화면 1.5개 이상 내려가면 오른쪽 아래에 나타나는 '맨 위로' 버튼 */
export function BackToTop() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    // 스크롤 이벤트마다 계산하지 않고 프레임당 한 번, 상태가 바뀔 때만 다시 그린다
    let frame = 0
    let last = false
    const update = () => {
      frame = 0
      const next = window.scrollY > window.innerHeight * 1.5
      if (next !== last) {
        last = next
        setShow(next)
      }
    }
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }
    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <button
      type="button"
      aria-label="맨 위로"
      aria-hidden={!show}
      tabIndex={show ? 0 : -1}
      onClick={() => {
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
        window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" })
      }}
      className={`fixed right-4 bottom-4 z-40 grid size-12 place-items-center border-2 border-ink bg-cream text-ink shadow-[4px_4px_0_var(--ink)] transition duration-200 hover:bg-sun md:right-6 md:bottom-6 ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" className="size-6" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 19V5M6 11l6-6 6 6" />
      </svg>
    </button>
  )
}
