import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Rocket, ArrowLeft, Plus, Pencil } from "lucide-react"
import Link from "next/link"

export default async function AdminFAQPage() {
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

  const { data: faqs } = await supabase.from("faqs").select("*").order("sort_order", { ascending: true })

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <Link href="/admin" className="flex items-center gap-2">
              <Rocket className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">FAQ 관리</span>
            </Link>
            <div className="flex items-center gap-2">
              <Button asChild>
                <Link href="/admin/faq/new">
                  <Plus className="mr-2 h-4 w-4" />새 FAQ
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
          <h1 className="text-3xl font-bold mb-2">FAQ 목록</h1>
          <p className="text-muted-foreground">총 {faqs?.length || 0}개의 FAQ</p>
        </div>

        {faqs && faqs.length > 0 ? (
          <div className="space-y-4">
            {faqs.map((faq) => (
              <Card key={faq.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">{faq.category || "일반"}</Badge>
                        <Badge variant={faq.is_published ? "default" : "secondary"}>
                          {faq.is_published ? "게시됨" : "비공개"}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg">{faq.question}</CardTitle>
                      <CardDescription className="mt-2 line-clamp-2">{faq.answer}</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/faq/${faq.id}/edit`}>
                        <Pencil className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">아직 FAQ가 없습니다</p>
              <Button asChild>
                <Link href="/admin/faq/new">
                  <Plus className="mr-2 h-4 w-4" />첫 FAQ 추가하기
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
