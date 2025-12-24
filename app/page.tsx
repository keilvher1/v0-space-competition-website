import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Rocket, Trophy, ArrowRight, Star, Users } from "lucide-react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { createServerClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

export default async function HomePage() {
  const supabase = await createServerClient()

  // 모든 대회 목록
  const { data: competitions } = await supabase
    .from("competitions")
    .select("*")
    .in("status", ["published", "ongoing", "completed"])
    .order("edition", { ascending: false })

  return (
    <div className="min-h-screen bg-background space-pattern">
      <Header />

      {/* Hero Section */}
      <section className="py-24 px-4">
        <div className="container mx-auto text-center">
          <Badge className="mb-6 text-xl px-8 py-3 bg-secondary/10 text-secondary border-secondary/30">
            🚀 우주 최고 실패 대회
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-glow">
            <span className="text-secondary">실패</span>를 축하하는
            <br />
            <span className="text-primary">유일한</span> 대회
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
            실패를 개인의 낙인이 아닌, 사회가 함께 격려하고 축하하는 축제의 장
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="text-lg px-8 py-6 neon-glow" asChild>
              <Link href="/competitions/1">
                <Rocket className="mr-2 h-5 w-5" />
                제1회 대회 보기
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="text-lg px-8 py-6 border-secondary text-secondary hover:bg-secondary/10 bg-transparent"
              asChild
            >
              <Link href="/competitions">
                전체 대회 이력 <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 대회 철학 */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-glow">
              왜 <span className="text-primary">실패</span>를 축하할까요?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="p-8 bg-card/50 backdrop-blur-sm border-primary/20 hover:neon-glow transition-all duration-300">
              <Star className="h-12 w-12 text-primary mb-6" />
              <h3 className="text-2xl font-bold mb-4">진솔한 공유</h3>
              <p className="text-muted-foreground leading-relaxed">
                성공담이 아닌 있는 그대로의 실패 경험을 나누며 서로의 이야기에 공감합니다.
              </p>
            </Card>

            <Card className="p-8 bg-card/50 backdrop-blur-sm border-secondary/20 hover:purple-glow transition-all duration-300">
              <Users className="h-12 w-12 text-secondary mb-6" />
              <h3 className="text-2xl font-bold mb-4">함께 책임지는 감정</h3>
              <p className="text-muted-foreground leading-relaxed">
                실패는 개인의 낙인이 아닌, 사회가 함께 격려하고 축하해야 할 경험입니다.
              </p>
            </Card>

            <Card className="p-8 bg-card/50 backdrop-blur-sm border-primary/20 hover:neon-glow transition-all duration-300">
              <Trophy className="h-12 w-12 text-primary mb-6" />
              <h3 className="text-2xl font-bold mb-4">실패 이후로</h3>
              <p className="text-muted-foreground leading-relaxed">
                실패를 나누고 교류하는 과정에서 실패는 끝이 아닌 새로운 시작이 됩니다.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* 역대 대회 목록 */}
      <section className="py-20 px-4 bg-muted/20">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-glow">
              <span className="text-secondary">역대</span> 대회
            </h2>
            <p className="text-xl text-muted-foreground">우주 최고 실패 대회의 모든 기록</p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {competitions && competitions.length > 0 ? (
              competitions.map((competition) => (
                <Link key={competition.id} href={`/competitions/${competition.edition}`}>
                  <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20 hover:neon-glow transition-all duration-300 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        <Badge className="text-xl px-6 py-2 bg-secondary/20 text-secondary border-secondary/30">
                          제{competition.edition}회
                        </Badge>
                        <div>
                          <h3 className="text-xl font-bold">{competition.title}</h3>
                          {competition.end_date && (
                            <p className="text-muted-foreground">
                              {new Date(competition.end_date).toLocaleDateString("ko-KR")}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge
                          className={
                            competition.status === "completed"
                              ? "bg-muted text-muted-foreground"
                              : competition.status === "ongoing"
                                ? "bg-primary/20 text-primary"
                                : "bg-secondary/20 text-secondary"
                          }
                        >
                          {competition.status === "completed"
                            ? "종료"
                            : competition.status === "ongoing"
                              ? "진행중"
                              : "예정"}
                        </Badge>
                        <ArrowRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </div>
                  </Card>
                </Link>
              ))
            ) : (
              <>
                <Link href="/competitions/1">
                  <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20 hover:neon-glow transition-all duration-300 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        <Badge className="text-xl px-6 py-2 bg-secondary/20 text-secondary border-secondary/30">
                          제1회
                        </Badge>
                        <div>
                          <h3 className="text-xl font-bold">제1회 우주 최고 실패 대회</h3>
                          <p className="text-muted-foreground">2025년 11월 8일</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge className="bg-muted text-muted-foreground">종료</Badge>
                        <ArrowRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </div>
                  </Card>
                </Link>
              </>
            )}
          </div>

          <div className="text-center mt-12">
            <Button
              variant="outline"
              size="lg"
              className="text-lg px-8 py-6 border-primary text-primary hover:bg-primary/10 bg-transparent"
              asChild
            >
              <Link href="/competitions">
                전체 대회 이력 보기 <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Card className="p-12 bg-gradient-to-b from-primary/20 to-primary/5 border-primary/30 neon-glow max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold mb-6 text-glow">
              당신의 <span className="text-primary">실패</span>를 들려주세요
            </h2>
            <p className="text-xl text-muted-foreground mb-8">당신의 실패가 누군가에게 용기가 됩니다</p>
            <Button size="lg" className="text-lg px-12 py-6 neon-glow" asChild>
              <Link href="/competitions/1">
                <Rocket className="mr-2 h-6 w-6" />
                제1회 대회 보기
              </Link>
            </Button>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  )
}
