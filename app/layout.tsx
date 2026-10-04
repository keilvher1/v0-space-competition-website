import type React from "react"
import type { Metadata, Viewport } from "next"
import { Space_Grotesk } from "next/font/google"
import { getSiteSettings } from "@/lib/cms/queries"
import "pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css"
import "./globals.css"

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
})

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getSiteSettings()
  return {
    metadataBase: new URL("https://www.woojufail.org"),
    title: { default: seo.title, template: "%s — 우주최고실패대회" },
    description: seo.description,
    icons: { icon: "/icon.svg" },
    openGraph: {
      type: "website",
      locale: "ko_KR",
      siteName: "우주최고실패대회",
      title: seo.title,
      description: seo.description,
      images: seo.ogImage ? [{ url: seo.ogImage, width: 1200, height: 630 }] : undefined,
    },
  }
}

export const viewport: Viewport = {
  themeColor: "#052031",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    // 인트로를 이미 본 방문자는 하이드레이션 전에 인라인 스크립트가 wf-no-intro 클래스를 붙인다
    <html lang="ko" className={spaceGrotesk.variable} suppressHydrationWarning>
      <body>{children}</body>
    </html>
  )
}
