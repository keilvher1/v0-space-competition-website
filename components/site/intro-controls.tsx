"use client"

import { useEffect } from "react"

const skip = () => document.documentElement.classList.add("wf-no-intro")

export function IntroControls() {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") skip()
    }
    window.addEventListener("keydown", onKey)
    // 애니메이션이 끝나면 키 처리도 정리한다
    const done = window.setTimeout(() => window.removeEventListener("keydown", onKey), 3200)
    return () => {
      window.clearTimeout(done)
      window.removeEventListener("keydown", onKey)
    }
  }, [])

  return (
    <button type="button" tabIndex={-1} onClick={skip} className="wf-intro-skip">
      건너뛰기
    </button>
  )
}
