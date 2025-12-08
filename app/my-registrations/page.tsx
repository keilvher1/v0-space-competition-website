import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Rocket, ArrowLeft, Calendar, FileText } from "lucide-react"
import Link from "next/link"

const statusMap: Record<string, { label: string; color: string }> = {
  pending: { label: "검토 중", color: "bg-yellow-500/20 text-yellow-500 border-yellow-500/30" },
  approved: { label: "승인됨", color: "bg-green-500/20 text-green-500 border-green-500/30" },
  rejected: { label: "거절됨", color: "bg-red-500/20 text-red-500 border-red-500/30" },
  finalist: { label: "본선 진출", color: "bg-primary/20 text-primary border-primary/30" },
}

export default async function MyRegistrationsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login?redirect=/my-registrations")
  }

  const { data: registrations } = await supabase
    .from("registrations")
    .select(
      `
      *,
      competitions (
        title,
        start_date,
        end_date
      )
    `,
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-background space-pattern">
      <header className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Rocket className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-glow">제1회 우주 최고 실패 대회</span>
            </Link>
            <Button variant="ghost" asChild>
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                돌아가기
              </Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 text-glow">내 참가 신청</h1>
            <p className="text-muted-foreground">신청 내역과 상태를 확인하세요</p>
          </div>

          {registrations && registrations.length > 0 ? (
            <div className="space-y-6">
              {registrations.map((reg) => {
                const status = statusMap[reg.status] || statusMap.pending
                const track = reg.team_members?.track === "youth" ? "청소년 트랙" : "일반 트랙"

                return (
                  <Card key={reg.id} className="bg-card/50 backdrop-blur-sm border-primary/20">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-xl">{reg.team_name}</CardTitle>
                          <CardDescription>{reg.competitions?.title}</CardDescription>
                        </div>
                        <Badge className={status.color}>{status.label}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <FileText className="h-4 w-4" />
                          <span>트랙: {track}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>신청일: {new Date(reg.created_at).toLocaleDateString("ko-KR")}</span>
                        </div>
                      </div>
                      {reg.notes && (
                        <div className="mt-4 p-4 bg-muted/30 rounded-lg">
                          <p className="text-sm text-muted-foreground">{reg.notes}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          ) : (
            <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
              <CardContent className="py-12 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">아직 참가 신청이 없습니다</h3>
                <p className="text-muted-foreground mb-6">지금 바로 참가 신청을 해보세요!</p>
                <Button asChild className="neon-glow">
                  <Link href="/register">참가 신청하기</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
