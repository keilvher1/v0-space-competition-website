import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Rocket, ArrowLeft, Calendar, Pin } from "lucide-react"
import Link from "next/link"

export default async function AnnouncementDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: announcement } = await supabase
    .from("announcements")
    .select("*")
    .eq("id", id)
    .eq("is_published", true)
    .single()

  if (!announcement) {
    notFound()
  }

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
              <Link href="/announcements">
                <ArrowLeft className="mr-2 h-4 w-4" />
                목록으로
              </Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
            <CardHeader>
              <div className="flex items-center gap-2 mb-4">
                {announcement.is_featured && (
                  <Badge className="bg-primary/20 text-primary border-primary/30">
                    <Pin className="h-3 w-3 mr-1" />
                    중요
                  </Badge>
                )}
              </div>
              <CardTitle className="text-3xl">{announcement.title}</CardTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-4">
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
            </CardHeader>
            <CardContent>
              <div className="prose prose-invert max-w-none">
                <div
                  className="text-foreground leading-relaxed whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{ __html: announcement.content }}
                />
              </div>
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <Button variant="outline" asChild>
              <Link href="/announcements">
                <ArrowLeft className="mr-2 h-4 w-4" />
                목록으로 돌아가기
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
