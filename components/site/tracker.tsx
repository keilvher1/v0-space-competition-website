"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

type Hit = { kind: "view" | "event"; path: string; name?: string; label?: string; ref?: string; src?: string; entry?: boolean }

/** 방문 통계 전송. 페이지를 떠나도 잃지 않도록 sendBeacon을 쓴다. */
export function track(hit: Hit) {
  try {
    const body = JSON.stringify(hit)
    if (navigator.sendBeacon?.("/api/collect", new Blob([body], { type: "application/json" }))) return
    void fetch("/api/collect", { method: "POST", body, keepalive: true, headers: { "content-type": "application/json" } }).catch(() => {})
  } catch {}
}

const FORM = /forms\.gle|docs\.google\.com\/forms/

let landed = false
let lastPath: string | null = null

/** 공개 페이지 방문 통계: 페이지뷰(화면 전환 포함), 신청·외부 링크 클릭, 영상 재생 */
export function Tracker() {
  const pathname = usePathname()

  useEffect(() => {
    // 같은 화면을 연달아 두 번 세지 않는다(개발 모드의 이중 실행 등)
    if (lastPath === pathname) return
    lastPath = pathname
    // 유입 경로는 사이트에 처음 들어온 순간에만 보낸다. 화면 전환이나 /2026에서 넘어온 경우는 사이트 안 이동이다.
    const first = !landed
    landed = true
    let internal = false
    try {
      internal = new URL(document.referrer).host === window.location.host
    } catch {}
    const entry = first && !internal
    track({
      kind: "view",
      path: pathname,
      entry,
      ref: entry ? document.referrer : "",
      src: entry ? new URLSearchParams(window.location.search).get("utm_source") ?? "" : "",
    })
  }, [pathname])

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = e.target instanceof Element ? e.target.closest<HTMLAnchorElement>("a[href]") : null
      if (!a) return
      let url: URL
      try {
        url = new URL(a.href, window.location.href)
      } catch {
        return
      }
      if (url.origin === window.location.origin) return
      const apply = FORM.test(url.href)
      track({
        kind: "event",
        name: apply ? "apply" : "outbound",
        label: a.dataset.track || url.hostname.replace(/^www\./, ""),
        path: window.location.pathname,
      })
    }
    const onCustom = (e: Event) => {
      const detail = (e as CustomEvent<{ name: string; label: string }>).detail
      if (detail?.name) track({ kind: "event", name: detail.name, label: detail.label, path: window.location.pathname })
    }
    document.addEventListener("click", onClick, { capture: true })
    window.addEventListener("wf:track", onCustom)
    return () => {
      document.removeEventListener("click", onClick, { capture: true })
      window.removeEventListener("wf:track", onCustom)
    }
  }, [])

  return null
}
