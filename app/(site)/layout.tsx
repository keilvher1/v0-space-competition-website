import type React from "react"
import { Analytics } from "@vercel/analytics/next"
import { IntroSplash } from "@/components/site/intro-splash"
import { getCurrentEdition, getSiteSettings } from "@/lib/cms/queries"

// 공개 페이지 공통 레이아웃: 첫 방문 인트로(로딩)와 방문 통계를 붙인다. 관리자 화면(/admin)에는 적용되지 않는다.
export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [settings, edition] = await Promise.all([getSiteSettings(), getCurrentEdition()])
  return (
    <>
      {settings.intro.enabled && <IntroSplash tagline={settings.intro.tagline} keyColor={edition.keyColor} />}
      {children}
      <Analytics />
    </>
  )
}
