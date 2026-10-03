import type React from "react"
import type { Metadata, Viewport } from "next"
import { Space_Grotesk } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css"
import "./globals.css"

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
})

const description =
  "실패를 숨기지 않고 함께 듣고 응원하는 무대, 우주최고실패대회. 제2회 대회 안내와 역대 대회 기록을 한곳에서 확인하세요."

export const metadata: Metadata = {
  metadataBase: new URL("https://www.woojufail.org"),
  title: {
    default: "우주최고실패대회 — 실패해도 괜찮아",
    template: "%s — 우주최고실패대회",
  },
  description,
  icons: { icon: "/icon.svg" },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "우주최고실패대회",
    title: "우주최고실패대회 — 실패해도 괜찮아",
    description,
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "크림색 '실패' 레터링" }],
  },
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
    <html lang="ko" className={spaceGrotesk.variable}>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
