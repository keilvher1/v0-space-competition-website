import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Rocket, ArrowLeft, HelpCircle } from "lucide-react"
import Link from "next/link"

export default async function FAQPage() {
  const supabase = await createClient()

  const { data: faqs } = await supabase
    .from("faqs")
    .select("*")
    .eq("is_published", true)
    .order("sort_order", { ascending: true })

  // FAQ를 카테고리별로 그룹화
  const groupedFaqs = faqs?.reduce(
    (acc, faq) => {
      const category = faq.category || "일반"
      if (!acc[category]) {
        acc[category] = []
      }
      acc[category].push(faq)
      return acc
    },
    {} as Record<string, typeof faqs>,
  )

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
            <div className="mx-auto mb-4 w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center">
              <HelpCircle className="h-8 w-8 text-secondary" />
            </div>
            <h1 className="text-4xl font-bold mb-4 text-glow">자주 묻는 질문</h1>
            <p className="text-muted-foreground">대회에 관해 궁금한 점을 확인하세요</p>
          </div>

          {groupedFaqs && Object.keys(groupedFaqs).length > 0 ? (
            <div className="space-y-8">
              {Object.entries(groupedFaqs).map(([category, categoryFaqs]) => (
                <div key={category}>
                  <h2 className="text-2xl font-bold mb-4 text-primary">{category}</h2>
                  <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
                    <CardContent className="pt-6">
                      <Accordion type="single" collapsible className="w-full">
                        {categoryFaqs?.map((faq, index) => (
                          <AccordionItem key={faq.id} value={`item-${index}`} className="border-border/50">
                            <AccordionTrigger className="text-left hover:text-primary">{faq.question}</AccordionTrigger>
                            <AccordionContent className="text-muted-foreground leading-relaxed">
                              {faq.answer}
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          ) : (
            <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
              <CardContent className="py-12 text-center">
                <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">아직 등록된 FAQ가 없습니다</h3>
                <p className="text-muted-foreground">궁금한 점은 이메일로 문의해주세요.</p>
              </CardContent>
            </Card>
          )}

          <Card className="mt-12 bg-card/50 backdrop-blur-sm border-secondary/20">
            <CardContent className="py-8 text-center">
              <h3 className="text-xl font-semibold mb-2">더 궁금한 점이 있으신가요?</h3>
              <p className="text-muted-foreground mb-4">아래 이메일로 문의해주세요.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="mailto:ckdrnr50@naver.com" className="text-primary hover:underline">
                  ckdrnr50@naver.com
                </a>
                <span className="hidden sm:inline text-muted-foreground">|</span>
                <a href="mailto:visionq@handong.edu" className="text-primary hover:underline">
                  visionq@handong.edu
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
