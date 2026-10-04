import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: { default: "관리자", template: "%s · 관리자" },
  robots: { index: false, follow: false },
}

export const dynamic = "force-dynamic"

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-[#f6f1e4] text-ink">{children}</div>
}
