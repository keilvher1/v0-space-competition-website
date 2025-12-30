import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Rocket, Star, Trophy, Users, Calendar, MapPin, Mail, ArrowLeft, MessageCircle, HelpCircle } from "lucide-react"
import { UserNav } from "@/components/user-nav"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function CompetitionPage({ params }: PageProps) {
  const { slug } = await params
  const supabase = await createClient()

  // slug 또는 edition으로 대회 찾기
  const { data: competition } = await supabase
    .from("competitions")
    .select("*")
    .or(`slug.eq.${slug},edition.eq.${slug}`)
    .single()

  if (!competition) {
    notFound()
  }

  const REGISTRATION_LINK = "https://forms.gle/EEJ1ijFPnHHQHYhL9"
  const isOpen = competition.status === "open"

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
              <a href="#schedule" className="text-muted-foreground hover:text-primary transition-colors">
                일정
              </a>
              <a href="#prizes" className="text-muted-foreground hover:text-primary transition-colors">
                시상
              </a>
              <a href="#rules" className="text-muted-foreground hover:text-primary transition-colors">
                대회 규칙
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

      {/* Back Button */}
      <div className="container mx-auto px-4 py-4">
        <Button variant="ghost" asChild>
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            전체 대회 목록으로
          </Link>
        </Button>
      </div>

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <Badge className="mb-6 text-3xl px-12 py-4 bg-secondary/10 text-secondary border-secondary/30">
            🚀 제{competition.edition}회
          </Badge>
          <h1 className="text-6xl md:text-8xl font-bold mb-6 text-glow">
            <span className="text-secondary">우주</span> 최고
            <br />
            <span className="text-primary">실패</span> 대회
          </h1>
          <p className="text-2xl md:text-3xl text-secondary font-semibold mb-8 max-w-3xl mx-auto leading-relaxed">
            {competition.description || "실패, 결과가 아닌 질문으로 바꾸다"}
          </p>

          {isOpen && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="text-lg px-8 py-4 neon-glow" asChild>
                <a href={REGISTRATION_LINK} target="_blank" rel="noopener noreferrer">
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
                <a href="#rules">대회 규칙 보기</a>
              </Button>
            </div>
          )}

          {!isOpen && (
            <Badge className="text-lg px-6 py-3 bg-muted text-muted-foreground">이 대회는 종료되었습니다</Badge>
          )}
        </div>
      </section>

      {/* 대회 소개 섹션 */}
      <section id="about" className="py-20 px-4 bg-muted/20">
        <div className="container mx-auto">
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
                  제{competition.edition}회 우주 최고 실패 대회는{" "}
                  <span className="font-semibold text-foreground">
                    "단순히 실패를 극복하고 결국 희망과 웃음으로 마무리하는 자리"가 아닙니다.
                  </span>
                </p>
                <p className="text-lg">
                  포항 지역 최초의 실패 독려 프로젝트로서, 실패를 개인의 낙인으로 치부하지 않고 사회가 함께 격려하고
                  축하하는 축제의 장을 마련하고자 합니다.
                </p>
                <p className="text-lg font-semibold text-foreground">
                  참가자 모두가 자신이 극복하지 못한 실패를 진솔하게 나누는 것이 이 대회의 가장 중요한 목표입니다.
                </p>
              </div>
            </Card>

            <Card className="p-8 bg-card/50 backdrop-blur-sm border-secondary/20 hover:purple-glow transition-all duration-300">
              <div className="mb-6">
                <Badge className="text-lg px-4 py-2 bg-secondary/20 text-secondary border-secondary/30 mb-4">
                  대회 철학과 목적
                </Badge>
                <h3 className="text-3xl font-bold mb-4 text-secondary">
                  실패는 개인의 몫처럼 보이지만,
                  <br />
                  사실은 사회가 함께 책임져야 할 감정
                </h3>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p className="text-lg">
                  만약 실패를 공유할 수 있는 언어와 공간이 없다면 실패는 그저 실패로 끝날 수밖에 없습니다.
                </p>
                <p className="text-lg">
                  하지만{" "}
                  <span className="font-semibold text-foreground">
                    실패를 나누고 교류하는 과정에서 실패를 조금씩 익숙하게 받아들이고, 이로써 실패는 실패 이후로
                    나아가게 됩니다.
                  </span>
                </p>
                <p className="text-lg font-semibold text-foreground">
                  단순히 희망적이고 성공담으로 포장하지 않은 실패 그 자체를, 있는 그대로 회고하는 순간을 만들어 많은
                  분들의 이야기를 들려드리고 싶습니다.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Video Section */}
      {competition.video_url && (
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-glow">
                대회 <span className="text-primary">영상</span>
              </h2>
              <p className="text-xl text-muted-foreground">대회의 의미를 영상으로 만나보세요</p>
            </div>

            <div className="max-w-3xl mx-auto">
              <Card className="p-8 bg-card/50 backdrop-blur-sm border-primary/20 neon-glow">
                <div className="relative w-full" style={{ paddingBottom: "177.78%" }}>
                  <iframe
                    className="absolute top-0 left-0 w-full h-full rounded-lg"
                    src={`${competition.video_url}?title=0&byline=0&portrait=0&badge=0`}
                    title={`제${competition.edition}회 우주 최고 실패 대회 영상`}
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* Stats Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-8 text-center bg-card/50 backdrop-blur-sm border-primary/20 neon-glow">
              <div className="text-4xl font-bold text-primary mb-2">100+</div>
              <div className="text-xl text-muted-foreground">예상 참가자</div>
            </Card>
            <Card className="p-8 text-center bg-card/50 backdrop-blur-sm border-secondary/20 purple-glow">
              <div className="mb-4">
                <div className="text-xl font-bold text-secondary mb-2">참가자 전원</div>
                <div className="text-xl text-muted-foreground">「우주 최고 실패」 디지털 뱃지 수여</div>
              </div>
              <div>
                <div className="text-xl font-bold text-secondary mb-2">트랙별 수상자</div>
                <div className="text-xl text-muted-foreground">실패 도서 출간 저자 기회 제공 및 트로피 수여</div>
              </div>
            </Card>
            <Card className="p-8 text-center bg-card/50 backdrop-blur-sm border-primary/20 neon-glow">
              <div className="text-xl font-bold text-primary mb-2">자신의 실패 경험을 공유하고자 하는 모든 연령층</div>
              <div className="text-xl text-muted-foreground mt-2">1인당 1개 실패 경험만 참가 가능</div>
            </Card>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-glow">
              왜 <span className="text-primary">실패</span>를 자랑해야 할까요?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              실패는 혁신의 원동력이며, 가장 값진 배움의 순간입니다. 우리는 실패를 숨기지 않고 당당히 공유하며 함께
              성장합니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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

      {/* Poster Section */}
      <section id="poster" className="py-20 px-4 bg-muted/20">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-glow">
              대회 <span className="text-primary">포스터</span>
            </h2>
            <p className="text-xl text-muted-foreground">대회 정보를 한눈에 확인하고 공유하세요</p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Card className="p-8 bg-card/50 backdrop-blur-sm border-primary/20 neon-glow">
              <img
                src={competition.cover_image || "/images/poster.jpg"}
                alt={`제${competition.edition}회 우주 최고 실패 대회 포스터`}
                className="w-full h-auto rounded-lg shadow-2xl"
              />
            </Card>
          </div>
        </div>
      </section>

      {/* Schedule Section */}
      <section id="schedule" className="py-20 px-4 bg-muted/20">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-glow">
              대회 <span className="text-secondary">일정</span>
            </h2>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
                <div className="flex items-center gap-4 mb-4">
                  <Calendar className="h-6 w-6 text-primary" />
                  <Badge className="bg-primary/20 text-primary">접수 기간</Badge>
                </div>
                <h3 className="text-xl font-bold mb-2">참가 신청</h3>
                <p className="text-muted-foreground mb-2">~ 2025년 10월 27일 (월)</p>
                <p className="text-sm text-muted-foreground mb-2">1분 분량의 영상 또는 서면</p>
              </Card>

              <Card className="p-6 bg-card/50 backdrop-blur-sm border-secondary/20">
                <div className="flex items-center gap-4 mb-4">
                  <Star className="h-6 w-6 text-secondary" />
                  <Badge className="bg-secondary/20 text-secondary">예선 발표</Badge>
                </div>
                <h3 className="text-xl font-bold mb-2">예선 합격자 발표</h3>
                <p className="text-muted-foreground mb-2">2025년 11월 4일 (화)</p>
              </Card>

              <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
                <div className="flex items-center gap-4 mb-4">
                  <Trophy className="h-6 w-6 text-primary" />
                  <Badge className="bg-primary/20 text-primary">본선</Badge>
                </div>
                <h3 className="text-xl font-bold mb-2">본선</h3>
                <p className="text-muted-foreground mb-2">2025년 11월 8일 (토) 13:00 ~ 17:00</p>
                <p className="text-sm text-muted-foreground mb-2">오프라인 PT로 진행</p>
                <div className="flex items-start gap-2 text-sm text-muted-foreground mt-3 bg-muted/30 p-3 rounded-lg">
                  <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-semibold mb-1">
                      본선 장소: {competition.location || "환동해지역혁신원 파랑뜰 2층 드림홀"}
                    </div>
                    <div>경상북도 포항시 북구 장성로 109</div>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-card/50 backdrop-blur-sm border-secondary/20">
                <div className="flex items-center gap-4 mb-4">
                  <Star className="h-6 w-6 text-secondary" />
                  <Badge className="bg-secondary/20 text-secondary">최종 발표</Badge>
                </div>
                <h3 className="text-xl font-bold mb-2">최종 합격자 발표</h3>
                <p className="text-muted-foreground mb-2">2025년 11월 14일 (금) 예정</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Prizes Section */}
      <section id="prizes" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-glow">
              <span className="text-primary">시상</span> 내역
            </h2>
            <p className="text-xl text-muted-foreground">실패들을 위한 특별한 보상이 기다립니다!</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="p-8 bg-card/50 backdrop-blur-sm border-primary/20 mb-6">
              <div className="text-center mb-6">
                <div className="text-2xl font-bold text-primary mb-2">참가자 전원</div>
                <p className="text-muted-foreground">「우주 최고 실패」 디지털 뱃지 수여</p>
              </div>
            </Card>

            <Card className="p-8 bg-gradient-to-b from-primary/20 to-primary/5 border-primary/30 neon-glow">
              <div className="text-center">
                <div className="text-6xl mb-4">🏆</div>
                <h3 className="text-2xl font-bold mb-4 text-primary">트랙별 (청소년, 일반 트랙) 수상자</h3>
                <div className="space-y-2 text-muted-foreground">
                  <p className="text-lg">실패 도서 출간 저자 기회 제공</p>
                  <p className="text-lg">🏆 트로피 수여</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Rules Section */}
      <section id="rules" className="py-20 px-4 bg-muted/20">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-glow">
              대회 <span className="text-primary">규칙</span>
            </h2>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            <Card className="p-8 bg-card/50 backdrop-blur-sm border-primary/20">
              <h3 className="text-2xl font-bold mb-4 text-primary">1. 참가 자격</h3>
              <div className="space-y-2 text-muted-foreground">
                <p className="text-lg">→ 자신의 실패 경험을 공유하고자 하는 모든 연령층</p>
                <p className="text-lg">→ 학생, 직장인, 주부 등 실패를 나누고 싶은 누구나!</p>
              </div>
            </Card>

            <Card className="p-8 bg-card/50 backdrop-blur-sm border-secondary/20">
              <h3 className="text-2xl font-bold mb-4 text-secondary">2. 참가 제한</h3>
              <p className="text-lg text-muted-foreground">1인당 1개 실패 경험만 참가 가능</p>
            </Card>

            <Card className="p-8 bg-card/50 backdrop-blur-sm border-primary/20">
              <h3 className="text-2xl font-bold mb-4 text-primary">3. 참가 비용</h3>
              <p className="text-lg text-muted-foreground">무료</p>
            </Card>

            <Card className="p-8 bg-card/50 backdrop-blur-sm border-secondary/20">
              <h3 className="text-2xl font-bold mb-4 text-secondary">4. 참가 방식</h3>
              <div className="space-y-3 text-muted-foreground">
                <div>
                  <p className="font-semibold text-lg mb-2 text-secondary/50">예선</p>
                  <p className="text-lg">말하기, 노래, 춤, 기타 자유로운 표현 방식을 담은 1분 분량의 영상 또는 서면</p>
                </div>
                <div>
                  <p className="font-semibold text-lg mb-2 text-secondary/50">본선</p>
                  <p className="text-lg">오프라인 PT로 진행</p>
                </div>
              </div>
            </Card>
            <Card className="p-8 bg-card/50 backdrop-blur-sm border-primary/20">
              <h3 className="text-2xl font-bold mb-4 text-primary">5. 지원 트랙</h3>
              <p className="text-lg text-muted-foreground">청소년 트랙: 만 18세까지</p>
              <p className="text-lg text-muted-foreground">일반 트랙: 만 19세부터</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-glow">
              <span className="text-primary">문의</span>
            </h2>
          </div>

          <div className="max-w-2xl mx-auto">
            <Card className="p-8 bg-card/50 backdrop-blur-sm border-primary/20">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <Mail className="h-6 w-6 text-primary" />
                  <div>
                    <a href="mailto:ckdrnr50@naver.com" className="text-lg hover:text-primary transition-colors">
                      ckdrnr50@naver.com
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Mail className="h-6 w-6 text-primary" />
                  <div>
                    <a href="mailto:visionq@handong.edu" className="text-lg hover:text-primary transition-colors">
                      visionq@handong.edu
                    </a>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-muted/30 rounded-lg">
                  <p className="text-sm text-muted-foreground">메일로 문의주시면 빠르게 답변드리도록 하겠습니다.</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Links Section */}
      <section className="py-16 px-4 bg-muted/20">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Link href="/announcements">
              <Card className="p-8 bg-card/50 backdrop-blur-sm border-primary/20 hover:neon-glow transition-all duration-300 cursor-pointer h-full">
                <div className="flex items-center gap-4 mb-4">
                  <MessageCircle className="h-8 w-8 text-primary" />
                  <h3 className="text-2xl font-bold">공지사항</h3>
                </div>
                <p className="text-muted-foreground">대회 관련 최신 소식과 공지사항을 확인하세요.</p>
              </Card>
            </Link>
            <Link href="/faq">
              <Card className="p-8 bg-card/50 backdrop-blur-sm border-secondary/20 hover:purple-glow transition-all duration-300 cursor-pointer h-full">
                <div className="flex items-center gap-4 mb-4">
                  <HelpCircle className="h-8 w-8 text-secondary" />
                  <h3 className="text-2xl font-bold">자주 묻는 질문</h3>
                </div>
                <p className="text-muted-foreground">대회에 관한 자주 묻는 질문과 답변을 확인하세요.</p>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {isOpen && (
        <section id="register" className="py-20 px-4 bg-gradient-to-r from-primary/10 to-secondary/10">
          <div className="container mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-glow">
              당신의 실패 스토리를
              <br />
              <span className="text-primary">우주에 알려주세요!</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              지금 바로 참가 신청을 하고, 실패를 축하하는 축제의 주인공이 되세요!
            </p>
            <Button size="lg" className="text-xl px-12 py-6 neon-glow" asChild>
              <a href={REGISTRATION_LINK} target="_blank" rel="noopener noreferrer">
                <Rocket className="mr-2 h-6 w-6" />
                참가 신청하기
              </a>
            </Button>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border/50">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <Rocket className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold">제{competition.edition}회 우주 최고 실패 대회</span>
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
