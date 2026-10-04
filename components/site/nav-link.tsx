"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

/** 헤더 메뉴 링크. 지금 보고 있는 페이지(/faq 등)는 aria-current로 표시한다. /#about 같은 앵커는 표시하지 않는다. */
export function NavLink({ href, className, children }: { href: string; className?: string; children: React.ReactNode }) {
  const pathname = usePathname()
  const current = !href.includes("#") && (pathname === href || pathname.startsWith(`${href}/`))
  return (
    <Link href={href} aria-current={current ? "page" : undefined} className={className}>
      {children}
    </Link>
  )
}
