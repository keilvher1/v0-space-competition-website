import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Rocket, Users, FileText, MessageSquare, HelpCircle, Settings } from "lucide-react"
import Link from "next/link"

export default async function AdminDashboard() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // 관리자 권한 확인
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

  if (profile?.role !== "admin") {
    redirect("/")
  }

  // 통계 데이터 가져오기
  const [{ count: registrationCount }, { count: announcementCount }, { count: faqCount }, { count: contactCount }] =
    await Promise.all([
      supabase.from("registrations").select("*", { count: "exact", head: true }),
      supabase.from("announcements").select("*", { count: "exact", head: true }),
      supabase.from("faqs").select("*", { count: "exact", head: true }),
      supabase.from("contact_submissions").select("*", { count: "exact", head: true }).eq("status", "pending"),
    ])

  // 최근 신청 현황
  const { data: recentRegistrations } = await supabase
    .from("registrations")
    .select(
      `
      *,
      profiles (full_name, email)
    `,
    )
    .order("created_at", { ascending: false })
    .limit(5)

  const stats = [
    {
      title: "총 참가 신청",
      value: registrationCount || 0,
      icon: Users,
      href: "/admin/registrations",
      color: "text-primary",
    },
    {
      title: "공지사항",
      value: announcementCount || 0,
      icon: MessageSquare,
      href: "/admin/announcements",
      color: "text-secondary",
    },
    { title: "FAQ", value: faqCount || 0, icon: HelpCircle, href: "/admin/faq", color: "text-primary" },
    {
      title: "미처리 문의",
      value: contactCount || 0,
      icon: FileText,
      href: "/admin/contacts",
      color: "text-yellow-500",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Rocket className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">관리자 대시보드</span>
            </Link>
            <div className="flex items-center gap-4">
              <Button variant="outline" asChild>
                <Link href="/">사이트 보기</Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link href="/admin/settings">
                  <Settings className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">대시보드</h1>
          <p className="text-muted-foreground">대회 관리 현황을 한눈에 확인하세요</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <Link key={stat.title} href={stat.href}>
              <Card className="hover:border-primary/50 transition-colors cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>빠른 작업</CardTitle>
              <CardDescription>자주 사용하는 관리 기능</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <Button asChild>
                <Link href="/admin/announcements/new">새 공지 작성</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/admin/faq/new">FAQ 추가</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/admin/registrations">신청 관리</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/admin/competitions">대회 설정</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>최근 참가 신청</CardTitle>
              <CardDescription>최근 5건의 신청 내역</CardDescription>
            </CardHeader>
            <CardContent>
              {recentRegistrations && recentRegistrations.length > 0 ? (
                <div className="space-y-4">
                  {recentRegistrations.map((reg) => (
                    <div key={reg.id} className="flex items-center justify-between border-b border-border/50 pb-2">
                      <div>
                        <p className="font-medium">{reg.team_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {reg.profiles?.full_name || reg.profiles?.email}
                        </p>
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          reg.status === "approved"
                            ? "bg-green-500/20 text-green-500"
                            : reg.status === "rejected"
                              ? "bg-red-500/20 text-red-500"
                              : "bg-yellow-500/20 text-yellow-500"
                        }`}
                      >
                        {reg.status === "approved" ? "승인" : reg.status === "rejected" ? "거절" : "검토중"}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">아직 신청 내역이 없습니다</p>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
