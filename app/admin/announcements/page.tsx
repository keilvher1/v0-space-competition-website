import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Rocket, ArrowLeft, Plus, Calendar, Pin, Pencil } from "lucide-react"
import Link from "next/link"

export default async function AdminAnnouncementsPage() {
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

  const { data: announcements } = await supabase
    .from("announcements")
    .select("*")
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <Link href="/admin" className="flex items-center gap-2">
              <Rocket className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">공지사항 관리</span>
            </Link>
            <div className="flex items-center gap-2">
              <Button asChild>
                <Link href="/admin/announcements/new">
                  <Plus className="mr-2 h-4 w-4" />새 공지
                </Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link href="/admin">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  대시보드
                </Link>
              </Button>
            </div>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">공지사항 목록</h1>
          <p className="text-muted-foreground">총 {announcements?.length || 0}건의 공지</p>
        </div>

        {announcements && announcements.length > 0 ? (
          <div className="space-y-4">
            {announcements.map((announcement) => (
              <Card key={announcement.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        {announcement.is_featured && (
                          <Badge className="bg-primary/20 text-primary border-primary/30">
                            <Pin className="h-3 w-3 mr-1" />
                            중요
                          </Badge>
                        )}
                        <Badge variant={announcement.is_published ? "default" : "secondary"}>
                          {announcement.is_published ? "게시됨" : "비공개"}
                        </Badge>
                      </div>
                      <CardTitle>{announcement.title}</CardTitle>
                      <CardDescription className="mt-1">{announcement.excerpt}</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/announcements/${announcement.id}/edit`}>
                        <Pencil className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(announcement.created_at).toLocaleDateString("ko-KR")}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">아직 공지사항이 없습니다</p>
              <Button asChild>
                <Link href="/admin/announcements/new">
                  <Plus className="mr-2 h-4 w-4" />첫 공지 작성하기
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
