import { Rocket } from "lucide-react"
import Link from "next/link"
import { UserNav } from "./user-nav"

export function Header() {
  return (
    <header className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Rocket className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-glow">우주 최고 실패 대회</span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link href="/competitions/1" className="text-muted-foreground hover:text-primary transition-colors">
              제1회 대회
            </Link>
            <Link href="/competitions" className="text-muted-foreground hover:text-primary transition-colors">
              대회 이력
            </Link>
            <Link href="/announcements" className="text-muted-foreground hover:text-primary transition-colors">
              공지사항
            </Link>
            <Link href="/faq" className="text-muted-foreground hover:text-primary transition-colors">
              FAQ
            </Link>
          </div>
          <UserNav />
        </nav>
      </div>
    </header>
  )
}
