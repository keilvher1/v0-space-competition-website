import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Rocket, ArrowLeft, Calendar, User } from "lucide-react"
import Link from "next/link"
import { RegistrationActions } from "./registration-actions"

const statusMap: Record<string, { label: string; color: string }> = {
  pending: { label: "검토 중", color: "bg-yellow-500/20 text-yellow-500 border-yellow-500/30" },
  approved: { label: "승인됨", color: "bg-green-500/20 text-green-500 border-green-500/30" },
  rejected: { label: "거절됨", color: "bg-red-500/20 text-red-500 border-red-500/30" },
  finalist: { label: "본선 진출", color: "bg-primary/20 text-primary border-primary/30" },
}

export default async function AdminRegistrationsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

  if (profile?.role !== "admin") {
    redirect("/")
  }

  const { data: registrations } = await supabase
    .from("registrations")
    .select(
      `
      *,
      profiles (full_name, email),
      competitions (title)
    `,
    )
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <Link href="/admin" className="flex items-center gap-2">
              <Rocket className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">참가 신청 관리</span>
            </Link>
            <Button variant="ghost" asChild>
              <Link href="/admin">
                <ArrowLeft className="mr-2 h-4 w-4" />
                대시보드
              </Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">참가 신청 목록</h1>
          <p className="text-muted-foreground">총 {registrations?.length || 0}건의 신청</p>
        </div>

        {registrations && registrations.length > 0 ? (
          <div className="space-y-4">
            {registrations.map((reg) => {
              const status = statusMap[reg.status] || statusMap.pending
              const track = reg.team_members?.track === "youth" ? "청소년 트랙" : "일반 트랙"

              return (
                <Card key={reg.id}>
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
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <User className="h-4 w-4" />
                        <span>{reg.profiles?.full_name || reg.profiles?.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <span>트랙: {track}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(reg.created_at).toLocaleDateString("ko-KR")}</span>
                      </div>
                    </div>
                    {reg.notes && (
                      <div className="p-4 bg-muted/30 rounded-lg mb-4">
                        <p className="text-sm text-muted-foreground">{reg.notes}</p>
                      </div>
                    )}
                    <RegistrationActions registrationId={reg.id} currentStatus={reg.status} />
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">아직 참가 신청이 없습니다</p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
