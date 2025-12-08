import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Rocket, ArrowLeft, Calendar, Pin } from "lucide-react"
import Link from "next/link"

export default async function AnnouncementsPage() {
  const supabase = await createClient()

  const { data: announcements } = await supabase
    .from("announcements")
    .select("*")
    .eq("is_published", true)
    .order("is_featured", { ascending: false })
    .order("published_at", { ascending: false })

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
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 text-glow">공지사항</h1>
            <p className="text-muted-foreground">대회 관련 최신 소식을 확인하세요</p>
          </div>

          {announcements && announcements.length > 0 ? (
            <div className="space-y-6">
              {announcements.map((announcement) => (
                <Link key={announcement.id} href={`/announcements/${announcement.id}`}>
                  <Card
                    className={`bg-card/50 backdrop-blur-sm transition-all duration-300 cursor-pointer ${
                      announcement.is_featured
                        ? "border-primary/40 hover:neon-glow"
                        : "border-border/50 hover:border-primary/20"
                    }`}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {announcement.is_featured && (
                              <Badge className="bg-primary/20 text-primary border-primary/30">
                                <Pin className="h-3 w-3 mr-1" />
                                중요
                              </Badge>
                            )}
                          </div>
                          <CardTitle className="text-xl hover:text-primary transition-colors">
                            {announcement.title}
                          </CardTitle>
                          <CardDescription className="mt-2">{announcement.excerpt}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {announcement.published_at
                            ? new Date(announcement.published_at).toLocaleDateString("ko-KR", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })
                            : new Date(announcement.created_at).toLocaleDateString("ko-KR", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
              <CardContent className="py-12 text-center">
                <h3 className="text-xl font-semibold mb-2">아직 공지사항이 없습니다</h3>
                <p className="text-muted-foreground">새로운 소식이 올라오면 여기에 표시됩니다.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
