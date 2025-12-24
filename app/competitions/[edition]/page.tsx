import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { createServerClient } from "@/lib/supabase/server"
import { Calendar, MapPin, Trophy, Rocket } from "lucide-react"
import { notFound } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function CompetitionDetailPage({ params }: { params: Promise<{ edition: string }> }) {
  const { edition: editionStr } = await params
  const edition = Number.parseInt(editionStr)
  if (isNaN(edition)) {
    notFound()
  }

  const supabase = await createServerClient()

  const { data: competition } = await supabase
    .from("competitions")
    .select("*")
    .eq("edition", edition)
    .in("status", ["published", "ongoing", "completed"])
    .single()

  if (!competition) {
    notFound()
  }

  // 접수 가능 여부 체크
  const isRegistrationOpen =
    competition.status === "published" &&
    competition.registration_deadline &&
    new Date(competition.registration_deadline) > new Date()

  return (
    <div className="min-h-screen bg-background space-pattern">
      <Header />

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Badge className="mb-6 text-3xl px-12 py-4 bg-secondary/10 text-secondary border-secondary/30">
            🚀 제{competition.edition}회
          </Badge>
          <h1 className="text-6xl md:text-8xl font-bold mb-6 text-glow">
            <span className="text-secondary">우주</span> 최고
            <br />
            <span className="text-primary">실패</span> 대회
          </h1>
          {competition.description && (
            <p className="text-2xl md:text-3xl text-secondary font-semibold mb-8 max-w-3xl mx-auto leading-relaxed">
              {competition.description.split(".")[0]}
            </p>
          )}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {isRegistrationOpen && (
              <>
                <Button size="lg" className="text-lg px-8 py-4 neon-glow" asChild>
                  <a href="#apply">
                    <Rocket className="mr-2 h-5 w-5" />
                    지금 참가하기
                  </a>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="text-lg px-8 py-4 border-secondary text-secondary hover:bg-secondary/10 bg-transparent"
                  asChild
                >
                  <a href="#schedule">대회 일정 보기</a>
                </Button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* 영상 섹션 */}
      {competition.video_url && (
        <section className="py-20 px-4 bg-muted/20">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto">
              <Card className="p-4 bg-card/50 backdrop-blur-sm border-primary/20 neon-glow">
                <div className="aspect-video">
                  <iframe
                    src={competition.video_url}
                    className="w-full h-full rounded-lg"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* 대회 소개 섹션 */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <Card className="p-8 bg-card/50 backdrop-blur-sm border-primary/20 hover:neon-glow transition-all duration-300">
              <div className="mb-6">
                <Badge className="text-lg px-4 py-2 bg-primary/20 text-primary border-primary/30 mb-4">대회 소개</Badge>
                <h3 className="text-3xl font-bold mb-4 text-primary">실패, 결과가 아닌 질문으로 바꾸다</h3>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p className="text-lg">{competition.long_description || competition.description}</p>
              </div>
            </Card>

            {competition.philosophy && (
              <Card className="p-8 bg-card/50 backdrop-blur-sm border-secondary/20 hover:purple-glow transition-all duration-300">
                <div className="mb-6">
                  <Badge className="text-lg px-4 py-2 bg-secondary/20 text-secondary border-secondary/30 mb-4">
                    대회 철학과 목적
                  </Badge>
                  <h3 className="text-3xl font-bold mb-4 text-secondary">
                    실패는 개인의 몫처럼 보이지만,
                    <br />
                    사회가 함께 책임져야 할 감정
                  </h3>
                </div>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p className="text-lg">{competition.philosophy}</p>
                  {competition.purpose && <p className="text-lg">{competition.purpose}</p>}
                </div>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* 포스터 섹션 */}
      {competition.poster_image && (
        <section className="py-20 px-4 bg-muted/20">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-glow">
                대회 <span className="text-primary">포스터</span>
              </h2>
            </div>

            <div className="max-w-3xl mx-auto">
              <Card className="p-8 bg-card/50 backdrop-blur-sm border-primary/20 neon-glow">
                <img
                  src={competition.poster_image || "/placeholder.svg"}
                  alt={`제${competition.edition}회 우주 최고 실패 대회 포스터`}
                  className="w-full h-auto rounded-lg shadow-2xl"
                />
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* 일정 섹션 */}
      <section id="schedule" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-glow">
              대회 <span className="text-secondary">일정</span>
            </h2>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {competition.registration_deadline && (
                <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
                  <div className="flex items-center gap-4 mb-4">
                    <Calendar className="h-6 w-6 text-primary" />
                    <Badge className="bg-primary/20 text-primary">접수 마감</Badge>
                  </div>
                  <h3 className="text-xl font-bold mb-2">참가 신청 마감</h3>
                  <p className="text-muted-foreground">
                    {new Date(competition.registration_deadline).toLocaleDateString("ko-KR")}까지
                  </p>
                </Card>
              )}

              {competition.end_date && (
                <Card className="p-6 bg-card/50 backdrop-blur-sm border-secondary/20">
                  <div className="flex items-center gap-4 mb-4">
                    <Trophy className="h-6 w-6 text-secondary" />
                    <Badge className="bg-secondary/20 text-secondary">본선</Badge>
                  </div>
                  <h3 className="text-xl font-bold mb-2">본선 대회</h3>
                  <p className="text-muted-foreground mb-2">
                    {new Date(competition.end_date).toLocaleDateString("ko-KR")}
                  </p>
                  {competition.location && (
                    <div className="flex items-start gap-2 text-sm text-muted-foreground mt-3 bg-muted/30 p-3 rounded-lg">
                      <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <div className="font-semibold">{competition.location}</div>
                    </div>
                  )}
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 시상 섹션 */}
      {competition.prize_pool && (
        <section id="prizes" className="py-20 px-4 bg-muted/20">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-glow">
                <span className="text-primary">시상</span> 내역
              </h2>
              <p className="text-xl text-muted-foreground">실패들을 위한 특별한 보상이 기다립니다!</p>
            </div>

            <div className="max-w-4xl mx-auto">
              <Card className="p-8 bg-gradient-to-b from-primary/20 to-primary/5 border-primary/30 neon-glow">
                <div className="text-center">
                  <div className="text-6xl mb-4">🏆</div>
                  <h3 className="text-2xl font-bold mb-4 text-primary">수상 내역</h3>
                  <p className="text-lg text-muted-foreground">{competition.prize_pool}</p>
                </div>
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      {isRegistrationOpen && (
        <section id="apply" className="py-20 px-4">
          <div className="container mx-auto text-center">
            <Card className="p-12 bg-gradient-to-b from-primary/20 to-primary/5 border-primary/30 neon-glow max-w-3xl mx-auto">
              <h2 className="text-4xl font-bold mb-6 text-glow">
                지금 바로 <span className="text-primary">참가하세요!</span>
              </h2>
              <p className="text-xl text-muted-foreground mb-4">당신의 실패 경험을 공유하고 함께 성장하세요</p>
              <p className="text-sm text-muted-foreground mb-8">
                접수 마감: {new Date(competition.registration_deadline).toLocaleDateString("ko-KR")}
              </p>
              <Button size="lg" className="text-lg px-12 py-6 neon-glow" asChild>
                <Link href="/register">
                  <Rocket className="mr-2 h-6 w-6" />
                  참가 신청하기
                </Link>
              </Button>
            </Card>
          </div>
        </section>
      )}

      <Footer />
    </div>
  )
}
