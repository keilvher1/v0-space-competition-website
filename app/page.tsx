import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Rocket, Star, Trophy, Users, Calendar, ArrowRight } from "lucide-react"
import { UserNav } from "@/components/user-nav"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"

export default async function HomePage() {
  const supabase = await createClient()

  // 모든 대회 회차 가져오기 (최신순)
  const { data: competitions } = await supabase.from("competitions").select("*").order("edition", { ascending: false })

  // 현재 진행 중인 대회 (가장 최신)
  const currentCompetition = competitions?.find((c) => c.status === "ongoing") || competitions?.[0]

  // 이전 대회들
  const pastCompetitions = competitions?.filter((c) => c.id !== currentCompetition?.id) || []

  return (
    <div className="min-h-screen bg-background space-pattern">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Rocket className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-glow">우주 최고 실패 대회</span>
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <a href="#about" className="text-muted-foreground hover:text-primary transition-colors">
                대회 소개
              </a>
              <a href="#editions" className="text-muted-foreground hover:text-primary transition-colors">
                역대 대회
              </a>
              <Link href="/announcements" className="text-muted-foreground hover:text-primary transition-colors">
                공지사항
              </Link>
              <Link href="/faq" className="text-muted-foreground hover:text-primary transition-colors">
                FAQ
              </Link>
            </div>
            <UserNav />
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Badge className="mb-6 text-xl px-8 py-3 bg-secondary/10 text-secondary border-secondary/30">
            🚀 실패를 축하하는 대회
          </Badge>
          <h1 className="text-6xl md:text-8xl font-bold mb-6 text-glow">
            <span className="text-secondary">우주</span> 최고
            <br />
            <span className="text-primary">실패</span> 대회
          </h1>
          <p className="text-2xl md:text-3xl text-secondary font-semibold mb-8 max-w-3xl mx-auto leading-relaxed">
            실패, 결과가 아닌 질문으로 바꾸다
          </p>

          {/* 현재 진행 중인 대회 안내 */}
          {currentCompetition && (
            <div className="mb-8">
              <Badge className="text-lg px-6 py-2 bg-primary/20 text-primary border-primary/30 mb-4">
                {currentCompetition.status === "ongoing" ? "🔥 현재 모집 중" : "📅 예정된 대회"}
              </Badge>
              <p className="text-xl text-muted-foreground mb-4">
                2회 대회가{" "}
                {currentCompetition.status === "ongoing" ? "진행 중입니다!" : "예정되어있습니다."}
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {currentCompetition && (
              <Button size="lg" className="text-lg px-8 py-4 neon-glow" asChild>
                <Link href={`/competitions/${currentCompetition.slug || currentCompetition.edition}`}>
                  <Rocket className="mr-2 h-5 w-5" />제{currentCompetition.edition}회 대회 보기
                </Link>
              </Button>
            )}
            <Button
              variant="outline"
              size="lg"
              className="text-lg px-8 py-4 border-secondary text-secondary hover:bg-secondary/10 bg-transparent"
              asChild
            >
              <a href="#editions">역대 대회 보기</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-20 px-4 bg-muted/20">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-glow">
              대회 <span className="text-primary">영상</span>
            </h2>
            <p className="text-xl text-muted-foreground">제1회 우주 최고 실패 대회를 영상으로 만나보세요</p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Card className="p-8 bg-card/50 backdrop-blur-sm border-primary/20 neon-glow">
              <div className="relative w-full" style={{ paddingBottom: "177.78%" }}>
                <iframe
                  className="absolute top-0 left-0 w-full h-full rounded-lg"
                  src="https://player.vimeo.com/video/1123631620?title=0&byline=0&portrait=0&badge=0"
                  title="제1회 우주 최고 실패 대회 영상"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-glow">
              <span className="text-primary">우주 최고 실패 대회</span>란?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <Card className="p-8 bg-card/50 backdrop-blur-sm border-primary/20 hover:neon-glow transition-all duration-300">
              <div className="mb-6">
                <Badge className="text-lg px-4 py-2 bg-primary/20 text-primary border-primary/30 mb-4">대회 소개</Badge>
                <h3 className="text-3xl font-bold mb-4 text-primary">
                  실패, 결과가 아닌
                  <br />
                  질문으로 바꾸다
                </h3>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p className="text-lg">
                  우주 최고 실패 대회는{" "}
                  <span className="font-semibold text-foreground">
                    "단순히 실패를 극복하고 결국 희망과 웃음으로 마무리하는 자리"가 아닙니다.
                  </span>
                </p>
                <p className="text-lg">
                  포항 지역 최초의 실패 독려 프로젝트로서, 실패를 개인의 낙인으로 치부하지 않고 사회가 함께 격려하고
                  축하하는 축제의 장을 마련하고자 합니다.
                </p>
              </div>
            </Card>

            <Card className="p-8 bg-card/50 backdrop-blur-sm border-secondary/20 hover:purple-glow transition-all duration-300">
              <div className="mb-6">
                <Badge className="text-lg px-4 py-2 bg-secondary/20 text-secondary border-secondary/30 mb-4">
                  대회 철학
                </Badge>
                <h3 className="text-3xl font-bold mb-4 text-secondary">
                  실패는 사회가 함께
                  <br />
                  책임져야 할 감정
                </h3>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p className="text-lg">
                  만약 실패를 공유할 수 있는 언어와 공간이 없다면 실패는 그저 실패로 끝날 수밖에 없습니다.
                </p>
                <p className="text-lg">
                  <span className="font-semibold text-foreground">
                    실패를 나누고 교류하는 과정에서 실패를 조금씩 익숙하게 받아들이고, 이로써 실패는 실패 이후로
                    나아가게 됩니다.
                  </span>
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-glow">
              왜 <span className="text-primary">실패</span>를 자랑해야 할까요?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20 hover:neon-glow transition-all duration-300">
              <Star className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-3">진솔한 실패</h3>
              <p className="text-muted-foreground">
                가장 솔직하고 진실한 실패 경험을 공유하세요. 있는 그대로의 경험이 가장 소중한 배움이 됩니다.
              </p>
            </Card>

            <Card className="p-6 bg-card/50 backdrop-blur-sm border-secondary/20 hover:purple-glow transition-all duration-300">
              <Trophy className="h-12 w-12 text-secondary mb-4" />
              <h3 className="text-xl font-bold mb-3">교훈적 가치</h3>
              <p className="text-muted-foreground">
                실패에서 얻은 깊이 있는 통찰과 교훈을 다른 사람들과 나누며 함께 성장하세요.
              </p>
            </Card>

            <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20 hover:neon-glow transition-all duration-300">
              <Users className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-3">커뮤니티</h3>
              <p className="text-muted-foreground">
                실패를 통해 배우고 성장하는 사람들의 커뮤니티에 참여하여 네트워킹하세요.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Editions Section - 역대 대회 */}
      <section id="editions" className="py-20 px-4 bg-muted/20">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-glow">
              역대 <span className="text-secondary">대회</span>
            </h2>
            <p className="text-xl text-muted-foreground">우주 최고 실패 대회의 역사를 만나보세요</p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {/* 현재/최신 대회 */}
            {currentCompetition && (
              <Link href={`/competitions/${currentCompetition.slug || currentCompetition.edition}`}>
                <Card className="p-8 bg-gradient-to-r from-primary/20 to-secondary/20 border-primary/30 hover:neon-glow transition-all duration-300 cursor-pointer">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <Badge className="bg-primary text-primary-foreground">
                          {currentCompetition.status === "ongoing"
                            ? "모집 중"
                            : currentCompetition.status === "completed"
                              ? "종료"
                              : "예정"}
                        </Badge>
                        <Badge variant="outline" className="border-secondary text-secondary">
                          제{currentCompetition.edition}회
                        </Badge>
                      </div>
                      <h3 className="text-2xl font-bold mb-2">{currentCompetition.title}</h3>
                      <p className="text-muted-foreground">{currentCompetition.description}</p>
                      {currentCompetition.start_date && (
                        <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(currentCompetition.start_date).toLocaleDateString("ko-KR")}</span>
                        </div>
                      )}
                    </div>
                    <Button className="neon-glow shrink-0">
                      자세히 보기
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              </Link>
            )}

            {/* 이전 대회들 */}
            {pastCompetitions.map((competition) => (
              <Link key={competition.id} href={`/competitions/${competition.slug || competition.edition}`}>
                <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all duration-300 cursor-pointer">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <Badge variant="outline" className="text-muted-foreground">
                          {competition.status === "completed" ? "종료" : competition.status}
                        </Badge>
                        <Badge variant="outline">제{competition.edition}회</Badge>
                      </div>
                      <h3 className="text-xl font-bold mb-1">{competition.title}</h3>
                      <p className="text-sm text-muted-foreground">{competition.description}</p>
                    </div>
                    <Button variant="outline" className="shrink-0 bg-transparent">
                      아카이브 보기
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              </Link>
            ))}

            {/* 대회가 없는 경우 */}
            {(!competitions || competitions.length === 0) && (
              <Card className="p-8 bg-card/50 backdrop-blur-sm border-primary/20 text-center">
                <Rocket className="h-16 w-16 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">첫 번째 대회를 준비 중입니다!</h3>
                <p className="text-muted-foreground">곧 우주 최고 실패 대회가 시작됩니다. 기대해주세요!</p>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* President Recommendation Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-secondary/10 to-primary/10">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-glow">
              한동대학교 총장 <span className="text-primary">추천사</span>
            </h2>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="p-10 bg-card/50 backdrop-blur-sm border-secondary/20 purple-glow">
              <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                <p>
                  인생을 살아가면서 겪는 실패의 고난은 신비입니다. 성경에서 예수님은 자신을 하나님 아버지께로 가는
                  유일한 길이라고 선언하셨습니다(요14:6). 예수 그리스도는 십자가의 고난에서 부활의 영광으로의 길을
                  걸어가셨습니다(눅24:26). 예수님을 따르는 모든 사람들은 이 동선을 벗어날 수 없습니다. 이는 우리가
                  인생에서 이루는 모든 성취는 그 성취의 높이 만큼의 실패의 깊이라는 댓가를 기반으로 이루어진다는 것을
                  의미합니다. 이 고난에서만 만날 수 있는 예수 그리스도가 있습니다. 죽음을 맛보지 못한 인생이 어떻게
                  부활을 알 수 있을까요?
                </p>
                <p>
                  심규진 교수님이 기획한 '우주 최고 실패 대회'를 통해서 집필한 「우주실패실록」은 이러한 인생의 길을
                  생생한 체험으로 우리에게 들려줍니다. 하나님께서 창조하신 모든 인생에는 선한 계획하심이 있습니다. 이
                  계획하심을 이루기 위해서는 실패를 두려워하지 않는 용기가 필요합니다. 이 도전을 통하여 자신의 한계를
                  알게되고 또한 하나님의 기이한 인도하심을 경험하고 자신이 할 수 없는 성취를 이루게 됩니다. 예수
                  그리스도 안에서는 실패한 인생은 없습니다. 이 책을 통해 여러분들의 실패와 성공의 체험이 예수
                  그리스도를 더욱 알아가는 복된 인생으로 인도해 주길 기도 드립니다.
                </p>
                <div className="text-right mt-8 pt-6 border-t border-border/30">
                  <p className="text-xl font-semibold text-foreground">2026년 2월 8일</p>
                  <p className="text-xl font-semibold text-secondary mt-2">한동대학교 총장 박성진</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Book Promotion Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Badge className="text-xl px-8 py-3 bg-primary/20 text-primary border-primary/30 mb-4">
              📚 3월 1일 정식 출간
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-glow">
              우주<span className="text-primary">실패</span>실록
            </h2>
            <p className="text-xl text-muted-foreground">제1회 우주 최고 실패 대회의 생생한 이야기를 담은 책</p>
          </div>

          <div className="max-w-5xl mx-auto">
            <Card className="p-8 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20 neon-glow">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="order-2 md:order-1">
                  <img
                    src="/images/book-cover.png"
                    alt="우주실패실록 책 표지"
                    className="w-full max-w-md mx-auto rounded-lg shadow-2xl"
                  />
                </div>
                <div className="order-1 md:order-2 space-y-4">
                  <h3 className="text-3xl font-bold text-primary mb-4">우주실패실록</h3>
                  <div className="space-y-3 text-muted-foreground">
                    <p className="text-lg">
                      제1회 우주 최고 실패 대회에서 나온 진솔하고 감동적인 실패 이야기들을 엮은 책입니다.
                    </p>
                    <p className="text-lg">
                      참가자들의 생생한 경험과 깊이 있는 성찰을 통해 실패의 진정한 의미를 발견하세요.
                    </p>
                    <div className="pt-4">
                      <Badge className="text-lg px-6 py-2 bg-primary text-primary-foreground mb-3">
                        2026년 3월 1일 출간
                      </Badge>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p className="flex items-center gap-2">
                        <span className="font-semibold">저자:</span>
                        <span>김가은, 김누아, 박경승, 김민선, 서경훈, 심규진</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="font-semibold">출판사:</span>
                        <span>학영원</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-glow">
            당신의 실패 스토리를
            <br />
            <span className="text-primary">우주에 알려주세요!</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            실패를 축하하는 축제에 참여하고, 당신만의 이야기를 공유하세요!
          </p>
          {currentCompetition && currentCompetition.status === "ongoing" && (
            <Button size="lg" className="text-xl px-12 py-6 neon-glow" asChild>
              <Link href={`/competitions/${currentCompetition.slug || currentCompetition.edition}`}>
                <Rocket className="mr-2 h-6 w-6" />제{currentCompetition.edition}회 대회 참가하기
              </Link>
            </Button>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border/50">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <Rocket className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold">우주 최고 실패 대회</span>
            </div>
            <div className="flex flex-wrap justify-center gap-8">
              <div className="flex items-center gap-2">
                <img src="/images/moe-logo.png" alt="교육부" className="h-10 object-contain" />
              </div>
              <div className="flex items-center gap-2">
                <img src="/images/pohang-logo.jpeg" alt="포항시" className="h-10 object-contain" />
              </div>
              <div className="flex items-center gap-2">
                <img src="/images/hgu-logo.png" alt="한동대학교" className="h-10 object-contain" />
              </div>
              <div className="flex items-center gap-2">
                <img src="/images/parangteul-logo.png" alt="파랑뜰" className="h-10 object-contain" />
              </div>
            </div>
            <div className="text-sm text-muted-foreground">© 2025 우주 최고 실패 대회. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
