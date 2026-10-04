"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

/**
 * 스크롤 성능을 위한 화면 관찰자(공개 페이지 공통).
 * - 등장 효과: 요소가 처음 보일 때 한 번만 재생한다. 스크롤 연동 애니메이션은 계속 '실행 중'으로 남아
 *   요소마다 GPU 레이어를 붙잡고 있어 모바일 스크롤을 무겁게 했다.
 * - 흐르는 띠·회전 스티커: 화면 밖에 있을 때는 멈춘다.
 */
export function MotionObserver() {
  const pathname = usePathname()

  useEffect(() => {
    const root = document.documentElement
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const items = [...document.querySelectorAll<HTMLElement>(".reveal:not(.is-revealed)")]
    let revealObserver: IntersectionObserver | undefined

    if (reduce || !("IntersectionObserver" in window)) {
      for (const el of items) el.classList.add("is-revealed")
    } else {
      // 이미 화면에 들어와 있는 요소는 바로 보이게 해서 깜빡이지 않게 한다
      const fold = window.innerHeight * 0.92
      for (const el of items) if (el.getBoundingClientRect().top < fold) el.classList.add("is-revealed")
      root.classList.add("reveal-ready")
      revealObserver = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue
            entry.target.classList.add("is-revealed")
            revealObserver?.unobserve(entry.target)
          }
        },
        { rootMargin: "0px 0px -8% 0px" },
      )
      for (const el of items) if (!el.classList.contains("is-revealed")) revealObserver.observe(el)
    }

    const loopObserver =
      "IntersectionObserver" in window
        ? new IntersectionObserver((entries) => {
            for (const entry of entries) entry.target.classList.toggle("is-offscreen", !entry.isIntersecting)
          })
        : undefined
    for (const el of document.querySelectorAll(".marquee, .spin-slow")) loopObserver?.observe(el)

    return () => {
      revealObserver?.disconnect()
      loopObserver?.disconnect()
    }
  }, [pathname])

  return null
}
