"use client"

import { useEffect } from "react"

const skip = () => document.documentElement.classList.add("wf-no-intro")

export function IntroControls() {
  useEffect(() => {
    const overlay = document.querySelector<HTMLElement>(".wf-intro")
    if (!overlay || document.documentElement.classList.contains("wf-no-intro")) return

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") skip()
    }
    // 커튼이 걷히고 나면 인트로를 화면에서 완전히 뺀다. 숨겨진 채로 남으면 별 반짝임 같은
    // 무한 애니메이션이 계속 돌아 스크롤할 때마다 GPU를 쓴다.
    const onEnd = (e: AnimationEvent) => {
      if (e.animationName === "wf-intro-exit") skip()
    }
    // 건너뛰기 버튼뿐 아니라 화면 아무 곳이나 눌러도 넘어가게 한다(모바일)
    overlay.addEventListener("click", skip)
    overlay.addEventListener("animationend", onEnd)
    window.addEventListener("keydown", onKey)
    const fallback = window.setTimeout(skip, 3600)
    return () => {
      window.clearTimeout(fallback)
      window.removeEventListener("keydown", onKey)
      overlay.removeEventListener("click", skip)
      overlay.removeEventListener("animationend", onEnd)
    }
  }, [])

  return (
    <button type="button" tabIndex={-1} onClick={skip} className="wf-intro-skip">
      건너뛰기
    </button>
  )
}
