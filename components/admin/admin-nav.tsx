"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { logoutAction } from "@/app/admin/actions"

const NAV = [
  { href: "/admin", label: "대시보드" },
  { href: "/admin/analytics", label: "방문 통계" },
  { href: "/admin/settings", label: "사이트 설정" },
  { href: "/admin/editions", label: "회차" },
  { href: "/admin/announcements", label: "공지사항" },
  { href: "/admin/faqs", label: "FAQ" },
  { href: "/admin/partners", label: "함께한 기관" },
  { href: "/admin/media", label: "미디어" },
  { href: "/admin/users", label: "관리자 계정" },
]

export function AdminNav({ name }: { name: string }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const isActive = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href))

  const links = (
    <ul className="grid gap-1">
      {NAV.map((item) => (
        <li key={item.href}>
          <Link
            href={item.href}
            onClick={() => setOpen(false)}
            aria-current={isActive(item.href) ? "page" : undefined}
            className={`block rounded-md px-3 py-2.5 text-[15px] font-bold transition ${
              isActive(item.href) ? "bg-cream text-ink" : "text-cream/80 hover:bg-cream/10 hover:text-cream"
            }`}
          >
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  )

  const footer = (
    <div className="grid gap-2 border-t border-cream/15 pt-4 text-sm">
      <p className="truncate px-3 text-cream/60">{name}</p>
      <a href="/" target="_blank" rel="noopener noreferrer" className="rounded-md px-3 py-2 font-bold text-cream/80 hover:bg-cream/10">
        사이트 보기 ↗
      </a>
      <form action={logoutAction}>
        <button type="submit" className="w-full rounded-md px-3 py-2 text-left font-bold text-cream/80 hover:bg-cream/10">
          로그아웃
        </button>
      </form>
    </div>
  )

  return (
    <>
      {/* 데스크톱 사이드바 */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col justify-between bg-ink p-4 text-cream md:flex">
        <div>
          <Link href="/admin" className="mb-6 flex items-center gap-2.5 px-2 py-2">
            <img src="/icon.svg" alt="" width={30} height={30} className="size-[30px]" />
            <span className="font-extrabold tracking-[-0.03em]">관리자</span>
          </Link>
          <nav aria-label="관리자 메뉴">{links}</nav>
        </div>
        {footer}
      </aside>

      {/* 모바일 상단 바 */}
      <header className="sticky top-0 z-40 flex items-center justify-between bg-ink px-4 py-3 text-cream md:hidden">
        <Link href="/admin" className="flex items-center gap-2">
          <img src="/icon.svg" alt="" width={28} height={28} className="size-7" />
          <span className="font-extrabold">관리자</span>
        </Link>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="admin-mobile-menu"
          className="rounded-md border border-cream/30 px-3 py-1.5 text-sm font-bold"
        >
          {open ? "닫기" : "메뉴"}
        </button>
      </header>
      {open && (
        <div id="admin-mobile-menu" className="fixed inset-x-0 top-[52px] bottom-0 z-40 overflow-y-auto bg-ink p-4 text-cream md:hidden">
          <nav aria-label="관리자 메뉴">{links}</nav>
          <div className="mt-6">{footer}</div>
        </div>
      )}
    </>
  )
}
