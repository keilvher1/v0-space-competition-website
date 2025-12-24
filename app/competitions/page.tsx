import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { createServerClient } from "@/lib/supabase/server"
import { Calendar, MapPin, Trophy, Users } from "lucide-react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export const dynamic = "force-dynamic"

export default async function CompetitionsPage() {
  const supabase = await createServerClient()

  const { data: competitions } = await supabase
    .from("competitions")
    .select("*")
    .in("status", ["published", "ongoing", "completed"])
    .order("edition", { ascending: false })

  return (
    <div className="min-h-screen bg-background space-pattern">
      <Header />

      <main className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-glow">
            <span className="text-primary">대회</span> 이력
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            역대 우주 최고 실패 대회의 모든 기록을 확인하세요
          </p>
        </div>

        <div className="max-w-5xl mx-auto space-y-8">
          {competitions && competitions.length > 0 ? (
            competitions.map((competition) => (
              <Card
                key={competition.id}
                className="p-8 bg-card/50 backdrop-blur-sm border-primary/20 hover:neon-glow transition-all duration-300"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* 포스터 */}
                  <div className="md:col-span-1">
                    {competition.poster_image ? (
                      <img
                        src={competition.poster_image || "/placeholder.svg"}
                        alt={`제${competition.edition}회 포스터`}
                        className="w-full h-auto rounded-lg shadow-lg"
                      />
                    ) : (
                      <div className="w-full aspect-[3/4] bg-muted/20 rounded-lg flex items-center justify-center">
                        <Trophy className="h-16 w-16 text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  {/* 대회 정보 */}
                  <div className="md:col-span-2 space-y-4">
                    <div>
                      <Badge className="mb-3 text-lg px-4 py-1 bg-secondary/20 text-secondary border-secondary/30">
                        제{competition.edition}회
                      </Badge>
                      <h2 className="text-3xl font-bold mb-2 text-glow">{competition.title}</h2>
                    </div>

                    {competition.description && (
                      <p className="text-muted-foreground leading-relaxed line-clamp-3">{competition.description}</p>
                    )}

                    <div className="space-y-2 text-sm">
                      {competition.end_date && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>본선: {new Date(competition.end_date).toLocaleDateString("ko-KR")}</span>
                        </div>
                      )}
                      {competition.location && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span>{competition.location}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Trophy className="h-4 w-4" />
                        <span>
                          상태:{" "}
                          {competition.status === "published"
                            ? "예정"
                            : competition.status === "ongoing"
                              ? "진행중"
                              : "완료"}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button asChild className="neon-glow">
                        <Link href={`/competitions/${competition.edition}`}>자세히 보기</Link>
                      </Button>
                      {competition.status === "published" &&
                        competition.registration_deadline &&
                        new Date(competition.registration_deadline) > new Date() && (
                          <Button
                            variant="outline"
                            asChild
                            className="border-secondary text-secondary hover:bg-secondary/10 bg-transparent"
                          >
                            <Link href={`/competitions/${competition.edition}#apply`}>지금 참가하기</Link>
                          </Button>
                        )}
                    </div>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <Card className="p-12 text-center bg-card/50 backdrop-blur-sm">
              <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-xl text-muted-foreground">아직 등록된 대회가 없습니다.</p>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
